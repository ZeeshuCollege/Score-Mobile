// ==============================================================================
// SCORE — Firebase Cloud Messaging Notification Sender
// Supabase Edge Function (Deno)
//
// Sends push notifications via Firebase Cloud Messaging HTTP v1 API.
// Fetches device tokens from Supabase, deactivates invalid tokens.
//
// Security:
// - Validates Supabase JWT before sending any notification
// - Students can only send to their own devices
// - Admin broadcast requires SUPABASE_SERVICE_ROLE_KEY pattern (not implemented yet)
// - Firebase service account credentials stored ONLY in Supabase secrets
// - Never logs FCM tokens or access tokens
//
// Environment secrets (set via: supabase secrets set KEY=VALUE):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//   FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_PROJECT_ID
// ==============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Google OAuth2 Access Token from Service Account ──────────────────────

function encodeBase64Url(input: string | Uint8Array): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function getGoogleAccessToken(
  serviceAccountJson: string
): Promise<string> {
  const sa = JSON.parse(serviceAccountJson) as {
    client_email: string;
    private_key: string;
  };

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = encodeBase64Url(JSON.stringify(header));
  const payloadB64 = encodeBase64Url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  // Parse PEM private key
  const pemBody = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const keyBuffer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const signatureB64 = encodeBase64Url(new Uint8Array(signature));
  const jwtToken = `${signingInput}.${signatureB64}`;

  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    console.error("Google token exchange failed:", tokenResp.status);
    throw new Error("Failed to obtain Google access token");
  }

  const tokenData = (await tokenResp.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("No access_token in Google token response");
  }

  return tokenData.access_token;
}

// ─── FCM Message Sender ────────────────────────────────────────────────────

interface FcmSendResult {
  tokenId: string;
  success: boolean;
  invalidToken: boolean;
}

async function sendFcmMessage(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  accessToken: string;
  projectId: string;
}): Promise<{ success: boolean; invalidToken: boolean }> {
  const { token, title, body, data, accessToken, projectId } = params;

  const message = {
    message: {
      token,
      notification: { title, body },
      data: data ?? {},
      android: {
        priority: "high",
        notification: {
          channel_id: "score_high_importance",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            alert: { title, body },
            sound: "default",
            badge: 1,
          },
        },
      },
    },
  };

  const resp = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  );

  if (resp.ok) {
    return { success: true, invalidToken: false };
  }

  const errData = (await resp.json()) as {
    error?: { details?: Array<{ errorCode?: string }> };
  };
  const errCode = errData?.error?.details?.[0]?.errorCode ?? "";

  // Log only the error code, never the token
  console.error(`FCM send failed: ${errCode || resp.status}`);

  const invalidToken = ["UNREGISTERED", "INVALID_ARGUMENT"].includes(errCode);
  return { success: false, invalidToken };
}

// ─── Main Handler ──────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    // ── 1. Authenticate caller ───────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        {
          status: 401,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // ── 2. Parse request ─────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const {
      user_id: targetUserId,
      title,
      body: notifBody,
      data: extraData,
    } = body as {
      user_id?: string;
      title?: string;
      body?: string;
      data?: Record<string, string>;
    };

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "title is required and must be non-empty" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    if (
      !notifBody ||
      typeof notifBody !== "string" ||
      notifBody.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "body is required and must be non-empty" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 3. Authorization check ────────────────────────────────────────────
    // Students can only send to their own devices.
    // Admin broadcast is a future feature requiring role verification.
    const resolvedTargetUserId = targetUserId ?? user.id;
    if (resolvedTargetUserId !== user.id) {
      return new Response(
        JSON.stringify({
          error:
            "Insufficient permissions — you can only send notifications to your own devices",
        }),
        {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 4. Fetch active device tokens ────────────────────────────────────
    const { data: tokenRecords, error: tokensError } = await supabase
      .from("device_tokens")
      .select("id, fcm_token")
      .eq("user_id", resolvedTargetUserId)
      .eq("is_active", true)
      .eq("notification_enabled", true);

    if (tokensError) {
      console.error("Failed to fetch device tokens:", tokensError.message);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve device tokens" }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    if (!tokenRecords || tokenRecords.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          sent_count: 0,
          message: "No active devices registered for notifications",
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 5. Get FCM access token ───────────────────────────────────────────
    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
    const projectId = Deno.env.get("FIREBASE_PROJECT_ID");

    if (!serviceAccountJson || !projectId) {
      console.error("Firebase configuration missing from secrets");
      return new Response(
        JSON.stringify({ error: "Notification service not configured" }),
        {
          status: 503,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    let accessToken: string;
    try {
      accessToken = await getGoogleAccessToken(serviceAccountJson);
    } catch (err) {
      console.error(
        "Failed to get FCM access token:",
        err instanceof Error ? err.message : "unknown"
      );
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with notification service" }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 6. Send notifications ─────────────────────────────────────────────
    let sentCount = 0;
    const invalidTokenIds: string[] = [];

    for (const record of tokenRecords as Array<{ id: string; fcm_token: string }>) {
      const result = await sendFcmMessage({
        token: record.fcm_token,
        title: title.trim(),
        body: notifBody.trim(),
        data: extraData,
        accessToken,
        projectId,
      });

      if (result.success) {
        sentCount++;
      } else if (result.invalidToken) {
        invalidTokenIds.push(record.id);
      }
    }

    // ── 7. Deactivate invalid tokens ──────────────────────────────────────
    if (invalidTokenIds.length > 0) {
      const { error: deactivateErr } = await supabase
        .from("device_tokens")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .in("id", invalidTokenIds);

      if (deactivateErr) {
        console.error("Failed to deactivate invalid tokens:", deactivateErr.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent_count: sentCount,
        total_tokens: tokenRecords.length,
        invalid_tokens_cleaned: invalidTokenIds.length,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(
      "send-notification error:",
      err instanceof Error ? err.message : "unknown error"
    );
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

