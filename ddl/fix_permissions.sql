-- FILE NÀY ĐỂ FIX LỖI "PERMISSION DENIED"
-- Chạy toàn bộ lệnh dưới đây trong Supabase SQL Editor

-- 1. Cấp quyền cơ bản cho role 'anon' (người dùng chưa đăng nhập) và 'authenticated' (đã đăng nhập)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 2. Xóa các chính sách cũ (nếu có) để tránh trùng lặp gây lỗi
DROP POLICY IF EXISTS "Public Read Access" ON employees;
DROP POLICY IF EXISTS "Public Read Access" ON departments;
DROP POLICY IF EXISTS "Public Read Access" ON job_openings;

-- 3. Tạo lại chính sách cho phép ĐỌC (SELECT) dữ liệu công khai
-- Lưu ý: Đây là cấu hình cho Dev, cho phép bất kỳ ai cũng xem được danh sách nhân viên
CREATE POLICY "Public Read Employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Public Read Departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public Read Jobs" ON job_openings FOR SELECT USING (true);

-- 4. Policy cho phép INSERT/UPDATE (Nếu bạn muốn test thêm/sửa từ UI sau này)
CREATE POLICY "Public Write Employees" ON employees FOR ALL USING (true);
