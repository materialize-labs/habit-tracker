-- supabase/seed.sql
-- This file is executed by `supabase db reset` to seed the local database.

-- Clear existing data from tables to prevent duplicates on re-seed, if necessary.
-- Note: With user-specific habits, seeding global habits is no longer applicable here.
-- Users will create their own habits through the application.

-- Example: If you had other global lookup tables, you might seed them here.
-- TRUNCATE TABLE public.some_other_lookup_table RESTART IDENTITY CASCADE;
-- INSERT INTO public.some_other_lookup_table (name) VALUES ('Lookup1'), ('Lookup2');

-- For the new user-specific habits structure, this seed file will be minimal.
-- The `habits` and `habit_completion` tables will be empty after migrations,
-- ready for users to populate with their own data.

-- The TRUNCATE for habits and habit_completion is handled by the migration itself
-- if it drops and recreates the tables. If migrations only ALTER, then
-- TRUNCATE here might be useful for a truly clean seed.
-- Given our migration drops/recreates, explicitly truncating here is redundant but harmless.

-- TRUNCATE TABLE public.habits RESTART IDENTITY CASCADE; -- This would fail as ID is UUID
-- TRUNCATE TABLE public.habit_completion RESTART IDENTITY CASCADE;

-- No global habits to insert anymore.

-- The following line is removed as 'id' is now UUID and doesn't use a sequence:
-- SELECT pg_catalog.setval(pg_get_serial_sequence('public.habits', 'id'), (SELECT MAX(id) FROM public.habits) + 1, false);

SELECT 'Seed file executed. User-specific habits are managed via the app.'; 