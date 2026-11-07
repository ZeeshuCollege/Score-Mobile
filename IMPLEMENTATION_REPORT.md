# SCORE Infrastructure Integration — Implementation Report

> **Date:** November 2026  
> **Status:** Code-complete. Manual dashboard setup required. See [INFRASTRUCTURE_SETUP.md](INFRASTRUCTURE_SETUP.md).

---

## 1. Files Created

### Supabase Edge Functions

| File | Purpose |
|------|---------|
| `supabase/functions/r2-presign/index.ts` | AWS SigV4 presigned URL generator for R2 upload and download |
| `supabase/functions/send-notification/index.ts` | FCM HTTP v1 notification sender with invalid token cleanup |

### Database Migrations

| File | Purpose |
|------|---------|
| `supabase/migrations/001_file_uploads_device_tokens.sql` | Creates `file_uploads` and `device_tokens` tables with RLS |
| `supabase/migrations/002_supabase_audit_improvements.sql` | 15 performance indexes; audit findings documented |

### Flutter Services

| File | Purpose |
|------|---------|
| `lib/core/services/cloudflare_r2_service.dart` | R2 presigned URL client — upload/download authorization |
| `lib/core/services/file_upload_service.dart` | 3-step file upload orchestrator (auth → R2 → metadata) |
| `lib/core/services/cdn_service.dart` | CDN URL builder for public R2 assets |
| `lib/core/services/firebase_notification_service.dart` | FCM initialization, foreground/background message handling |
| `lib/core/services/notification_permission_service.dart` | Contextual notification permission requests |
| `lib/core/services/device_token_service.dart` | FCM token register, refresh, deactivate lifecycle |

### Configuration and Platform

| File | Purpose |
|------|---------|
| `android/app/src/main/res/values/colors.xml` | SCORE brand blue as FCM notification accent color |
| `android/app/google-services.json.placeholder` | Placeholder documenting where to place google-services.json |
| `ios/Runner/GoogleService-Info.plist.placeholder` | Placeholder documenting Xcode setup for GoogleService-Info.plist |

### Documentation

| File | Purpose |
|------|---------|
| `INFRASTRUCTURE.md` | Complete architecture documentation with Mermaid diagrams |
| `INFRASTRUCTURE_SETUP.md` | Step-by-step manual configuration guide |
| `IMPLEMENTATION_REPORT.md` | This file |
| `docs/superpowers/plans/2026-11-06-infrastructure-integration.md` | Implementation plan |

---

## 2. Files Modified

| File | Changes |
|------|---------|
| `pubspec.yaml` | Added `firebase_core`, `firebase_messaging`, `http`, `flutter_local_notifications`, `device_info_plus`, `package_info_plus` |
| `pubspec.lock` | Updated to reflect new dependencies |
| `.env.example` | Added Cloudflare R2 and Firebase configuration variable documentation |
| `.gitignore` | Added `google-services.json`, `GoogleService-Info.plist`, `supabase/.env` exclusions |
| `lib/main.dart` | Added Firebase initialization before `runApp()`, gracefully degrades |
| `lib/presentation/auth/auth_provider.dart` | `logout()` now deactivates FCM token before Supabase `signOut()` |
| `lib/data/remote/supabase_service.dart` | Added `listenToAuthChanges()` method and `dart:async` import |
| `lib/core/supabase/supabase_config.dart` | Added security documentation comment on anon key |
| `android/app/build.gradle.kts` | Added `com.google.gms.google-services` plugin |
| `android/settings.gradle.kts` | Added `com.google.gms.google-services` version declaration |
| `android/app/src/main/AndroidManifest.xml` | Added FCM notification channel, icon, and color meta-data |
| `ios/Runner/Info.plist` | Added `UIBackgroundModes` (fetch, remote-notification), FCM notes |

---

## 3. Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `firebase_core` | ^3.13.1 | Firebase app initialization |
| `firebase_messaging` | ^15.2.5 | FCM push notification reception |
| `flutter_local_notifications` | ^18.0.1 | In-app foreground notification display |
| `device_info_plus` | ^11.4.0 | Stable device ID for FCM token registration |
| `package_info_plus` | ^8.3.0 | App version info (available for future use) |
| `http` | ^1.4.0 | Direct HTTP PUT to R2 for file upload |

