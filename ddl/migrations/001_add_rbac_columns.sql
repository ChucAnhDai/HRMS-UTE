-- 1. Thêm cột liên kết với bảng auth.users
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Thêm cột phân quyền (Role)
CREATE TYPE user_role AS ENUM ('ADMIN', 'HR', 'R_LEADER', 'EMPLOYEE');

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'EMPLOYEE';

-- 3. Đánh index để tra cứu nhanh khi đăng nhập
CREATE INDEX IF NOT EXISTS idx_employees_auth_user_id ON employees(auth_user_id);

-- 4. Thêm chính sách bảo mật (RLS) - Quan trọng!
-- Chỉ cho phép user xem/sửa thông tin của chính mình (hoặc Admin xem tất cả)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON employees FOR SELECT 
USING (auth.uid() = auth_user_id);

-- Tạo Policy cho Admin (tạm thời để true để dev, sau này sẽ siết chặt)
CREATE POLICY "Admins can do everything" 
ON employees FOR ALL 
USING (true); -- Sau này sẽ thay bằng check role = 'ADMIN'
