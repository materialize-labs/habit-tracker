'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getHabitsForUser as fetchHabitsFromService,
  getHabitCompletions as fetchCompletionsFromService,
  toggleHabitCompletion as toggleServiceHabitCompletion,
  type Habit as ServiceHabitType,
  type HabitCompletion as ServiceCompletionType
} from '@/services/habitService';
import { supabase } from '@/lib/supabaseClient';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, ArrowDownCircle, Calendar, Loader2 } from 'lucide-react';
import { HabitsSkeleton } from '@/components/skeletons/habits-skeleton';
import { useSwipe } from '@/hooks/use-swipe';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { isInFuture, getToday, getLocalDateString } from '@/lib/dateUtils';
import { HabitCard } from '@/components/ui/habit-card';

export default function DashboardPage() {
  const [habits, setHabits] = useState<ServiceHabitType[]>([]);
  const [completions, setCompletions] = useState<ServiceCompletionType[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());

  const loadDashboardData = useCallback(async (dateToLoad: Date, currentUserId: string) => {
    if (initialLoadComplete) setLoading(true); 
    
    try {
      const [habitsData, completionsData] = await Promise.all([
        fetchHabitsFromService(currentUserId),
        fetchCompletionsFromService(currentUserId, dateToLoad)
      ]);
      setHabits(Array.isArray(habitsData) ? habitsData : []);
      setCompletions(Array.isArray(completionsData) ? completionsData : []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setHabits([]);
      setCompletions([]);
    } finally {
      setLoading(false);
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    async function initialUserLoad() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
      setUserId(user?.id ?? null);
      if (user?.id) {
        await loadDashboardData(selectedDate, user.id);
      }
      setInitialLoadComplete(true); 
      setLoading(false); 
    }
    initialUserLoad();
  }, []);

  useEffect(() => {
    if (userId && initialLoadComplete) { 
      loadDashboardData(selectedDate, userId);
    }
  }, [selectedDate, userId, initialLoadComplete, loadDashboardData]);

  const handleDateChange = (days: number) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    if (!isInFuture(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const { swipeProgress } = useSwipe({
    onSwipeLeft: () => handleDateChange(1),
    onSwipeRight: () => handleDateChange(-1),
    threshold: 150,
    minVelocity: 0.15,
    maxVerticalMovement: 50
  });

  const { pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: async () => {
      if (userId) {
        await loadDashboardData(selectedDate, userId);
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
      await toggleServiceHabitCompletion(userId, habitId, selectedDate, targetCompletedState);
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Error toggling habit:', err);
      if (userId) await loadDashboardData(selectedDate, userId); 
    }
  };

  const completedCount = completions.length;
  const totalHabits = habits.length;
  const completionRate = totalHabits ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (loading && !initialLoadComplete) { 
    return <HabitsSkeleton />;
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
              {isRefreshing ? 'Refreshing...' : (loading && initialLoadComplete) ? 'Loading...': 'Pull to refresh'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isToday ? 'Welcome Back!' : 'Habit History'}
        </h1>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>

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

      {!isToday && (
        <Button
          variant="outline"
          onClick={() => setSelectedDate(new Date())}
          className="w-full"
        >
          Back to Today
        </Button>
      )}

      <HabitCard swipeProgress={swipeProgress} selectedDate={selectedDate}>
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="font-semibold mb-4">
              {isToday ? "Today's Progress" : 'Progress'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
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

          <div>
            <h2 className="font-semibold mb-4">
              {isToday ? "Today's Habits" : 'Habits'}
            </h2>
            {habits.length === 0 && !loading && (
                 <p className="text-sm text-center text-muted-foreground py-4">No habits found for this day.</p>
            )}
            <div className="space-y-2">
              {habits.map((habit: ServiceHabitType) => {
                const completed = isHabitCompleted(habit.id); 
                return (
                  <motion.button
                    key={habit.id} 
                    onClick={() => handleToggleHabit(habit.id)} 
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
                    whileTap={{ scale: 0.98 }}
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
        </div>
      </HabitCard>
    </div>
  );
} 