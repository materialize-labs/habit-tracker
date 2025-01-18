import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL('/auth?error=Missing token', requestUrl.origin));
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: 'magiclink'
  });

  if (error) {
    console.error('Error verifying magic link:', error.message);
    return NextResponse.redirect(new URL('/auth?error=Invalid magic link', requestUrl.origin));
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
} 