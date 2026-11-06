// ==============================================================================
// SCORE — Cloudflare R2 Presigned URL Generator
// Supabase Edge Function (Deno)
//
// Generates AWS Signature V4 presigned URLs for R2 upload and download.
// Uses only Deno native crypto — no external signing libraries.
//
// Security:
// - Validates Supabase JWT before issuing any presigned URL
// - Enforces ownership for private bucket downloads
// - Never logs presigned URLs
// - Upload expiry: 15 minutes (900s)
// - Download expiry: 60 minutes (3600s)
// - Max file size: 50 MB
//
// Environment secrets (set via: supabase secrets set KEY=VALUE):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//   CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
//   R2_BUCKET_PUBLIC, R2_BUCKET_PRIVATE, R2_ENDPOINT
// ==============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const ALLOWED_CATEGORIES = [
  "question_images",
  "question_diagrams",
  "educational_pdfs",
  "study_materials",
  "user_documents",
];

const PRIVATE_CATEGORIES = ["user_documents"];
const MAX_FILE_SIZE = 52428800; // 50 MB

// ─── AWS Signature V4 Helpers ──────────────────────────────────────────────

async function hmacSha256(
  key: ArrayBuffer | string,
  data: string
): Promise<ArrayBuffer> {
  const keyMaterial =
    typeof key === "string" ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(data)
  );
}

async function sha256Hex(data: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data)
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function mimeToExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/pdf": "pdf",
  };
  return map[mimeType] ?? "bin";
}

function generateObjectId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Presigned URL Generator ───────────────────────────────────────────────

async function buildPresignedUrl(params: {
  method: "PUT" | "GET";
  bucket: string;
  objectKey: string;
  mimeType: string;
  expirySeconds: number;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}): Promise<string> {
  const {
    method,
    bucket,
    objectKey,
    mimeType,
    expirySeconds,
    endpoint,
    accessKeyId,
    secretAccessKey,
  } = params;

  const region = "auto"; // Cloudflare R2 uses "auto"
  const service = "s3";

  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, "").substring(0, 8);
  const amzDate =
    now.toISOString().replace(/[-:]/g, "").substring(0, 15) + "Z";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const credential = `${accessKeyId}/${credentialScope}`;

  // Build the base URL for the object
  const endpointClean = endpoint.replace(/\/$/, "");
  const baseUrl = `${endpointClean}/${bucket}/${objectKey}`;
  const urlObj = new URL(baseUrl);

  // Required query parameters for presigned URL
  const qsParams: [string, string][] = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", credential],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(expirySeconds)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  if (method === "PUT") {
    qsParams.push(["X-Amz-Content-Type", mimeType]);
  }

  // Sort and encode canonical query string
  const sortedParams = [...qsParams].sort(([a], [b]) => a.localeCompare(b));
  const canonicalQs = sortedParams
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    )
    .join("&");

  // Canonical request
  const host = urlObj.hostname;
  const canonicalUri = `/${bucket}/${objectKey}`;
  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQs,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // String to sign
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  // Signing key derivation
  const kDate = await hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, "aws4_request");
  const signature = toHex(await hmacSha256(kSigning, stringToSign));

  // Build final presigned URL
  const finalUrl = new URL(baseUrl);
  for (const [k, v] of sortedParams) {
    finalUrl.searchParams.set(k, v);
  }
  finalUrl.searchParams.set("X-Amz-Signature", signature);

  return finalUrl.toString();
}

// ─── Main Handler ──────────────────────────────────────────────────────────

serve(async (req) => {
  // Handle CORS preflight
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized — invalid or expired token" }),
        {
          status: 401,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 2. Parse and validate request body ──────────────────────────────
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
      operation,
      file_category,
      mime_type,
      file_size,
      object_key: requestedKey,
    } = body as {
      operation?: string;
      file_category?: string;
      mime_type?: string;
      file_size?: number;
      object_key?: string;
    };

    if (!["upload", "download"].includes(operation ?? "")) {
      return new Response(
        JSON.stringify({ error: "operation must be 'upload' or 'download'" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    if (!file_category || !ALLOWED_CATEGORIES.includes(file_category)) {
      return new Response(
        JSON.stringify({
          error: `file_category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
        }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // ── 3. Determine bucket ─────────────────────────────────────────────
    const isPrivate = PRIVATE_CATEGORIES.includes(file_category);
    const bucketName = isPrivate
      ? Deno.env.get("R2_BUCKET_PRIVATE")!
      : Deno.env.get("R2_BUCKET_PUBLIC")!;

    // ── 4. Build object key and validate for the operation ──────────────
    let objectKey: string;

    if (operation === "upload") {
      if (!mime_type || !ALLOWED_MIME_TYPES.includes(mime_type)) {
        return new Response(
          JSON.stringify({
            error: `mime_type must be one of: ${ALLOWED_MIME_TYPES.join(", ")}`,
          }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      if (
        typeof file_size !== "number" ||
        file_size <= 0 ||
        file_size > MAX_FILE_SIZE
      ) {
        return new Response(
          JSON.stringify({
            error: `file_size must be a positive number not exceeding ${MAX_FILE_SIZE} bytes (50 MB)`,
          }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      const ext = mimeToExtension(mime_type);
      const uniqueId = generateObjectId();
      objectKey = `${user.id}/${file_category}/${uniqueId}.${ext}`;
    } else {
      // download
      if (!requestedKey || typeof requestedKey !== "string") {
        return new Response(
          JSON.stringify({
            error: "object_key is required for download operation",
          }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      // ── Ownership check for private objects ────────────────────────
      // Private objects are stored under {user_id}/... path prefix.
      // Reject if the requested key does not start with the caller's user_id.
      if (isPrivate && !requestedKey.startsWith(`${user.id}/`)) {
        return new Response(
          JSON.stringify({
            error: "Access denied — you do not own this object",
          }),
          {
            status: 403,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      objectKey = requestedKey;
    }

    // ── 5. Generate presigned URL ────────────────────────────────────────
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID")!;
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY")!;
    const r2Endpoint = Deno.env.get("R2_ENDPOINT")!;

    const expirySeconds = operation === "upload" ? 900 : 3600;
    const method = operation === "upload" ? "PUT" : "GET";

    const presignedUrl = await buildPresignedUrl({
      method,
      bucket: bucketName,
      objectKey,
      mimeType: mime_type ?? "application/octet-stream",
      expirySeconds,
      endpoint: r2Endpoint,
      accessKeyId,
      secretAccessKey,
    });

    const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

    // SECURITY: Never log the presigned URL — it is a temporary credential
    return new Response(
      JSON.stringify({
        presigned_url: presignedUrl,
        object_key: objectKey,
        expires_at: expiresAt,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // Never expose internal error details to the client
    console.error(
      "r2-presign error:",
      err instanceof Error ? err.message : "unknown error"
    );
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

