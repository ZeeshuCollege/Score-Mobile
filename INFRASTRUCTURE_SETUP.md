# SCORE — Infrastructure Setup Guide

> This is the step-by-step manual configuration guide for the SCORE production infrastructure.  
> Follow each section completely before moving to the next.  
> Code is already in place — this guide covers external dashboard and credential configuration.

---

## Prerequisites

- Cloudflare account with R2 access
- Firebase account / Google account with Firebase Console access
- Apple Developer Program membership (for iOS push notifications)
- Supabase project already running (you have the URL and anon key)
- Supabase CLI installed: `npm install -g supabase`

---

## Section 1 — Cloudflare R2 Buckets

### 1.1 Create the Public Assets Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **R2 Object Storage**
2. Click **Create bucket**
3. Name: `score-public-assets`
4. Location: **Asia Pacific** (closest to India)
5. Click **Create bucket**

### 1.2 Create the Private Uploads Bucket

1. Click **Create bucket** again
2. Name: `score-private-uploads`
3. Location: **Asia Pacific**
4. Click **Create bucket**
5. ⚠️ Do NOT set public access on this bucket — it must remain private

### 1.3 Generate R2 API Credentials

1. In R2 Object Storage → Click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Settings:
   - Token name: `SCORE Production`
   - Permissions: **Object Read & Write**
   - Bucket access: **Apply to specific buckets only** → select both `score-public-assets` and `score-private-uploads`
   - TTL: **Forever** (or set an appropriate rotation period)
4. Click **Create API Token**
5. **Copy and save immediately:**
   - Access Key ID → this is `R2_ACCESS_KEY_ID`
   - Secret Access Key → this is `R2_SECRET_ACCESS_KEY`
   - ⚠️ The secret key is shown only once — save it now

### 1.4 Find Your Cloudflare Account ID and R2 Endpoint

1. R2 Dashboard page URL contains your account ID: `dash.cloudflare.com/{ACCOUNT_ID}/r2/`
2. Or go to any R2 bucket → Settings → endpoint shows:  
   `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`
3. Note these values:
   - `CLOUDFLARE_ACCOUNT_ID` = the ID in the URL
   - `R2_ENDPOINT` = `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`

### 1.5 Configure CORS for the Public Bucket

1. Go to `score-public-assets` bucket → **Settings** tab → **CORS Policy**
2. Click **Add CORS policy** and enter:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

> **For production:** Replace `"*"` with your specific app domains once you have them.

3. For the `score-private-uploads` bucket, apply the same CORS policy (PUT for uploads, GET for presigned downloads).

---

## Section 2 — Cloudflare CDN (Custom Domain for Public Assets)

### 2.1 Connect Custom Domain to Public R2 Bucket

> **Prerequisite:** Your domain must be on Cloudflare (nameservers pointing to Cloudflare).

1. Go to `score-public-assets` bucket → **Settings** → **Custom Domain**
2. Click **Connect Domain**
3. Enter: `cdn.your-domain.com` (replace with your actual domain)
4. Cloudflare automatically:
   - Creates a CNAME DNS record pointing to R2
   - Provisions an SSL certificate
   - Enables HTTPS

> If your domain is NOT on Cloudflare, transfer DNS to Cloudflare first or use a subdomain.

### 2.2 Configure Cache Rules

1. Go to your domain → **Rules** → **Cache Rules**
2. Create rule: **Cache Public Educational Assets**
   - When URL path matches: `cdn.your-domain.com/question_images/*`
   - Cache eligibility: **Eligible for cache**
   - Edge TTL: **1 year** (for versioned/immutable assets)
   - Browser TTL: **1 day**
3. Add similar rules for:
   - `cdn.your-domain.com/question_diagrams/*` → 1 year TTL
   - `cdn.your-domain.com/educational_pdfs/*` → 1 day TTL
   - `cdn.your-domain.com/study_materials/*` → 1 day TTL

### 2.3 Add CDN Domain to Flutter Build

After setting up the CDN domain, pass it at build time:

```bash
flutter build apk --dart-define=R2_PUBLIC_DOMAIN=https://cdn.your-domain.com
flutter build ios --dart-define=R2_PUBLIC_DOMAIN=https://cdn.your-domain.com
```

Or add to your `.env` file (for local development reference — not automatically loaded by Flutter):
```
R2_PUBLIC_DOMAIN=https://cdn.your-domain.com
```

---

## Section 3 — Firebase Project Setup

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Project name: `SCORE`
4. Enable Google Analytics: Optional (recommended for future use)
5. Click **Create project**

### 3.2 Register Android App in Firebase

1. In your Firebase project → click **+ Add app** → select **Android** (the robot icon)
2. Enter:
   - Android package name: `com.score.app.score`
   - App nickname: `SCORE Android`
   - Debug signing certificate SHA-1: (optional for now; required for Google Sign-In via Firebase)
3. Click **Register app**
4. **Download `google-services.json`**
5. Place it at: `android/app/google-services.json`
   - Rename: remove the `.placeholder` extension from `android/app/google-services.json.placeholder`
   - Replace the placeholder file with the real `google-services.json`
