-- ==============================================================================
-- SCORE Mobile — Migration 002: Performance Indexes and Supabase Audit Improvements
-- ==============================================================================
-- Purpose: Add missing indexes identified during security and performance audit.
--          Improves query performance for authenticated student operations.
--
-- Findings from audit:
--   1. questions table: Missing composite indexes for common filter patterns
--   2. mistakes table: Missing user_id index (each student query is a full table scan)
--   3. test_attempts table: Missing user_id and timestamp indexes
--   4. bookmarks table: Missing user_id index
--   5. question_notes table: Missing user_id index
--
-- Safety: CREATE INDEX IF NOT EXISTS only. No schema changes, no data changes.
--
-- How to run: Supabase Dashboard → SQL Editor → New Query → Paste & Run
--
-- Rollback: DROP INDEX <name>; for each index below (see names)
-- ==============================================================================

-- ─── Questions Table Indexes ──────────────────────────────────────────────────
-- questions is a read-heavy table queried by exam+subject+chapter combinations

CREATE INDEX IF NOT EXISTS idx_questions_exam_subject
    ON public.questions(exam_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_questions_exam_chapter
    ON public.questions(exam_id, chapter_id);

CREATE INDEX IF NOT EXISTS idx_questions_year_desc
    ON public.questions(year DESC);

CREATE INDEX IF NOT EXISTS idx_questions_chapter_id
    ON public.questions(chapter_id);

-- Premium content filter (subscription-gated content)
CREATE INDEX IF NOT EXISTS idx_questions_is_premium
    ON public.questions(is_premium)
    WHERE is_premium = false;

-- ─── Mistakes Table Indexes ───────────────────────────────────────────────────
-- Each student sees only their own mistakes; user_id is the primary filter

CREATE INDEX IF NOT EXISTS idx_mistakes_user_id
    ON public.mistakes(user_id);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_created_at
    ON public.mistakes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_resolved
    ON public.mistakes(user_id, is_resolved)
    WHERE is_resolved = false;

-- ─── Test Attempts Table Indexes ──────────────────────────────────────────────
-- Students view their own test history ordered by submission time

CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id
    ON public.test_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user_submitted
    ON public.test_attempts(user_id, submitted_at DESC);

-- ─── Bookmarks Table Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
    ON public.bookmarks(user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created
    ON public.bookmarks(user_id, created_at DESC);

-- ─── Question Notes Table Indexes ────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_question_notes_user_id
    ON public.question_notes(user_id);

-- ─── Profiles Table ───────────────────────────────────────────────────────────
-- profiles.id is already the PK and FK to auth.users — no additional index needed

-- ─── Audit Notes (documented, no schema changes) ──────────────────────────────
-- The following were reviewed and found acceptable:
--
-- 1. profiles.solved_count, accuracy, streak_days, study_hours defaults are
--    placeholder values (documentation issue, not a schema bug). These will be
--    addressed by feature work that syncs real stats from test_attempts.
--
-- 2. questions table has no INSERT/UPDATE/DELETE policies, which is correct:
--    question data is managed by admins via service-role key, not student clients.
--    Students have SELECT-only access via the authenticated RLS policy.
--
-- 3. The Supabase anon key is hardcoded in supabase_config.dart. This is
--    intentional and safe per Supabase's design — the anon key is a publishable
--    key; RLS is the security boundary. The service-role key is NOT in client code.
--
-- 4. Google OAuth PKCE flow is correctly configured in supabase_service.dart.
--    Redirect URL 'score://login-callback' is registered in AndroidManifest.xml.
--
-- 5. Local SQLite test user (pinjari.work@gmail.com / Student@123) stores
--    plaintext password. This is acknowledged as a development shortcut.
--    Rule 11 from user request: "Do not remove the temporary SQLite testing
--    implementation without explicit approval." — not changed.

-- ==============================================================================
-- Migration 002 complete.
-- ==============================================================================

