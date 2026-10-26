-- ==============================================================================
-- SCORE Mobile: Supabase Cloud Database Schema & Authentication Configuration
-- ==============================================================================
-- Run this entire script in your Supabase Project:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run.
-- ==============================================================================

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. USER PROFILES TABLE (Linked with Supabase Auth: auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT 'Aspirant Scholar',
    avatar_id INTEGER NOT NULL DEFAULT 0,
    description TEXT DEFAULT 'Target: Top 100 AIR · JEE 2026',
    target_college TEXT DEFAULT 'IIT Bombay · CSE',
    target_exam TEXT DEFAULT 'JEE Advanced',
    solved_count INTEGER DEFAULT 1248,
    accuracy NUMERIC(5,2) DEFAULT 84.20,
    streak_days INTEGER DEFAULT 12,
    study_hours INTEGER DEFAULT 42,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
CREATE POLICY "Public profiles are viewable by owner"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- 3. AUTOMATIC PROFILE PROVISIONING TRIGGER (FOR EMAIL & GOOGLE OAUTH)
-- ==============================================================================
-- When a user registers via Email/Password or signs in with Google OAuth,
-- this trigger automatically creates their student profile entry.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_id)
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'full_name',
            split_part(new.email, '@', 1)
        ),
        0
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. SCORE QUESTION BANK & PYQ STORAGE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    chapter_id TEXT NOT NULL,
    topic_id TEXT,
    year INTEGER NOT NULL,
    shift TEXT,
    question_type TEXT NOT NULL, -- 'singleChoice', 'multipleChoice', 'numerical'
    question_text TEXT NOT NULL,
    options_json JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    solution_text TEXT NOT NULL,
    has_video_solution BOOLEAN DEFAULT false,
    difficulty_level TEXT DEFAULT 'medium',
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions are readable by any authenticated user:
CREATE POLICY "Authenticated users can read questions"
    ON public.questions FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- 5. STUDENT BOOKMARKS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, question_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks"
    ON public.bookmarks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 6. SMART MISTAKE NOTEBOOK
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mistakes (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_selected_option TEXT NOT NULL,
    mistake_type TEXT NOT NULL, -- 'calculation', 'conceptual', 'time_pressure', 'misread'
    personal_notes TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mistake notebook"
    ON public.mistakes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. TEST ATTEMPTS & MOCK TEST HISTORY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_title TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    incorrect_count INTEGER NOT NULL,
    unattempted_count INTEGER NOT NULL,
    score NUMERIC(6,2) NOT NULL,
    total_time_seconds INTEGER NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    responses_json JSONB NOT NULL
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and store their test attempts"
    ON public.test_attempts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 8. CUSTOM REVISION NOTES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.question_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, question_id)
);

ALTER TABLE public.question_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their custom revision notes"
    ON public.question_notes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 9. DYNAMIC APP FRONTEND CONFIGURATION & ADMIN CUSTOMIZATION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- App config is readable by everyone (mobile app and web visitors)
CREATE POLICY "Public read access for app config"
    ON public.app_config FOR SELECT
    USING (true);

-- Allow full modifications on app config for admins
CREATE POLICY "Admin write access for app config"
    ON public.app_config FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow question CRUD operations
CREATE POLICY "Allow question management for admin"
    ON public.questions FOR ALL
    USING (true)
    WITH CHECK (true);

-- Seed initial app configuration values
INSERT INTO public.app_config (key, value, description)
VALUES
  ('announcement', '{"enabled": true, "text": "🎯 JEE Main 2026 Registration Open · Complete NTA PYQ Revision Series Live!", "type": "info", "action_url": ""}'::jsonb, 'Global announcement ticker in mobile header'),
  ('slideshow', '[
    {"id": "slide_1", "title": "100K+ Authentic PYQs with KaTeX", "subtitle": "Curated with deep video & step-by-step solutions", "image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80", "badge": "New Edition", "duration_sec": 3},
    {"id": "slide_2", "title": "Real NTA Simulation & Percentiles", "subtitle": "Test yourself under strict CBT countdown conditions", "image_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80", "badge": "Exam Mode", "duration_sec": 3},
    {"id": "slide_3", "title": "Smart Mistake Notebook & AI Analytics", "subtitle": "Track weak concepts and turn mistakes into scores", "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80", "badge": "AI Powered", "duration_sec": 3}
  ]'::jsonb, 'Home screen slideshow images and banners'),
  ('theme', '{"primary_color": "#2563EB", "brand_name": "SCORE", "dark_mode_default": true, "accent_gradient": "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)"}'::jsonb, 'App visual theme and color palette'),
  ('courses', '[
    {"id": "jee_main", "name": "JEE Main", "enabled": true, "subjects": ["Physics", "Chemistry", "Mathematics"], "target_date": "2026-01-24"},
    {"id": "jee_adv", "name": "JEE Advanced", "enabled": true, "subjects": ["Physics", "Chemistry", "Mathematics"], "target_date": "2026-05-17"},
    {"id": "neet", "name": "NEET UG", "enabled": true, "subjects": ["Physics", "Chemistry", "Biology"], "target_date": "2026-05-03"},
    {"id": "bitsat", "name": "BITSAT", "enabled": true, "subjects": ["Physics", "Chemistry", "Mathematics", "English & LR"], "target_date": "2026-05-20"}
  ]'::jsonb, 'Course taxonomy and subject configuration'),
  ('features', '{"mistake_notebook": true, "custom_tests": true, "daily_dose": true, "ai_hint_solver": true, "leaderboard": true}'::jsonb, 'Feature toggles across the mobile application'),
  ('maintenance', '{"is_active": false, "message": "SCORE is undergoing scheduled server upgrades. We will be back shortly!", "min_version": "1.0.0"}'::jsonb, 'Emergency maintenance and update broadcast')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- GOOGLE OAUTH & SUPABASE AUTH DASHBOARD SETUP INSTRUCTIONS
-- ==============================================================================
-- 1. In Supabase Dashboard:
--    Navigate to: Authentication -> URL Configuration
--    Add to "Redirect URLs":
--    - score://login-callback
--    - http://localhost:3000/ (for Flutter Web if used)
--
-- 2. In Google Cloud Console (https://console.cloud.google.com/):
--    - Create an OAuth 2.0 Web Client ID
--    - Under "Authorized redirect URIs", add:
--      https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback
--    - Copy Client ID and Client Secret
--
-- 3. In Supabase Dashboard:
--    Navigate to: Authentication -> Providers -> Google
--    - Toggle "Enable Google provider" ON
--    - Paste your Google Client ID and Google Client Secret
--    - Click Save.
-- ==============================================================================