6. Click **Next** through the remaining steps (Gradle config is already done in the project)

### 3.3 Register iOS App in Firebase

1. Click **+ Add app** → select **iOS** (the Apple icon)
2. Enter:
   - iOS bundle ID: (open `ios/Runner.xcodeproj/project.pbxproj` and search for `PRODUCT_BUNDLE_IDENTIFIER`)
   - App nickname: `SCORE iOS`
3. Click **Register app**
4. **Download `GoogleService-Info.plist`**
5. Add to Xcode project:
   - Open `ios/Runner.xcworkspace` in Xcode
   - Right-click on the **Runner** folder in the Project Navigator
   - Select **Add Files to "Runner"**
   - Browse to `GoogleService-Info.plist`
   - ✅ Check **Copy items if needed**
   - ✅ Check **Target: Runner**
   - Click **Add**
6. Find the `REVERSED_CLIENT_ID` value inside `GoogleService-Info.plist`
7. Update `ios/Runner/Info.plist` — uncomment and fill in the CFBundleURLTypes section:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>YOUR_REVERSED_CLIENT_ID_HERE</string>
    </array>
  </dict>
</array>
```

### 3.4 Enable Cloud Messaging in Firebase

1. Firebase Console → your project → **Project Settings** (gear icon)
2. Click **Cloud Messaging** tab
3. Confirm **Firebase Cloud Messaging API (V1)** is enabled (it is by default for new projects)
4. Note your **Project ID** → this is `FIREBASE_PROJECT_ID`

---

## Section 4 — APNs Configuration (iOS Push Notifications)

> iOS push notifications require an APNs (Apple Push Notification service) authentication key. This cannot be configured in code.

### 4.1 Create APNs Authentication Key

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles** → **Keys**
3. Click the **+** button to create a new key
4. Enter Key Name: `SCORE FCM APNs Key`
5. Check **Apple Push Notifications service (APNs)**
6. Click **Continue** → **Register**
7. **Download the `.p8` file** — this can only be downloaded once
8. Note the **Key ID** shown on the page

### 4.2 Enable Push Notifications Capability in Xcode

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select the **Runner** target → **Signing & Capabilities** tab
3. Click **+ Capability**
4. Add **Push Notifications**
5. Add **Background Modes** → check:
   - ✅ **Background fetch**
   - ✅ **Remote notifications**

> The `UIBackgroundModes` entries in `Info.plist` are already added by the code changes.

### 4.3 Upload APNs Key to Firebase

1. Firebase Console → Project Settings → **Cloud Messaging** tab
2. Under **Apple app configuration** → find your iOS app
3. Click **Upload** next to **APNs Authentication Key**
4. Upload the `.p8` file downloaded in step 4.1
5. Enter:
   - Key ID: (from Apple Developer Portal)
   - Team ID: (from Apple Developer Portal → Membership → Team ID)
6. Click **Upload**

---

## Section 5 — Firebase Service Account (for Edge Functions)

### 5.1 Generate Service Account Key

1. Firebase Console → Project Settings → **Service accounts** tab
2. Click **Generate new private key**
3. Click **Generate key**
4. A JSON file will download — this is your Firebase service account
5. ⚠️ **Never commit this file to version control**
6. ⚠️ **Never put this file in the Flutter project directory**
7. Keep it in a secure location — you will paste its contents as a Supabase secret

---

## Section 6 — Supabase Edge Function Secrets

> Supabase secrets are encrypted at rest and injected as environment variables into Edge Functions. They are never exposed in code or logs.

### 6.1 Install Supabase CLI and Login

```bash
npm install -g supabase
supabase login
```

### 6.2 Link to Your Supabase Project

```bash
cd "d:\CodeSupa\Score Mobile"
supabase link --project-ref jpjvcimeggkcpvlybciq
```

### 6.3 Set All Required Secrets

Run these commands one at a time, replacing each placeholder with the actual value:

```bash
# Cloudflare R2 credentials
supabase secrets set CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
supabase secrets set R2_ACCESS_KEY_ID=your-r2-access-key-id
supabase secrets set R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
supabase secrets set R2_BUCKET_PUBLIC=score-public-assets
supabase secrets set R2_BUCKET_PRIVATE=score-private-uploads
supabase secrets set R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Firebase credentials
supabase secrets set FIREBASE_PROJECT_ID=your-firebase-project-id

# Firebase service account JSON (paste the ENTIRE contents of the downloaded JSON file)
# On Windows PowerShell:
$json = Get-Content "path\to\your-service-account.json" -Raw
supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON=$json
```

### 6.4 Verify Secrets are Set

```bash
supabase secrets list
```

Expected output: all 8 secrets listed (without their values).

---

## Section 7 — Deploy Supabase Edge Functions

### 7.1 Deploy Both Functions

```bash
cd "d:\CodeSupa\Score Mobile"

