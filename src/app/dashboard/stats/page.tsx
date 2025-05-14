'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, addWeeks, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getHabitsForUser,
  getHabitCompletionsForDateRange,
  type Habit as ServiceHabitType,
  type HabitCompletion as ServiceCompletionType
} from '@/services/habitService';
import { supabase } from '@/lib/supabaseClient';

type ViewType = 'week' | 'month';
type HabitStats = { id: string; name: string; count: number };

export default function StatsPage() {
  const [viewType, setViewType] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [stats, setStats] = useState<HabitStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const dateRange = useMemo(() => {
    return viewType === 'week' 
      ? {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
          formatStr: (date: Date) => {
            const start = startOfWeek(date);
            const end = endOfWeek(date);
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
          },
        }
      : {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
          formatStr: (date: Date) => format(date, 'MMMM yyyy'),
        };
  }, [currentDate, viewType]);

  const navigate = (direction: 'prev' | 'next') => {
    if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function loadStatsData() {
      if (!userId) {
        setStats([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const [userHabitsData, completionsData] = await Promise.all([
          getHabitsForUser(userId),
          getHabitCompletionsForDateRange(userId, dateRange.start, dateRange.end)
        ]);
        
        const userHabits: ServiceHabitType[] = Array.isArray(userHabitsData) ? userHabitsData : [];
        const completions: ServiceCompletionType[] = Array.isArray(completionsData) ? completionsData : [];

        const calculatedStats: HabitStats[] = userHabits.map((habit: ServiceHabitType) => {
          const count = completions.filter((c: ServiceCompletionType) => String(c.habit_id) === String(habit.id)).length;
          return { id: String(habit.id), name: habit.name, count };
        });
        setStats(calculatedStats);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
        setStats([]);
      } finally {
        setLoading(false);
      }
    }

    loadStatsData();
  }, [userId, dateRange]);

  const canNavigateNext = useMemo(() => {
    return viewType === 'week' 
      ? endOfWeek(currentDate) < endOfWeek(new Date())
      : endOfMonth(currentDate) < endOfMonth(new Date());
  }, [currentDate, viewType]);

  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  } else if (error) {
    content = <p className="text-destructive text-center py-10">Error: {error}</p>;
  } else if (!userId && !loading) {
    content = <p className="text-muted-foreground text-center py-10">Please log in to view stats.</p>;
  } else if (stats.length === 0) {
    content = <p className="text-muted-foreground text-center py-10">No habit data available for this period.</p>;
  } else {
    content = (
      <div className="space-y-2">
        {stats.map(habit => (
          <div
            key={habit.id}
            className="flex justify-between items-center py-2 border-b last:border-0"
          >
            <span className="truncate" title={habit.name}>{habit.name}</span>
            <span className="font-medium">{habit.count}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Track your habit completion progress
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>{dateRange.formatStr(currentDate)}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewType === 'week' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType('week')}
              >
                Week
              </Button>
              <Button
                variant={viewType === 'month' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType('month')}
              >
                Month
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('next')}
              disabled={!canNavigateNext || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    </div>
  );
} 