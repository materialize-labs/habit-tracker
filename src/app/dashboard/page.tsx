'use client';

import { useEffect, useState } from 'react';
import { getHabits, getHabitCompletions } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, Circle } from 'lucide-react';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Get user info
        const { data: { user } } = await supabase.auth.getUser();
        setEmail(user?.email ?? null);
        setUserId(user?.id ?? null);

        if (user?.id) {
          // Load habits and today's completions
          const [habitsData, completionsData] = await Promise.all([
            getHabits(),
            getHabitCompletions(user.id, new Date())
          ]);

          setHabits(habitsData);
          setCompletions(completionsData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const isHabitCompleted = (habitId: number) => {
    return completions.some(completion => completion.habit_id === habitId);
  };

  const completedCount = completions.length;
  const totalHabits = habits.length;
  const completionRate = totalHabits ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>

      {/* Today's Progress */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-4">Today's Progress</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalHabits - completedCount}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </div>

      {/* Today's Habits */}
      <div>
        <h2 className="font-semibold mb-4">Today's Habits</h2>
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <span className="font-medium">{habit.name}</span>
              {isHabitCompleted(habit.id) ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 