# Deploy the R2 presigned URL generator
supabase functions deploy r2-presign --project-ref jpjvcimeggkcpvlybciq

# Deploy the FCM notification sender
supabase functions deploy send-notification --project-ref jpjvcimeggkcpvlybciq
```

### 7.2 Verify Functions are Deployed

1. Go to Supabase Dashboard → **Edge Functions**
2. Both `r2-presign` and `send-notification` should appear as **Active**
3. Test `r2-presign` with a POST request (requires a valid Supabase JWT):

```bash
# Get a JWT by logging in through the app first, then copy from Flutter debug logs
# or use the Supabase dashboard API tester

curl -X POST https://jpjvcimeggkcpvlybciq.supabase.co/functions/v1/r2-presign \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"operation":"upload","file_category":"question_images","mime_type":"image/jpeg","file_size":100000}'
```

Expected response: `{"presigned_url":"...","object_key":"...","expires_at":"..."}`

---

## Section 8 — Run Database Migrations

> Run these migrations in order. Each is safe and idempotent (uses `IF NOT EXISTS`).

### 8.1 Run Migration 001 (New Tables)

1. Supabase Dashboard → **SQL Editor** → **New Query**
2. Open `supabase/migrations/001_file_uploads_device_tokens.sql`
3. Paste entire contents into SQL Editor
4. Click **Run** (▶️)
5. Expected output: no errors, statements executed successfully

### 8.2 Run Migration 002 (Performance Indexes)

1. Supabase Dashboard → **SQL Editor** → **New Query**
2. Open `supabase/migrations/002_supabase_audit_improvements.sql`
3. Paste entire contents into SQL Editor
4. Click **Run** (▶️)
5. Expected output: `CREATE INDEX` statements succeed; audit notes (comments) are ignored

### 8.3 Verify Tables Exist

In Supabase Dashboard → **Table Editor**, confirm you see:
- `file_uploads`
- `device_tokens`

Both should show RLS as **Enabled**.

---

## Section 9 — Testing

### 9.1 Test File Upload (R2)

1. Build and run the app on a device/emulator
2. Log in with a valid account
3. In Flutter, test via the service directly in a debug build:

```dart
// Add this temporarily to any screen for testing
final result = await FileUploadService.instance.uploadFile(
  file: File('path/to/test.jpg'),
  mimeType: 'image/jpeg',
  category: FileCategory.questionImages,
  originalFileName: 'test.jpg',
);
print(result.success ? 'Upload OK: ${result.objectKey}' : 'Failed: ${result.errorMessage}');
```

4. Verify the file appears in Cloudflare R2 → `score-public-assets` bucket
5. Verify a row is inserted in Supabase `file_uploads` table

### 9.2 Test Push Notification

1. Log in on a physical device (emulators may not receive FCM)
2. Check Supabase `device_tokens` table — a row should appear for your device
3. Send a test notification via the Edge Function:

```bash
curl -X POST https://jpjvcimeggkcpvlybciq.supabase.co/functions/v1/send-notification \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Notification","body":"SCORE infrastructure working!"}'
```

4. The notification should appear on your device

### 9.3 Test CDN Delivery

After CDN is configured:
1. Upload a public image using FileUploadService
2. Construct the CDN URL: `https://cdn.your-domain.com/{object_key}`
3. Open the URL in a browser — the image should load
4. Check Cloudflare Cache → verify the response has `cf-cache-status: HIT` on second request

### 9.4 Test Logout Token Deactivation

1. Log in on a device (verify token in `device_tokens` with `is_active = true`)
2. Log out from the app
3. Check Supabase `device_tokens` — `is_active` should be `false` for that device row
4. Send a test notification — it should return `sent_count: 0`

---

## Section 10 — Post-Deployment Checklist

- [ ] Both R2 buckets created with correct names
- [ ] R2 API token generated with read/write permissions on both buckets
- [ ] CORS configured on both R2 buckets
- [ ] CDN custom domain connected to public R2 bucket
- [ ] Cache rules configured in Cloudflare for public assets
- [ ] Firebase project created
- [ ] Android app registered in Firebase with package `com.score.app.score`
- [ ] `google-services.json` downloaded and placed at `android/app/`
- [ ] iOS app registered in Firebase with correct bundle ID
- [ ] `GoogleService-Info.plist` downloaded and added to Xcode Runner target
- [ ] `CFBundleURLTypes` updated in `ios/Runner/Info.plist` with REVERSED_CLIENT_ID
- [ ] Push Notifications capability added in Xcode
- [ ] APNs authentication key created in Apple Developer Portal
- [ ] APNs key uploaded to Firebase Console
- [ ] Firebase service account JSON downloaded
- [ ] All 8 Supabase Edge Function secrets set
- [ ] `r2-presign` function deployed
- [ ] `send-notification` function deployed
- [ ] Migration 001 executed in Supabase SQL editor
- [ ] Migration 002 executed in Supabase SQL editor
- [ ] File upload test passed
- [ ] Push notification test passed
- [ ] CDN delivery test passed
- [ ] Logout token deactivation verified

