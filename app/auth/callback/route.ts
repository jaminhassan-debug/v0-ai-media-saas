import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(new URL('/auth/error', request.url))
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[v0] Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/error', request.url))
    }

    // Get the next URL from the request
    const next = searchParams.get('next') || '/dashboard'
    return NextResponse.redirect(new URL(next, request.url))
  } catch (error) {
    console.error('[v0] Callback route error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
}
