import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dùng Service Role Key để có quyền tạo User (bypass tất cả bảo mật)
// LƯU Ý: Không bao giờ để lộ key này ở Client-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Fallback tạm
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    const email = 'admin@gmail.com'
    const password = 'admin123@Password' // Mật khẩu mạnh mẫu

    // 1. Tạo User trong Auth System
    // 1. Tạo User trong Auth System
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (createError) {
      // Nếu user đã tồn tại thì thôi, không báo lỗi
      console.log('User creation info:', createError.message)
    }

    // Lấy User ID (vừa tạo hoặc đã có)
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const adminUser = users.find(u => u.email === email)

    if (!adminUser) return NextResponse.json({ error: 'Failed to find admin user' }, { status: 500 })

    // 2. Tạo hoặc Update hồ sơ nhân viên cho Admin
    // Kiểm tra xem đã có nhân viên nào linked chưa
    const { data: existingEmployee } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('email', email)
      .single()

    if (existingEmployee) {
       // Update role
       await supabaseAdmin
         .from('employees')
         .update({ 
            auth_user_id: adminUser.id,
            role: 'ADMIN'
         })
         .eq('email', email)
    } else {
       // Insert mới
       await supabaseAdmin
         .from('employees')
         .insert({
            first_name: 'System',
            last_name: 'Administrator',
            email: email,
            role: 'ADMIN',
            auth_user_id: adminUser.id,
            job_title: 'Super Admin',
            hire_date: new Date().toISOString(),
            // Các field bắt buộc khác (nếu có)
         })
    }

    return NextResponse.json({ 
        success: true, 
        message: `Admin account ready: ${email} / ${password}`,
        uid: adminUser.id 
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
