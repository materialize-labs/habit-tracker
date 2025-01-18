'use client';

import { useEffect, useState } from 'react';
import { getHabits, getHabitCompletions, toggleHabitCompletion } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

export default function TrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;
      
      try {
        const [habitsData, completionsData] = await Promise.all([
          getHabits(),
          getHabitCompletions(userId, selectedDate)
        ]);

        setHabits(habitsData);
        setCompletions(completionsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, selectedDate]);

  const handleDateChange = (days: number) => {
    setSelectedDate(current => days > 0 ? addDays(current, days) : subDays(current, Math.abs(days)));
  };

  const isHabitCompleted = (habitId: number) => {
    return completions.some(completion => completion.habit_id === habitId);
  };

  const handleToggleHabit = async (habitId: number) => {
    if (!userId) return;

    const completed = !isHabitCompleted(habitId);
    try {
      await toggleHabitCompletion(userId, habitId, selectedDate, completed);
      
      // Optimistically update UI
      if (completed) {
        setCompletions(prev => [...prev, {
          id: crypto.randomUUID(),
          user_id: userId,
          habit_id: habitId,
          completion_date: selectedDate.toISOString()
        }]);
      } else {
        setCompletions(prev => prev.filter(c => c.habit_id !== habitId));
      }
    } catch (err) {
      console.error('Error toggling habit:', err);
      // Could add toast notification here for error feedback
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-card rounded-lg border p-4">
        <button
          onClick={() => handleDateChange(-1)}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-lg font-semibold">
          {format(selectedDate, 'MMM d, yyyy')}
        </div>

        <button
          onClick={() => handleDateChange(1)}
          className="p-2 hover:bg-accent rounded-md transition-colors"
          disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        {habits.map((habit) => {
          const completed = isHabitCompleted(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => handleToggleHabit(habit.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <span className="font-medium">{habit.name}</span>
              {completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 