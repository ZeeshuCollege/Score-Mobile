-- ==============================================================================
-- SCORE Mobile — Migration 001: File Uploads and Device Tokens
-- ==============================================================================
-- Purpose: Add infrastructure tables for Cloudflare R2 file tracking and
--          FCM device token management for push notifications.
--
-- Safety: Uses CREATE TABLE IF NOT EXISTS, CREATE INDEX IF NOT EXISTS,
--         CREATE POLICY (idempotent-safe), and CREATE OR REPLACE FUNCTION.
--         No DROP statements. Safe to run on existing databases.
--
-- How to run: Supabase Dashboard → SQL Editor → New Query → Paste & Run
--
-- Rollback instructions (run MANUALLY only if needed):
--   DROP TABLE IF EXISTS public.device_tokens;
--   DROP TABLE IF EXISTS public.file_uploads;
--   DROP FUNCTION IF EXISTS public.handle_updated_at();
-- ==============================================================================

-- ─── File Uploads Metadata Table ─────────────────────────────────────────────
-- Tracks metadata for all files uploaded to Cloudflare R2.
-- Binary file data lives in R2; this table stores references and metadata only.

CREATE TABLE IF NOT EXISTS public.file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bucket_name TEXT NOT NULL,
    object_key TEXT NOT NULL,
    original_file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    file_category TEXT NOT NULL CHECK (
        file_category IN (
            'question_images',
            'question_diagrams',
            'educational_pdfs',
            'study_materials',
            'user_documents'
        )
    ),
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (
        visibility IN ('public', 'private')
    ),
    upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        upload_status IN ('pending', 'completed', 'failed')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(bucket_name, object_key)
);

COMMENT ON TABLE public.file_uploads IS
    'Metadata references for files stored in Cloudflare R2. Binary data is NOT stored here.';
COMMENT ON COLUMN public.file_uploads.object_key IS
    'R2 object key path: {user_id}/{file_category}/{unique_id}.{ext}';
COMMENT ON COLUMN public.file_uploads.visibility IS
    'public = accessible via CDN; private = requires presigned download URL';

-- Indexes for file_uploads
CREATE INDEX IF NOT EXISTS idx_file_uploads_owner_id
    ON public.file_uploads(owner_id);

CREATE INDEX IF NOT EXISTS idx_file_uploads_category
    ON public.file_uploads(file_category);

CREATE INDEX IF NOT EXISTS idx_file_uploads_status
    ON public.file_uploads(upload_status)
    WHERE upload_status != 'completed';

CREATE INDEX IF NOT EXISTS idx_file_uploads_owner_category
    ON public.file_uploads(owner_id, file_category);

-- Enable RLS on file_uploads
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for file_uploads
-- Users can only see their own file upload records
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'file_uploads'
        AND policyname = 'Users can read their own file uploads'
    ) THEN
        CREATE POLICY "Users can read their own file uploads"
            ON public.file_uploads FOR SELECT
            USING (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'file_uploads'
        AND policyname = 'Users can insert their own file uploads'
    ) THEN
        CREATE POLICY "Users can insert their own file uploads"
            ON public.file_uploads FOR INSERT
            WITH CHECK (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'file_uploads'
        AND policyname = 'Users can update their own file uploads'
    ) THEN
        CREATE POLICY "Users can update their own file uploads"
            ON public.file_uploads FOR UPDATE
            USING (auth.uid() = owner_id)
            WITH CHECK (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'file_uploads'
        AND policyname = 'Users can delete their own file uploads'
    ) THEN
        CREATE POLICY "Users can delete their own file uploads"
            ON public.file_uploads FOR DELETE
            USING (auth.uid() = owner_id);
    END IF;
END $$;

-- ─── Device Tokens Table ──────────────────────────────────────────────────────
-- Stores FCM device tokens for push notification delivery.
-- One row per (user_id, device_id) pair — multiple devices per user supported.

CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    fcm_token TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    notification_enabled BOOLEAN NOT NULL DEFAULT true,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, device_id)
);

COMMENT ON TABLE public.device_tokens IS
    'FCM device tokens for push notification delivery. One row per (user, device) pair.';
COMMENT ON COLUMN public.device_tokens.device_id IS
    'Platform-specific device identifier (Android: Build.ID, iOS: identifierForVendor)';
COMMENT ON COLUMN public.device_tokens.fcm_token IS
    'Firebase Cloud Messaging registration token. Refreshed periodically by FCM.';
COMMENT ON COLUMN public.device_tokens.is_active IS
    'Set to false on logout or when FCM reports UNREGISTERED error. Tokens with is_active=false are not targeted.';

-- Indexes for device_tokens
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id
    ON public.device_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_device_tokens_active
    ON public.device_tokens(user_id, is_active)
    WHERE is_active = true;

-- Enable RLS on device_tokens
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device_tokens
-- Users cannot see or modify other users' device tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'device_tokens'
        AND policyname = 'Users can read their own device tokens'
    ) THEN
        CREATE POLICY "Users can read their own device tokens"
            ON public.device_tokens FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'device_tokens'
        AND policyname = 'Users can insert their own device tokens'
    ) THEN
        CREATE POLICY "Users can insert their own device tokens"
            ON public.device_tokens FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'device_tokens'
        AND policyname = 'Users can update their own device tokens'
    ) THEN
        CREATE POLICY "Users can update their own device tokens"
            ON public.device_tokens FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'device_tokens'
        AND policyname = 'Users can delete their own device tokens'
    ) THEN
        CREATE POLICY "Users can delete their own device tokens"
            ON public.device_tokens FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- ─── Auto-Update Trigger for updated_at ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_updated_at IS
    'Generic trigger function to automatically update the updated_at column on row update.';

-- Apply to file_uploads (drop if exists to handle re-runs)
DROP TRIGGER IF EXISTS set_file_uploads_updated_at ON public.file_uploads;
CREATE TRIGGER set_file_uploads_updated_at
    BEFORE UPDATE ON public.file_uploads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply to device_tokens (drop if exists to handle re-runs)
DROP TRIGGER IF EXISTS set_device_tokens_updated_at ON public.device_tokens;
CREATE TRIGGER set_device_tokens_updated_at
    BEFORE UPDATE ON public.device_tokens
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- Migration 001 complete.
-- Next: Run migration 002 (performance indexes and audit improvements)
-- ==============================================================================

