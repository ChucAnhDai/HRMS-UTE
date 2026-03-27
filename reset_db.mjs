import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lwcnbieraqvcymubmvwy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y25iaWVyYXF2Y3ltdWJtdnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5MTAwOSwiZXhwIjoyMDg0NzY3MDA5fQ.gZYrDHNR7BFdYFZgHXEbY1MolNHwRjIKCcO8iSs9zYc';
// Password contains "@", so URL encode it to %40
const DB_URL = 'postgresql://postgres:supabase%40123@db.lwcnbieraqvcymubmvwy.supabase.co:5432/postgres';

const sql = postgres(DB_URL, { ssl: 'require' });
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  try {
    console.log('1. XÓA TOÀN BỘ DATA (TRUNCATE) ...');
    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
    
    if (tables.length > 0) {
      const tableNames = tables.map(t => `"public"."${t.tablename}"`).join(', ');
      await sql.unsafe(`TRUNCATE TABLE ${tableNames} CASCADE;`);
      console.log(`✅ Đã xóa data ${tables.length} bảng (CASCADE)!`);
    } else {
      console.log('⚠️ Không tìm thấy bảng public nào.');
    }

    console.log('\n2. TẠO TÀI KHOẢN ADMIN ...');
    // Tạo auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'admin123@Password',
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    let adminUserId = null;

    if (authError) {
      console.log('⚠️ Lỗi tạo user trên Auth, có thể tài khoản đã tồn tại. Lỗi:', authError.message);
      // Lấy id tài khoản đã có
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const existing = existingUser?.users?.find(u => u.email === 'admin@gmail.com');
      if (existing) {
         adminUserId = existing.id;
         console.log('ℹ️ Sử dụng Auth User cũ có ID:', adminUserId);
      }
    } else {
      adminUserId = authData?.user?.id;
      console.log('✅ Đã tạo Auth User thành công. ID:', adminUserId);
    }

    if (adminUserId) {
      const hasUsersTable = tables.some(t => t.tablename === 'users');
      const hasEmployeesTable = tables.some(t => t.tablename === 'employees');

      if (hasUsersTable) {
        try {
          await sql`
            INSERT INTO users (id, email, full_name, role)
            VALUES (${adminUserId}, 'admin@gmail.com', 'Admin System', 'admin')
            ON CONFLICT (id) DO UPDATE SET role = 'admin';
          `;
          console.log('✅ Đã insert/update vào bảng users thành công!');
        } catch(e) { console.log('⚠️ Không thể insert vào bảng users:', e.message); }
      }

      if (hasEmployeesTable) {
        try {
          // Lấy ID tự sinh của nhân viên để an toàn
          await sql`
            INSERT INTO employees (user_id, employee_id, first_name, last_name, email, role)
            VALUES (${adminUserId}, 'EMP-ADMIN', 'System', 'Admin', 'admin@gmail.com', 'admin')
            ON CONFLICT (email) DO NOTHING;
          `;
          console.log('✅ Đã insert vào bảng employees thành công!');
        } catch(e) { console.log('⚠️ Không thể insert vào bảng employees:', e.message); }
      }
    }

    console.log('\n🎉 HOÀN TẤT TẤT CẢ!');
  } catch (err) {
    console.error('❌ LỖI NGHIÊM TRỌNG:', err.message);
  } finally {
    await sql.end();
  }
}

main();
