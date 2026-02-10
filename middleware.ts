import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Fetch user profile (to get role) if user exists
  // Note: auth.getUser() only returns auth data. We need to fetch role from DB or metadata.
  // Using supabase to fetch simple profile info.
  let userRole = 'EMPLOYEE';
  
  if (user) {
    const { data: profile } = await supabase
      .from('employees')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()
      
    if (profile?.role) {
      userRole = profile.role.toUpperCase();
    }
  }

  // 2. Chặn Employee truy cập các trang Admin/Manager
  const isAdminRoute = 
       request.nextUrl.pathname.startsWith('/dashboard') ||
       request.nextUrl.pathname.startsWith('/employees') || 
       request.nextUrl.pathname.startsWith('/contracts') ||
       request.nextUrl.pathname.startsWith('/departments') ||
       request.nextUrl.pathname.startsWith('/payroll') ||
       request.nextUrl.pathname.startsWith('/review') ||
       request.nextUrl.pathname.startsWith('/report') ||
       request.nextUrl.pathname.startsWith('/recruitment') ||
       request.nextUrl.pathname.startsWith('/settings') ||
       request.nextUrl.pathname.startsWith('/instruments');

  // Nếu là Employee mà cố vào Admin Route -> Đá về Profile
  if (user && userRole === 'EMPLOYEE' && isAdminRoute) {
     return NextResponse.redirect(new URL('/profile', request.url))
  }

  // 3. Nếu chưa login mà vào trang bảo vệ -> Login
  const isProtectedRoute = isAdminRoute || request.nextUrl.pathname.startsWith('/profile');
  
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. Nếu đã login mà vào Login -> Redirect dựa theo Role
  if (request.nextUrl.pathname === '/login' && user) {
    if (userRole === 'EMPLOYEE') {
       return NextResponse.redirect(new URL('/profile', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
