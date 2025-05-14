// This file handles the Supabase magic link callback using PKCE flow.
// It exchanges an authorization code from the URL for a user session.
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  console.log('Auth Confirm Route: All incoming cookies:', JSON.stringify(request.cookies.getAll())); // Log all cookies
  const requestUrl = new URL(request.url)
  console.log('Confirm route hit. Full URL:', requestUrl.toString()) // Log the full URL

  const code = requestUrl.searchParams.get('code')
  // The email param is still here from our emailRedirectTo but not directly used by exchangeCodeForSession
  // const email = requestUrl.searchParams.get('email') 
  
  if (!code) {
    console.error("Missing 'code' parameter in callback URL. URL was:", requestUrl.toString())
    // Construct the redirect URL correctly
    const redirectUrl = new URL('/auth', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'Missing authentication code')
    return NextResponse.redirect(redirectUrl)
  }

  const dashboardRedirectUrl = new URL('/dashboard', requestUrl.origin)
  const response = NextResponse.redirect(dashboardRedirectUrl)

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name)
          return cookie?.value
        },
        set(name, value, options) {
          // Allow Supabase SSR to handle httpOnly defaults
          response.cookies.set({ name, value, ...options, path: '/' })
        },
        remove(name, options) {
          // Allow Supabase SSR to handle httpOnly defaults
          response.cookies.set({ name, value: '', ...options, path: '/' })
        },
      },
    }
  )

  try {
    console.log('Attempting to exchange code for session with code:', code)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      const errorRedirectUrl = new URL('/auth', requestUrl.origin)
      errorRedirectUrl.searchParams.set('error', 'Could not exchange code for session')
      return NextResponse.redirect(errorRedirectUrl)
    }

    console.log('Successfully exchanged code for session and set cookies.')
    return response
  } catch (error) {
    console.error('Unexpected error in confirm route during code exchange:', error)
    const errorRedirectUrl = new URL('/auth', requestUrl.origin)
    errorRedirectUrl.searchParams.set('error', 'Unexpected error during authentication')
    return NextResponse.redirect(errorRedirectUrl)
  }
} 