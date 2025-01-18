import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  console.log('Confirm route hit with params:', request.url)
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  
  if (!token_hash || !type) {
    console.error('Missing parameters:', { token_hash, type })
    return NextResponse.redirect(
      new URL('/auth?error=Missing authentication parameters', request.url)
    )
  }

  // Create the response with the redirect first
  const response = NextResponse.redirect(new URL('/dashboard', request.url))

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name)
          console.log('Getting cookie:', name, cookie?.value)
          return cookie?.value
        },
        set(name, value, options) {
          console.log('Setting cookie:', name, value, options)
          // Set the cookie in our response
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: false,
            path: '/'
          })
        },
        remove(name, options) {
          console.log('Removing cookie:', name)
          response.cookies.delete(name)
        },
      },
    }
  )

  try {
    console.log('Attempting to verify OTP with:', { type, token_hash })
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('Error verifying Magic Link:', error)
      throw error
    }

    console.log('OTP verification successful:', data)
    
    return response
  } catch (error) {
    console.error('Detailed error in confirm route:', error)
    return NextResponse.redirect(
      new URL('/auth?error=Could not verify Magic Link', request.url)
    )
  }
} 