**Resolved versions from pub.dev:**
- `firebase_core`: 3.15.2 (compatible with ^3.13.1)
- `firebase_messaging`: 15.2.6
- `device_info_plus`: 11.5.0

---

## 4. Database Migrations Created

### Migration 001 — `file_uploads` and `device_tokens` Tables

**New tables:**
- `public.file_uploads` — R2 file metadata (5 indexes, 4 RLS policies, `updated_at` trigger)
- `public.device_tokens` — FCM device tokens (3 indexes, 4 RLS policies, `updated_at` trigger)

**New function:** `public.handle_updated_at()` — reusable trigger function

**Safe:** Uses `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, idempotent policy creation.

### Migration 002 — Performance Indexes

15 indexes added across 5 existing tables:
- `questions`: exam_subject, exam_chapter, year_desc, chapter_id, is_premium (partial)
- `mistakes`: user_id, user_created_at, user_resolved (partial)
- `test_attempts`: user_id, user_submitted
- `bookmarks`: user_id, user_created
- `question_notes`: user_id

**Safe:** `CREATE INDEX IF NOT EXISTS` only. No schema changes.

---

## 5. New Supabase Edge Functions

### `r2-presign`

- **Route:** POST `/functions/v1/r2-presign`
- **Auth:** Supabase JWT required
- **Purpose:** Generates AWS Signature V4 presigned URLs for R2
- **Security:** Validates user identity, file size (≤ 50 MB), MIME type (allowlist), ownership (private downloads)
- **Upload expiry:** 15 minutes (900 seconds)
- **Download expiry:** 60 minutes (3600 seconds)
- **Presigned URL:** Never logged — treated as a temporary credential

### `send-notification`

- **Route:** POST `/functions/v1/send-notification`
- **Auth:** Supabase JWT required
- **Purpose:** Sends FCM push notifications via HTTP v1 API
- **Security:** Users can only send to their own devices; FCM tokens never logged
- **Token cleanup:** Deactivates `UNREGISTERED` tokens in `device_tokens` automatically

---

## 6. Security Measures Implemented

| Measure | Implementation |
|---------|---------------|
| No R2 credentials in Flutter | CloudflareR2Service invokes Edge Function — credentials are server-side only |
| No FCM service account in Flutter | send-notification Edge Function holds service account JSON as a secret |
| No Supabase service-role key in Flutter | Only anon key used in Flutter; service-role key is in Edge Functions only |
| Presigned URL not logged | No `debugPrint` of presigned URLs in any service or Edge Function |
| FCM token deactivated on logout | `DeviceTokenService.deactivateToken()` called before `SupabaseService.signOut()` |
| Ownership enforced server-side | Private download: `object_key.startsWith(user.id)` checked in Edge Function |
| Notification permission deferred | `NotificationPermissionService` designed for contextual request only |
| Background handler is top-level | `_firebaseBackgroundMessageHandler` is a top-level `@pragma('vm:entry-point')` function |
| RLS on all new tables | `file_uploads` and `device_tokens` both have RLS enabled with 4 policies each |
| .gitignore protects secrets | `google-services.json`, `GoogleService-Info.plist`, `supabase/.env` are excluded |

---

## 7. Tests Executed

### `flutter analyze`

| Run | Status | Output |
|-----|--------|--------|
| After Task 1 (dependencies) | ✅ PASS | No issues found (10.7s) |
| After Task 6 (services) — initial | ❌ FAIL | 2 errors: `const` on `DeviceInfoPlugin` |
| After fix | ✅ PASS | No issues found (13.2s) |

**Fix applied:** Changed `static const DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin()` to `final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin()` in `device_token_service.dart`.

### `flutter test`

| Test File | Tests | Result |
|-----------|-------|--------|
| `auth_flow_test.dart` | 2 | ✅ PASS |
| `header_drawer_test.dart` | 2 | ✅ PASS |
| `profile_screen_test.dart` | 3 | ✅ PASS |
| `scale_test.dart` | 4 | ✅ PASS |
| `slidebar_section_test.dart` | 1 | ✅ PASS |
| `widget_test.dart` | 3 | ✅ PASS |
| **Total** | **15** | **✅ All pass** |

All pre-existing tests pass with no modifications required. No existing features were broken.

---

## 8. Manual Tasks Still Pending

> These items require your credentials and dashboard access. Code is fully ready.

### Critical — Must complete before push notifications work

- [ ] **Firebase project created** and both Android/iOS apps registered
- [ ] **`google-services.json`** downloaded and placed at `android/app/google-services.json`
- [ ] **`GoogleService-Info.plist`** downloaded and added to Xcode Runner target
- [ ] **APNs key** created in Apple Developer Portal and uploaded to Firebase Console
- [ ] **Push Notifications** capability added in Xcode
- [ ] **Firebase service account JSON** generated
- [ ] **Supabase secret** `FIREBASE_SERVICE_ACCOUNT_JSON` set
- [ ] **Supabase secret** `FIREBASE_PROJECT_ID` set
- [ ] **Edge Functions deployed**: `supabase functions deploy r2-presign` and `supabase functions deploy send-notification`

### Critical — Must complete before R2 file upload works

- [ ] **R2 buckets created**: `score-public-assets` (public) and `score-private-uploads` (private)
- [ ] **R2 API token generated** with read/write on both buckets
- [ ] **Supabase secrets set**: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_PUBLIC`, `R2_BUCKET_PRIVATE`, `CLOUDFLARE_ACCOUNT_ID`
- [ ] **R2 CORS configured** on both buckets
- [ ] **Migration 001** executed in Supabase SQL editor

