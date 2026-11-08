-- ==============================================================================
-- SCORE Mobile: Migration 003 — Dynamic App Configuration & Asset Customization
-- ==============================================================================
-- This table stores live app customizations configured via the Web Admin Portal:
-- 1. App Logo (1:1 square image)
-- 2. Onboarding Slideshow (3 landing page slides)
-- 3. In-App Slideshow (3 home screen banner slides)
--
-- Realtime is enabled so all student devices update immediately upon confirmation.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access so any app instance (student or guest) can read active assets
DROP POLICY IF EXISTS "Public read app_config" ON public.app_config;
CREATE POLICY "Public read app_config"
    ON public.app_config FOR SELECT
    USING (true);

-- Allow upsert/update access for admin portal
DROP POLICY IF EXISTS "Allow update app_config" ON public.app_config;
CREATE POLICY "Allow update app_config"
    ON public.app_config FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable Supabase Realtime broadcast for instant sync across all student devices
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
          AND schemaname = 'public' 
          AND tablename = 'app_config'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.app_config;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Publication may not exist in all environments; ignore safely
        NULL;
END $$;

-- Seed default initial configurations if not present
INSERT INTO public.app_config (key, value)
VALUES
    ('app_logo', '{"url": null, "updated_at": null}'::jsonb),
    ('onboarding_slides', '{"slide1": null, "slide2": null, "slide3": null, "updated_at": null}'::jsonb),
    ('in_app_slides', '{"slide1": null, "slide2": null, "slide3": null, "updated_at": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;
