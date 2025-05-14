import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database.types';
import { getLocalDateString } from '@/lib/dateUtils';

// Types now reflect the new schema where habits.id and habit_completion.habit_id are UUIDs
// and habits are user-specific with a sort_order.
export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

/**
 * Fetches habits for a specific user, ordered by their sort_order.
 */
export async function getHabitsForUser(userId: string): Promise<Habit[]> {
  if (!userId) {
    console.error("getHabitsForUser: userId is required");
    return [];
  }
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching user habits:', error);
    // Instead of throwing, return empty or let caller handle, for robustness in UI
    return []; 
  }
  return data || [];
}

/**
 * Fetches habit completions for a specific user on a given date.
 */
export async function getHabitCompletions(userId: string, date: Date): Promise<HabitCompletion[]> {
  if (!userId) {
    console.error("getHabitCompletions: userId is required");
    return [];
  }
  const localDate = getLocalDateString(date);
  
  const { data, error } = await supabase
    .from('habit_completion')
    .select('*')
    .eq('user_id', userId)
    .eq('completion_date', localDate);

  if (error) {
    console.error('Error fetching habit completions:', error);
    return [];
  }
  return data || [];
}

/**
 * Toggles the completion status of a habit for a user on a specific date.
 * habitId should be a UUID string.
 */
export async function toggleHabitCompletion(
  userId: string,
  habitId: string, // Changed from number to string for UUID
  date: Date,
  completed: boolean
): Promise<void> {
  if (!userId || !habitId) {
    console.error("toggleHabitCompletion: userId and habitId are required");
    throw new Error("User ID and Habit ID are required to toggle completion.");
  }
  const localDate = getLocalDateString(date);

  if (completed) {
    const { error } = await supabase
      .from('habit_completion')
      .insert({
        user_id: userId,
        habit_id: habitId, // Stays as string (UUID)
        completion_date: localDate,
        // created_at is defaulted by DB
      });

    if (error) {
      console.error('Error inserting habit completion:', error);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('habit_completion')
      .delete()
      .match({
        user_id: userId,
        habit_id: habitId, // Stays as string (UUID)
        completion_date: localDate
      });

    if (error) {
      console.error('Error deleting habit completion:', error);
      throw error;
    }
  }
}

/**
 * Fetches habit completions for a specific user within a given date range.
 */
export async function getHabitCompletionsForDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<HabitCompletion[]> {
  if (!userId) {
    console.error("getHabitCompletionsForDateRange: userId is required");
    return [];
  }
  const { data, error } = await supabase
    .from('habit_completion')
    .select('*') // Selects all columns, including habit_id (uuid)
    .eq('user_id', userId)
    .gte('completion_date', getLocalDateString(startDate))
    .lte('completion_date', getLocalDateString(endDate));

  if (error) {
    console.error('Error fetching habit completions for date range:', error);
    return [];
  }
  return data || [];
} 