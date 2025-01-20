import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database.types';
import { getLocalDateString } from '@/lib/dateUtils';

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
  const localDate = getLocalDateString(date);
  
  const { data, error } = await supabase
    .from('habit_completion')
    .select('*')
    .eq('user_id', userId)
    .eq('completion_date', localDate);

  if (error) throw error;
  return data;
}

export async function toggleHabitCompletion(
  userId: string,
  habitId: number,
  date: Date,
  completed: boolean
): Promise<void> {
  const localDate = getLocalDateString(date);

  if (completed) {
    const { error } = await supabase
      .from('habit_completion')
      .insert({
        user_id: userId,
        habit_id: habitId,
        completion_date: localDate
      });

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('habit_completion')
      .delete()
      .match({
        user_id: userId,
        habit_id: habitId,
        completion_date: localDate
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
    .gte('completion_date', getLocalDateString(startDate))
    .lte('completion_date', getLocalDateString(endDate));

  if (error) throw error;
  return data;
} 