### Important — Required for performance

- [ ] **Migration 002** executed in Supabase SQL editor (adds performance indexes)

### Optional — Required for CDN delivery

- [ ] **Custom CDN domain** connected to `score-public-assets` bucket
- [ ] **Cache rules** configured in Cloudflare for public asset paths
- [ ] **`R2_PUBLIC_DOMAIN`** set at Flutter build time (`--dart-define`)

### iOS-specific Xcode steps

- [ ] `CFBundleURLTypes` updated in `Info.plist` with `REVERSED_CLIENT_ID` from `GoogleService-Info.plist`
- [ ] Background Modes capability verified in Xcode (remote-notification, fetch)

---

## 9. Missing Credentials / Configuration

The following are **not blockers for the codebase** but are required before the features function:

| Missing Item | Where to Get It | Blocks |
|-------------|-----------------|--------|
| `google-services.json` | Firebase Console → Android app settings | FCM on Android |
| `GoogleService-Info.plist` | Firebase Console → iOS app settings | FCM on iOS |
| APNs `.p8` key | Apple Developer Portal → Keys | iOS push notifications |
| R2 API credentials | Cloudflare Dashboard → R2 → API Tokens | File upload/download |
| Firebase service account JSON | Firebase Console → Project Settings → Service accounts | FCM sending |

---

## 10. Known Limitations

| Limitation | Explanation | Impact |
|-----------|-------------|--------|
| Firebase graceful degradation | App launches fine without `google-services.json` / `GoogleService-Info.plist`, but FCM is non-functional | None until Firebase is configured |
| CDN not functional | `CdnService.publicAssetUrl()` returns `null` until `R2_PUBLIC_DOMAIN` is configured | Public assets fall back to direct R2 or placeholder images |
| Admin notifications not implemented | `send-notification` only allows self-send; admin broadcast is blocked with 403 | No admin push broadcast until admin role system is built |
| iOS notification permissions | Permissions not yet wired to any screen — `NotificationPermissionService.requestPermission()` exists but needs to be called from a contextual UI | No iOS notification permission dialog until a settings screen requests it |
| R2 file deletion | No delete endpoint in Edge Functions yet | Files can only be deleted via Cloudflare Dashboard or CLI |
| Token refresh listener | Registered once per app session; on app restart it re-registers correctly via `registerToken()` | No issue in practice |
| Plaintext password in SQLite | Test user `pinjari.work@gmail.com` stores password in plaintext in local SQLite | Dev-only risk; explicitly preserved per user rule 11 |

---

## 11. Git Commits

| Commit | Hash | Description |
|--------|------|-------------|
| Task 1: Dependencies | `32fd98e` | firebase, http, notifications deps + env config |
| Tasks 2–9: Infrastructure | `af15190` | Full infrastructure implementation (22 files, 4168 insertions) |
| Documentation | (pending) | INFRASTRUCTURE.md, INFRASTRUCTURE_SETUP.md, IMPLEMENTATION_REPORT.md |

