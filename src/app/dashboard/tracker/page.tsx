'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getHabitsForUser,
  getHabitCompletions,
  toggleHabitCompletion,
  type Habit as ServiceHabitType,
  type HabitCompletion as ServiceCompletionType
} from '@/services/habitService';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ArrowDownCircle, Loader2 } from 'lucide-react';
import { TrackerSkeleton } from '@/components/skeletons/tracker-skeleton';
import { useSwipe } from '@/hooks/use-swipe';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { isInFuture, getToday, getLocalDateString } from '@/lib/dateUtils';

export default function TrackerPage() {
  const [habits, setHabits] = useState<ServiceHabitType[]>([]);
  const [completions, setCompletions] = useState<ServiceCompletionType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const loadData = useCallback(async (dateToLoad: Date, currentUserId: string) => {
    if (!initialLoadComplete) {
      setLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const [habitsData, completionsData] = await Promise.all([
        getHabitsForUser(currentUserId),
        getHabitCompletions(currentUserId, dateToLoad)
      ]);
      setHabits(Array.isArray(habitsData) ? habitsData : []);
      setCompletions(Array.isArray(completionsData) ? completionsData : []);
    } catch (err) {
      console.error('Error loading data for tracker:', err);
      setHabits([]);
      setCompletions([]);
    } finally {
      setLoading(false);
      if (!initialLoadComplete) setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      if (!user) {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadData(selectedDate, userId);
    }
  }, [userId, selectedDate, loadData]);

  const handleDateChange = (days: number) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    if (!isInFuture(newDate)) {
      setSelectedDate(newDate);
    }
  };

  useSwipe({
    onSwipeLeft: () => handleDateChange(1),
    onSwipeRight: () => handleDateChange(-1),
    threshold: 150,
    minVelocity: 0.15,
    maxVerticalMovement: 50
  });

  const { pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: async () => {
      if (userId) {
        await loadData(selectedDate, userId);
      }
    }
  });

  const isHabitCompleted = (habitId: string): boolean => {
    return completions.some((completion: ServiceCompletionType) => completion.habit_id === habitId);
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!userId) return;

    const currentlyCompleted = isHabitCompleted(habitId);
    const targetCompletedState = !currentlyCompleted;
    const tempCompletionId = crypto.randomUUID();
    const localDateStr = getLocalDateString(selectedDate);

    if (targetCompletedState) {
      const optimisticCompletion: ServiceCompletionType = {
        id: tempCompletionId,
        user_id: userId,
        habit_id: habitId,
        completion_date: localDateStr,
        created_at: new Date().toISOString(),
      };
      setCompletions(prev => [...prev, optimisticCompletion]);
    } else {
      setCompletions(prev => prev.filter(c => !(c.habit_id === habitId && c.completion_date === localDateStr)));
    }

    try {
      await toggleHabitCompletion(userId, habitId, selectedDate, targetCompletedState);
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error toggling habit:', err);
      if (userId) await loadData(selectedDate, userId);
    }
  };

  if (loading && !initialLoadComplete) {
    return <TrackerSkeleton />;
  }

  const isToday = getLocalDateString(selectedDate) === getLocalDateString(getToday());

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {(pullDistance > 0 || (loading && initialLoadComplete)) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 flex justify-center py-2 bg-background/80 backdrop-blur-sm z-50 items-center"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {loading && initialLoadComplete ? 
                <Loader2 className="h-4 w-4 animate-spin" /> :
                <ArrowDownCircle className="h-4 w-4" style={{ transform: `rotate(${progress * 3.6}deg)` }}/>
              }
              {isRefreshing ? 'Refreshing...' : (loading && initialLoadComplete) ? 'Loading data...': 'Pull to refresh'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          disabled={isToday || loading}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {habits.length === 0 && !loading && (
            <p className="text-sm text-center text-muted-foreground py-10">
                {userId ? "No habits configured. Go to the 'Habits' tab to add some!" : "Please log in to track habits."}
            </p>
      )}

      <div className="space-y-2">
        {habits.map((habit: ServiceHabitType) => {
          const completed = isHabitCompleted(habit.id);
          return (
            <motion.button
              key={habit.id}
              onClick={() => handleToggleHabit(habit.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <span className="font-medium truncate" title={habit.name}>{habit.name}</span>
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