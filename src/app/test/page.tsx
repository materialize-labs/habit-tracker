'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('habits').select('*').limit(1);
        if (error) throw error;
        setStatus('Connection successful!');
      } catch (error: any) {
        setStatus(`Connection error: ${error?.message || 'Unknown error'}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
} 