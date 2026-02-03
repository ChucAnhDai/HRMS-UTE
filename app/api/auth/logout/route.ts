import { createClient } from '@/lib/supabase.server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  // Sign out to clear the session
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/login', request.url))
}
