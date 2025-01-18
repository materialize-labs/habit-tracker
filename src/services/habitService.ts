import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database.types';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('id');

  if (error) throw error;
  return data;
}

export async function getHabitCompletions(userId: string, date: Date): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completion')
    .select('*')
    .eq('user_id', userId)
    .eq('completion_date', date.toISOString().split('T')[0]);

  if (error) throw error;
  return data;
}

export async function toggleHabitCompletion(
  userId: string,
  habitId: number,
  date: Date,
  completed: boolean
): Promise<void> {
  const formattedDate = date.toISOString().split('T')[0];

  if (completed) {
    const { error } = await supabase
      .from('habit_completion')
      .insert({
        user_id: userId,
        habit_id: habitId,
        completion_date: formattedDate
      });

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('habit_completion')
      .delete()
      .match({
        user_id: userId,
        habit_id: habitId,
        completion_date: formattedDate
      });

    if (error) throw error;
  }
}

export async function getHabitCompletionsForDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completion')
    .select('*')
    .eq('user_id', userId)
    .gte('completion_date', startDate.toISOString().split('T')[0])
    .lte('completion_date', endDate.toISOString().split('T')[0]);

  if (error) throw error;
  return data;
} 