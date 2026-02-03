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

  // Các route cần bảo vệ (Dashboard)
  // Các route cần bảo vệ (Dashboard)
  const isProtectedRoute = 
       request.nextUrl.pathname.startsWith('/employees') || 
       request.nextUrl.pathname.startsWith('/calendar') ||
       request.nextUrl.pathname.startsWith('/leave') ||
       request.nextUrl.pathname.startsWith('/payroll') ||
       request.nextUrl.pathname.startsWith('/instruments') ||
       request.nextUrl.pathname.startsWith('/dashboard') 
       // Removed '/' from protected routes

  // Nếu truy cập route bảo vệ mà chưa login -> Redirect về Login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu đã login mà cố vào trang Login -> Redirect về Dashboard
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Nếu đã login mà vào trang chủ (Landing) -> Redirect về Dashboard 
  // (Optional: Giữ lại nếu muốn user đã login luôn vào dashboard)
  // Tuy nhiên yêu cầu của user là: "nhấn nút login mới chuyển".
  // Nhưng thông thường đã login thì vào root nên vào dashboard?
  // User bảo: "npm run dev ... hien thi trang gioi thieu ... nhan login -> chuyen den login"
  // Nếu user ĐÃ login, vào /login thì middleware chuyển đi đâu?
  // Hiện tại chuyển về '/'. Nếu '/' là Landing Page, thì user kẹt ở Landing Page.
  // Nên user đã login vào '/login' -> nên về '/dashboard'. -> Done above.
  
  // Còn root '/'?
  // Nếu user đã login, vào '/' -> Thấy Landing Page.
  // Bấm 'Login' -> vào '/login' -> Middleware đá về '/dashboard'.
  // Hợp lý.


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
