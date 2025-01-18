'use client';

import { useEffect, useState } from 'react';
import { getHabits, getHabitCompletions, toggleHabitCompletion } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar, ArrowDownCircle } from 'lucide-react';
import { HabitsSkeleton } from '@/components/skeletons/habits-skeleton';
import { useSwipe } from '@/hooks/use-swipe';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Get user info
        const { data: { user } } = await supabase.auth.getUser();
        setEmail(user?.email ?? null);
        setUserId(user?.id ?? null);

        if (user?.id) {
          // Load habits and completions for selected date
          const [habitsData, completionsData] = await Promise.all([
            getHabits(),
            getHabitCompletions(user.id, selectedDate)
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
  }, [selectedDate]);

  const handleDateChange = (days: number) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    const isInFuture = format(newDate, 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd');
    
    if (!isInFuture) {
      setSelectedDate(newDate);
    }
  };

  // Swipe gestures for date navigation
  useSwipe({
    onSwipeLeft: () => handleDateChange(1),
    onSwipeRight: () => handleDateChange(-1)
  });

  // Pull-to-refresh functionality
  const { pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: async () => {
      try {
        setLoading(true);
        // Get user info
        const { data: { user } } = await supabase.auth.getUser();
        setEmail(user?.email ?? null);
        setUserId(user?.id ?? null);

        if (user?.id) {
          // Load habits and completions for selected date
          const [habitsData, completionsData] = await Promise.all([
            getHabits(),
            getHabitCompletions(user.id, selectedDate)
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
  });

  const isHabitCompleted = (habitId: number) => {
    return completions.some(completion => completion.habit_id === habitId);
  };

  const handleToggleHabit = async (habitId: number) => {
    if (!userId) return;

    const completed = !isHabitCompleted(habitId);
    try {
      await toggleHabitCompletion(userId, habitId, selectedDate, completed);
      
      // Trigger haptic feedback if available
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }

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
    }
  };

  const completedCount = completions.length;
  const totalHabits = habits.length;
  const completionRate = totalHabits ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (loading) {
    return <HabitsSkeleton />;
  }

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 flex justify-center py-2 bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownCircle
                className="h-4 w-4"
                style={{
                  transform: `rotate(${progress * 3.6}deg)`
                }}
              />
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isToday ? 'Welcome Back!' : 'Habit History'}
        </h1>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-card rounded-lg border p-4">
        <button
          onClick={() => handleDateChange(-1)}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded-md transition-colors"
        >
          <span className="text-lg font-semibold">
            {format(selectedDate, 'MMM d, yyyy')}
          </span>
          <Calendar className="h-4 w-4" />
        </button>

        <button
          onClick={() => handleDateChange(1)}
          className="p-2 hover:bg-accent rounded-md transition-colors"
          disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Stats */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="font-semibold mb-4">
          {isToday ? "Today's Progress" : 'Progress'}
        </h2>
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

      {/* Habits List */}
      <div>
        <h2 className="font-semibold mb-4">
          {isToday ? "Today's Habits" : 'Habits'}
        </h2>
        <div className="space-y-2">
          {habits.map((habit) => {
            const completed = isHabitCompleted(habit.id);
            return (
              <motion.button
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className="w-full flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">{habit.name}</span>
                <motion.div
                  initial={false}
                  animate={completed ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date Picker Dialog */}
      <Dialog
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        title="Select Date"
      >
        <div className="p-4">
          <input
            type="date"
            max={format(new Date(), 'yyyy-MM-dd')}
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              setSelectedDate(new Date(e.target.value));
              setIsDatePickerOpen(false);
            }}
            className="w-full p-2 rounded-md border bg-background"
          />
        </div>
      </Dialog>
    </div>
  );
} 