-- =============================================================
-- CarePen AI — Supabase Schema Migration
-- Run this SQL in the Supabase SQL editor for the 'carepen' project.
-- =============================================================

-- 1. Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_input     TEXT NOT NULL,
  intake_summary JSONB NOT NULL DEFAULT '{}',
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('Low', 'Medium', 'High')),
  urgency_reason TEXT NOT NULL DEFAULT '',
  clinical_note TEXT NOT NULL DEFAULT '',
  patient_name  TEXT,
  patient_age   TEXT,
  patient_gender TEXT,
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 1b. For deployments that already created the notes table before the
-- doctor sign-off feature: add the review columns (safe to re-run).
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 2. Index for fast look-ups by user
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- 3. Enable Row-Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only see / modify their own notes
CREATE POLICY "Users can view their own notes"
  ON public.notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. (Optional) Contact messages table for the contact form
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Contact messages are publicly insertable (anonymous form),
-- but only readable by service role / admins.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

-- No SELECT policy for regular users — only service role can read.
