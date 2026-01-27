import { createClient } from '@supabase/supabase-js'

// Client này có quyền Admin tối cao (cẩn thận khi dùng)
// Chỉ dùng trong các Service Server-side đặc biệt
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
