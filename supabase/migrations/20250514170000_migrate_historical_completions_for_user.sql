-- Migration: Migrate historical habit completions for a specific user to the new schema

BEGIN;

-- Variable for your specific user ID.
-- !!! REPLACE 'YOUR_USER_ID_FROM_AUTH_USERS_BACKUP' WITH YOUR ACTUAL UUID FROM auth.users !!!
CREATE TEMP TABLE target_user_data (user_id uuid);
INSERT INTO target_user_data (user_id) VALUES ('11e88403-3a81-413c-84b8-b0debb6991db');

-- Temp table to map old integer habit IDs to new UUID habit IDs for your user
CREATE TEMP TABLE old_to_new_habit_id_map (
    old_habit_id integer PRIMARY KEY,
    new_habit_uuid uuid NOT NULL,
    habit_name TEXT NOT NULL -- For easier verification
);

-- Step 1: Insert your 12 global habits into the new 'public.habits' table 
--         for your specific user_id, generating new UUIDs and sort_order.
-- !!! REPLACE THE VALUES BELOW WITH YOUR ACTUAL 12 HABITS (old_id, name) FROM THE BACKUP !!!
-- Assign sort_order based on old ID or desired new order.
WITH user_details AS (SELECT user_id FROM target_user_data LIMIT 1)
INSERT INTO public.habits (user_id, name, sort_order, created_at) 
VALUES
    ((SELECT user_id FROM user_details), 'Lifting', 0, NOW()),       -- Old ID 1
    ((SELECT user_id FROM user_details), 'Meditate', 1, NOW()),      -- Old ID 2
    ((SELECT user_id FROM user_details), 'Journal', 2, NOW()),       -- Old ID 3
    ((SELECT user_id FROM user_details), 'Diet', 3, NOW()),          -- Old ID 4
    ((SELECT user_id FROM user_details), 'Read', 4, NOW()),          -- Old ID 5
    ((SELECT user_id FROM user_details), 'Jog', 5, NOW()),           -- Old ID 6
    ((SELECT user_id FROM user_details), 'Swim', 6, NOW()),          -- Old ID 7
    ((SELECT user_id FROM user_details), 'Tennis', 7, NOW()),        -- Old ID 8
    ((SELECT user_id FROM user_details), 'Cold Plunge', 8, NOW()),   -- Old ID 9
    ((SELECT user_id FROM user_details), 'Stretch', 9, NOW()),       -- Old ID 10
    ((SELECT user_id FROM user_details), 'Breathwork', 10, NOW()),   -- Old ID 11
    ((SELECT user_id FROM user_details), 'Surf', 11, NOW());         -- Old ID 12

-- Step 2: Populate the old_to_new_habit_id_map table.
-- This maps the old integer IDs of your global habits to their new UUIDs,
-- specifically for YOUR user ID.
-- !!! ADJUST THE 'habit_name' IN THE WHERE CLAUSE TO MATCH YOUR HABIT NAMES EXACTLY !!!
INSERT INTO old_to_new_habit_id_map (old_habit_id, new_habit_uuid, habit_name)
SELECT 
    1 AS old_habit_id, h.id AS new_habit_uuid, h.name
FROM public.habits h, target_user_data tud 
WHERE h.user_id = tud.user_id AND h.name = 'Lifting'
UNION ALL
SELECT 2, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Meditate'
UNION ALL
SELECT 3, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Journal'
UNION ALL
SELECT 4, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Diet'
UNION ALL
SELECT 5, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Read'
UNION ALL
SELECT 6, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Jog'
UNION ALL
SELECT 7, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Swim'
UNION ALL
SELECT 8, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Tennis'
UNION ALL
SELECT 9, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Cold Plunge'
UNION ALL
SELECT 10, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Stretch'
UNION ALL
SELECT 11, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Breathwork'
UNION ALL
SELECT 12, h.id, h.name FROM public.habits h, target_user_data tud WHERE h.user_id = tud.user_id AND h.name = 'Surf';

-- Step 3: Insert your historical habit completions into the new 'public.habit_completion' table.
-- Create a temporary table for your old completion data
CREATE TEMP TABLE old_completions_data (
    user_id_val uuid,
    old_int_habit_id integer,
    completion_date_val date
);

-- !!! BULK INSERT YOUR 296 OLD COMPLETION RECORDS HERE !!!
INSERT INTO old_completions_data (user_id_val, old_int_habit_id, completion_date_val) VALUES
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-01-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-01-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-01-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-01-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-01-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 11, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-01-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-01-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-01-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-01-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-27'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-01-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-01-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-01-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-01-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-02-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 11, '2025-02-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-02-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-02-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-02-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-02-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-02-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-02-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-02-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 5, '2025-02-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-02-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 3, '2025-02-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-02-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-02-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-02-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-27'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-02-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-02-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-03-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-03-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-03-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-03-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 9, '2025-03-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-03-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-03-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-19'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-03-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 11, '2025-03-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-03-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-25'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-27'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-03-27'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-03-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-03-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-03-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-04-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-03-31'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-03-31'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-04-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-04-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-09'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-10'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-11'),
('11e88403-3a81-413c-84b8-b0debb6991db', 12, '2025-04-12'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-04-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-13'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-14'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-15'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-16'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-17'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-18'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-04-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-20'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-21'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-22'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-23'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-24'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-04-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-26'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-27'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-29'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-28'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-04-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-04-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-04-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-04-30'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-05-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-05-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-05-01'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-05-02'),
('11e88403-3a81-413c-84b8-b0debb6991db', 6, '2025-05-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-05-03'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-05-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 8, '2025-05-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-05-04'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-05-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-05-05'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-05-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-05-06'),
('11e88403-3a81-413c-84b8-b0debb6991db', 7, '2025-05-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 10, '2025-05-07'),
('11e88403-3a81-413c-84b8-b0debb6991db', 1, '2025-05-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 4, '2025-05-08'),
('11e88403-3a81-413c-84b8-b0debb6991db', 2, '2025-05-08');

-- Insert into the real table using the map
INSERT INTO public.habit_completion (user_id, habit_id, completion_date, created_at)
SELECT 
    ocd.user_id_val,
    mapper.new_habit_uuid,
    ocd.completion_date_val,
    NOW()
FROM old_completions_data ocd
JOIN old_to_new_habit_id_map mapper ON ocd.old_int_habit_id = mapper.old_habit_id
WHERE ocd.user_id_val = (SELECT user_id FROM target_user_data LIMIT 1)
ON CONFLICT (user_id, habit_id, completion_date) DO NOTHING;

-- Clean up temporary tables
DROP TABLE old_to_new_habit_id_map;
DROP TABLE old_completions_data;
DROP TABLE target_user_data;

COMMIT;
