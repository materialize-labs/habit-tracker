-- Migration: Reset habits schema to new user-specific structure
-- This drops old habit-related tables and creates the new schema, empty.
-- User creation for local testing will be handled manually via Studio or app login.

BEGIN;

-- User record in auth.users and auth.identities should be created manually
-- in Supabase Studio for local testing if needed before running the data import migration.
-- For production, the user is expected to already exist.

-- Step 1: Drop existing public schema habit tables if they exist to ensure a clean slate.
DROP TABLE IF EXISTS public.habit_completion CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;

-- Step 2: Create the new user-specific 'public.habits' table (empty)
CREATE TABLE public.habits (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL, -- This will be populated by the subsequent data import migration
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    sort_order integer NOT NULL DEFAULT 0,
    CONSTRAINT habits_pkey PRIMARY KEY (id),
    CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.habits IS 'Stores habits defined by individual users.';

-- Step 3: Create the new 'public.habit_completion' table (empty)
CREATE TABLE public.habit_completion (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL, 
    habit_id uuid NOT NULL, 
    completion_date date NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT habit_completion_pkey PRIMARY KEY (id),
    CONSTRAINT habit_completion_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT habit_completion_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE,
    CONSTRAINT habit_completion_user_habit_date_unique UNIQUE (user_id, habit_id, completion_date)
);
COMMENT ON TABLE public.habit_completion IS 'Tracks the completion status of habits by users on specific dates.';

-- Step 4: Enable Row Level Security (RLS) for the new tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completion ENABLE ROW LEVEL SECURITY;

-- Step 5: Define RLS policies for 'habits' table
CREATE POLICY "Allow users to read their own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Define RLS policies for 'habit_completion' table
CREATE POLICY "Allow users to read their own habit completions" ON public.habit_completion FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own habit completions" ON public.habit_completion FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own habit completions" ON public.habit_completion FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own habit completions" ON public.habit_completion FOR DELETE USING (auth.uid() = user_id);

COMMIT;
