import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lwcnbieraqvcymubmvwy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y25iaWVyYXF2Y3ltdWJtdnd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5MTAwOSwiZXhwIjoyMDg0NzY3MDA5fQ.gZYrDHNR7BFdYFZgHXEbY1MolNHwRjIKCcO8iSs9zYc';
const DB_URL = 'postgresql://postgres:supabase%40123@db.lwcnbieraqvcymubmvwy.supabase.co:5432/postgres';

const sql = postgres(DB_URL, { ssl: 'require' });
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  try {
    console.log('--- RE-SETTING ADMIN ROLE ---');
    let adminUserId = '0ce8e3d3-aa44-4b4f-887a-b733f336da97'; 

    console.log('1. Đang cập nhật bảng users (set role=admin)...');
    const [user] = await sql`
        INSERT INTO users (name, email, role, status)
        VALUES ('Admin System', 'admin@gmail.com', 'admin', 'active')
        ON CONFLICT (email) DO UPDATE SET role = 'admin', name = 'Admin System'
        RETURNING id;
    `;
    const publicUserId = user.id;
    console.log('✅ Bảng users OK, ID =', publicUserId);

    console.log('2. Đang cập nhật bảng employees (set role=ADMIN)...');
    await sql`
        INSERT INTO employees (user_id, auth_user_id, first_name, last_name, email, hire_date, employment_status, role)
        VALUES (${publicUserId}, ${adminUserId}, 'System', 'Admin', 'admin@gmail.com', CURRENT_DATE, 'Active', 'ADMIN')
        ON CONFLICT (email) DO UPDATE SET 
            auth_user_id = EXCLUDED.auth_user_id, 
            user_id = EXCLUDED.user_id, 
            role = 'ADMIN',
            first_name = 'System',
            last_name = 'Admin';
    `;
    console.log('✅ Bảng employees OK (Role đã chuyển sang ADMIN)!');

    console.log('\n🎉 ĐÃ FIX XONG QUYỀN ADMIN. Vui lòng F5 lại trang web!');
  } catch (err) {
    console.error('❌ LỖI:', err.message);
  } finally {
    await sql.end();
  }
}

main();
