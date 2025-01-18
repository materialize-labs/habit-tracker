'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, addWeeks, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHabits, getHabitCompletionsForDateRange } from '@/services/habitService';
import { supabase } from '@/lib/supabaseClient';

type ViewType = 'week' | 'month';
type HabitStats = { id: number; name: string; count: number };

export default function StatsPage() {
  const [viewType, setViewType] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<HabitStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateRange = viewType === 'week' 
    ? {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
        format: (date: Date) => {
          const start = startOfWeek(date);
          const end = endOfWeek(date);
          return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
        },
      }
    : {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
        format: (date: Date) => format(date, 'MMMM yyyy'),
      };

  const navigate = (direction: 'prev' | 'next') => {
    if (viewType === 'week') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        // Get all habits and completions for the date range
        const [habits, completions] = await Promise.all([
          getHabits(),
          getHabitCompletionsForDateRange(user.id, dateRange.start, dateRange.end)
        ]);

        // Calculate completion counts for each habit
        const habitStats = habits.map(habit => {
          const count = completions.filter(c => c.habit_id === habit.id).length;
          return { id: habit.id, name: habit.name, count };
        });

        setStats(habitStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [currentDate, viewType]);

  const canNavigateNext = viewType === 'week' 
    ? endOfWeek(currentDate) < new Date()
    : endOfMonth(currentDate) < new Date();

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
            <CardTitle>{dateRange.format(currentDate)}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={viewType === 'week' ? 'bg-primary text-primary-foreground' : ''}
                onClick={() => setViewType('week')}
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={viewType === 'month' ? 'bg-primary text-primary-foreground' : ''}
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
              disabled={!canNavigateNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-8 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-center py-4">{error}</p>
          ) : (
            <div className="space-y-2">
              {stats.map(habit => (
                <div
                  key={habit.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span>{habit.name}</span>
                  <span className="font-medium">{habit.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 