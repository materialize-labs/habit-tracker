'use client';

import { useEffect, useState } from 'react';
import { getHabits } from '@/services/habitService';
import { Database } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';

type Habit = Database['public']['Tables']['habits']['Row'];

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load habits
        const habitData = await getHabits();
        setHabits(habitData);

        // Get user email
        const { data: { user } } = await supabase.auth.getUser();
        setEmail(user?.email ?? null);
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
        console.error('Error loading data:', err);
      }
    }

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Habit Tracker</h1>
          {email && (
            <p className="text-gray-500 mt-2">
              Signed in as <span className="font-medium text-gray-900">{email}</span>
            </p>
          )}
        </div>

        {/* Habits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Habits</h2>
          {habits.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-gray-400">Loading habits...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-medium">
                    {habit.id}
                  </div>
                  <span className="ml-4 text-gray-700 font-medium">{habit.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 