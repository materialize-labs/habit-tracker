'use client';

import { useEffect, useState } from 'react';
import { getHabits, getHabitCompletions, toggleHabitCompletion } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ArrowDownCircle } from 'lucide-react';
import { TrackerSkeleton } from '@/components/skeletons/tracker-skeleton';
import { useSwipe } from '@/hooks/use-swipe';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';

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

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, [userId, selectedDate]);

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
    onRefresh: loadData
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

  if (loading) {
    return <TrackerSkeleton />;
  }

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
  );
} 