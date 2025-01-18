-- Enable RLS on the habit_completion table
ALTER TABLE public.habit_completion ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own habit completions
CREATE POLICY "Users can view their own habit completions"
ON public.habit_completion
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own habit completions
CREATE POLICY "Users can insert their own habit completions"
ON public.habit_completion
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own habit completions
CREATE POLICY "Users can delete their own habit completions"
ON public.habit_completion
FOR DELETE
USING (auth.uid() = user_id);

-- Allow all users to view the static habits table
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view habits"
ON public.habits
FOR SELECT
TO authenticated
USING (true); 