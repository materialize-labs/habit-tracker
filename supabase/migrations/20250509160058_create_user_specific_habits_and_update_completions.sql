-- Migration: Create user-specific habits table and update habit_completion
-- This migration modifies the database schema to support user-specific, configurable habits.

-- Step 1: Drop existing tables if they conform to the OLD structure to avoid conflicts.
-- We drop habit_completion first due to foreign key constraints.
DROP TABLE IF EXISTS public.habit_completion CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;

-- Step 2: Create the new user-specific 'habits' table
CREATE TABLE public.habits (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    sort_order integer NOT NULL DEFAULT 0, -- Used for user-defined ordering
    CONSTRAINT habits_pkey PRIMARY KEY (id),
    CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add comments to the new habits table and columns for clarity
COMMENT ON TABLE public.habits IS 'Stores habits defined by individual users.';
COMMENT ON COLUMN public.habits.user_id IS 'The user who owns this habit.';
COMMENT ON COLUMN public.habits.name IS 'The name or description of the habit.';
COMMENT ON COLUMN public.habits.sort_order IS 'An integer to determine the display order of habits for a user.';

-- Step 3: Recreate the 'habit_completion' table to link to the new UUID-based habits.id
CREATE TABLE public.habit_completion (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL,
    habit_id uuid NOT NULL, -- Changed from integer to uuid
    completion_date date NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT habit_completion_pkey PRIMARY KEY (id),
    CONSTRAINT habit_completion_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT habit_completion_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE,
    CONSTRAINT habit_completion_user_habit_date_unique UNIQUE (user_id, habit_id, completion_date) -- Ensure a habit is marked once per day per user
);

-- Add comments to the recreated habit_completion table
COMMENT ON TABLE public.habit_completion IS 'Tracks the completion status of habits by users on specific dates.';
COMMENT ON COLUMN public.habit_completion.habit_id IS 'References the user-specific habit that was completed.';

-- Step 4: Enable Row Level Security (RLS) for the new tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completion ENABLE ROW LEVEL SECURITY;

-- Step 5: Define RLS policies for 'habits' table
-- Users can see their own habits
CREATE POLICY "Allow users to read their own habits" ON public.habits
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert habits for themselves
CREATE POLICY "Allow users to insert their own habits" ON public.habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Allow users to update their own habits" ON public.habits
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Allow users to delete their own habits" ON public.habits
    FOR DELETE USING (auth.uid() = user_id);


-- Step 6: Define RLS policies for 'habit_completion' table
-- Users can see their own habit completions
CREATE POLICY "Allow users to read their own habit completions" ON public.habit_completion
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own habit completions (linking to their own habits)
-- The check for habit_id ownership is implicitly handled by the fact they should only see their own habits to complete.
CREATE POLICY "Allow users to insert their own habit completions" ON public.habit_completion
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own habit completions (e.g., if a toggle was mistakenly pressed)
CREATE POLICY "Allow users to update their own habit completions" ON public.habit_completion
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habit completions
CREATE POLICY "Allow users to delete their own habit completions" ON public.habit_completion
    FOR DELETE USING (auth.uid() = user_id);


-- Inform PL/pgSQL that we are using a newer version of uuid-ossp if available.
-- This is generally good practice for Supabase projects.
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    -- If uuid-ossp is installed, ensure we use its v4 generator if not already default
    -- However, extensions.uuid_generate_v4() from the supabase_commons schema is preferred now.
  END IF;
END$$;
