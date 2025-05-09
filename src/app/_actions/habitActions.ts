'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database.types'; // Ensure this path is correct

// Helper to get Supabase client with cookies
const getSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  sort_order: number;
}

export async function fetchUserHabits(): Promise<{ habits?: Habit[]; error?: string }> {
  const supabase = getSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user or no user:', userError);
    return { error: userError?.message || 'User not authenticated' };
  }

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return { error: error.message };
  }
  return { habits: data as Habit[] }; // Cast because select('*') can return other types
}

export async function addHabitAction(formData: FormData): Promise<{ habit?: Habit; error?: string }> {
  const supabase = getSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError?.message || 'User not authenticated' };
  }

  const habitName = formData.get('newHabitName') as string;
  if (!habitName || habitName.trim() === '') {
    return { error: 'Habit name cannot be empty' };
  }

  // Determine next sort_order
  const { data: maxSortOrderData, error: maxSortOrderError } = await supabase
    .from('habits')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  if (maxSortOrderError && maxSortOrderError.code !== 'PGRST116') { // PGRST116: no rows found
    console.error('Error fetching max sort_order:', maxSortOrderError);
    // Decide if this is a critical error or if we can default sort_order
  }
  
  const nextSortOrder = maxSortOrderData ? maxSortOrderData.sort_order + 1 : 0;

  const { data: newHabit, error: insertError } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      name: habitName.trim(),
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting habit:', insertError);
    return { error: insertError.message };
  }

  revalidatePath('/dashboard/habits');
  return { habit: newHabit as Habit };
}

// Placeholder for updateHabitAction
export async function updateHabitAction(habitId: string, newName: string): Promise<{ habit?: Habit; error?: string }> {
  console.log('updateHabitAction called with:', habitId, newName);
  // Implementation needed
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('habits')
    .update({ name: newName.trim() })
    .eq('id', habitId)
    .eq('user_id', user.id) // RLS also enforces this
    .select()
    .single();

  if (error) {
    console.error('Error updating habit:', error);
    return { error: error.message };
  }
  revalidatePath('/dashboard/habits');
  return { habit: data as Habit };
}

// Placeholder for deleteHabitAction
export async function deleteHabitAction(habitId: string): Promise<{ success?: boolean; error?: string }> {
  console.log('deleteHabitAction called with:', habitId);
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'User not authenticated' };

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', user.id); // RLS also enforces this

  if (error) {
    console.error('Error deleting habit:', error);
    return { error: error.message };
  }
  revalidatePath('/dashboard/habits');
  return { success: true };
}

// Placeholder for reorderHabitsAction
export async function reorderHabitsAction(orderedHabits: {id: string, sort_order: number}[]): Promise<{ success?: boolean; error?: string }> {
  console.log('reorderHabitsAction called with:', orderedHabits);
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'User not authenticated' };

  // This needs to be a series of updates or a bulk update if possible.
  // For simplicity, we'll do them one by one. Consider a transaction for production.
  for (const habit of orderedHabits) {
    const { error } = await supabase
      .from('habits')
      .update({ sort_order: habit.sort_order })
      .eq('id', habit.id)
      .eq('user_id', user.id);
    if (error) {
      console.error(`Error updating sort_order for habit ${habit.id}:`, error);
      return { error: `Failed to reorder habit ${habit.id}: ${error.message}` };
    }
  }

  revalidatePath('/dashboard/habits');
  return { success: true };
} 