import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');

  const supabase = createRouteHandlerClient({ cookies });

  if (token_hash && type === 'magiclink') {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'magiclink'
    });

    if (error) {
      console.error('Error verifying magic link:', error.message);
      return NextResponse.redirect(new URL('/auth?error=Invalid magic link', requestUrl.origin));
    }
  } else if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
} 