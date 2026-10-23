# SCORE Supabase Backend Setup Guide

This guide walks you through setting up **Supabase**, **Email & Password Authentication**, and **Google OAuth (GAuth)** for the SCORE mobile application.

---

## 1. Quick Supabase Setup (3 Steps)

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project**, choose a name (e.g. `SCORE-App`), select a database region close to you, and choose a strong database password.
3. Once created, go to **Project Settings** -> **API**:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - Copy **Project API Key (anon/public)** (e.g. `eyJhbG...`)

### Step 2: Run the Database Migration
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy the contents of [`supabase/schema.sql`](./schema.sql) and paste it into the editor.
4. Click **Run**. This will create:
   - `profiles` table (with RLS policies)
   - Auto-provisioning trigger (`on_auth_user_created`) that creates a student profile on signup/GAuth
   - `questions`, `bookmarks`, `mistakes`, `test_attempts`, and `question_notes` tables

### Step 3: Configure Auth & Redirect URLs
1. Navigate to **Authentication** -> **URL Configuration**.
2. Under **Redirect URLs**, add:
   ```text
   score://login-callback
   ```
3. Click **Save**.

---

## 2. Google OAuth (GAuth) Setup

To enable "Sign in with Google" / "Sign up with Google":

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a Project (or select an existing one) and navigate to **APIs & Services** -> **Credentials**.
3. Configure the **OAuth Consent Screen** (User Type: External, App Name: SCORE).
4. Click **Create Credentials** -> **OAuth Client ID**:
   - Application Type: **Web Application**
   - Name: `SCORE Supabase Auth`
   - Under **Authorized redirect URIs**, add your Supabase project callback URL:
     ```text
     https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
     ```
   - Click **Create**, then copy your **Client ID** and **Client Secret**.
5. Back in the **Supabase Dashboard**:
   - Go to **Authentication** -> **Providers** -> **Google**.
   - Toggle **Enable Google provider** to ON.
   - Paste your **Client ID** and **Client Secret**.
   - Click **Save**.

---

## 3. Running the App with Your Supabase Project

You can supply your Supabase credentials using `--dart-define` at runtime:

```bash
flutter run --dart-define=SUPABASE_URL=https://your-project-ref.supabase.co --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

Or when building the release APK:

```bash
flutter build apk --release --dart-define=SUPABASE_URL=https://your-project-ref.supabase.co --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

Alternatively, you can edit [`lib/core/supabase/supabase_config.dart`](../lib/core/supabase/supabase_config.dart) directly to set your default URL and anon key.

---

## 4. Testing Account & Offline Capabilities

The app includes hybrid local & cloud authentication:
- **Testing ID**:
  - Email: `pinjari.work@gmail.com`
  - Password: `Student@123`
  - Works out-of-the-box via local SQLite and can also be created in Supabase.
- **Offline Fallback**: If offline or Supabase keys are pending, the app gracefully falls back to the embedded local SQLite database so study sessions and mock tests are never interrupted.
