'use client';

import { useEffect, useState } from 'react';
import { getHabits, getHabitCompletions, toggleHabitCompletion } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ArrowDownCircle, Calendar } from 'lucide-react';
import { HabitsSkeleton } from '@/components/skeletons/habits-skeleton';
import { useSwipe } from '@/hooks/use-swipe';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { isInFuture, getToday, getLocalDateString } from '@/lib/dateUtils';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitCompletion = Database['public']['Tables']['habit_completion']['Row'];

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting to load user data...');
        // Get user info
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Auth response:', { user, error: userError });
        
        setEmail(user?.email ?? null);
        setUserId(user?.id ?? null);

        if (user?.id) {
          console.log('User authenticated, loading habits...');
          // Load habits and completions for selected date
          const [habitsData, completionsData] = await Promise.all([
            getHabits(),
            getHabitCompletions(user.id, selectedDate)
          ]);

          console.log('Loaded data:', { habitsData, completionsData });
          setHabits(habitsData);
          setCompletions(completionsData);
        } else {
          console.log('No user ID found');
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
    
    if (!isInFuture(newDate)) {
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
          completion_date: getLocalDateString(selectedDate)
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

  const isToday = getLocalDateString(selectedDate) === getLocalDateString(getToday());

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

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-1 hover:bg-accent rounded-md transition-colors",
                  "text-left font-medium"
                )}
              >
                <span className="text-lg font-semibold">
                  {format(selectedDate, 'MMM d, yyyy')}
                </span>
                <Calendar className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) =>
                  date > new Date() || date < new Date('2024-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          onClick={() => handleDateChange(1)}
          className="p-2 hover:bg-accent rounded-md transition-colors"
          disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Back to Today Button */}
      {!isToday && (
        <Button
          variant="outline"
          onClick={() => setSelectedDate(new Date())}
          className="w-full"
        >
          Back to Today
        </Button>
      )}

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
    </div>
  );
} 