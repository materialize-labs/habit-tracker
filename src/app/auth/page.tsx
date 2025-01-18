import { Suspense } from 'react';
import AuthForm from './auth-form';

export default function AuthPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Log in to Habit Tracker</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a login link
          </p>
        </div>

        <Suspense fallback={<div className="space-y-4">
          <div className="h-10 bg-muted/10 animate-pulse rounded-md" />
          <div className="h-10 bg-muted/10 animate-pulse rounded-md" />
        </div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
} 