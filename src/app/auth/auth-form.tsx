'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

const emailSchema = z.string().email('Please enter a valid email address');

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setMessage({
        text: error,
        type: 'error'
      });
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      emailSchema.parse(email);
      
      setLoading(true);
      setMessage(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?email=${encodeURIComponent(email)}`,
          shouldCreateUser: false,
        },
      });

      if (error) {
        if (error.message.includes('Email not found')) {
          throw new Error('This email is not registered. Only existing users can log in.');
        }
        throw error;
      }

      setMessage({
        text: 'Check your email for the login link!',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: error instanceof z.ZodError 
          ? error.errors[0].message 
          : error instanceof Error ? error.message : 'An error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Sending login link...' : 'Send login link'}
      </Button>

      {message && (
        <p className={`text-sm text-center ${
          message.type === 'error' ? 'text-destructive' : 'text-green-600'
        }`}>
          {message.text}
        </p>
      )}
    </form>
  );
} 