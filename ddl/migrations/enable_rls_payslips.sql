-- Enable RLS
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép xem (Ai cũng xem được lương của mình hoặc Admin xem tất cả - Tạm thời cho xem tất cả authenticated để dashboard chạy)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON payslips;
CREATE POLICY "Enable read access for authenticated users" ON "public"."payslips"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- 2. Cho phép INSERT (Chỉ Admin/Manager thực hiện qua Server Action)
-- Lưu ý: Server Action dùng Service Role Key thì sẽ bypass RLS. 
-- Nhưng nếu dùng createClient (user client) thì cần policy này.
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON payslips;
CREATE POLICY "Enable insert access for authenticated users" ON "public"."payslips"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Cho phép UPDATE
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON payslips;
CREATE POLICY "Enable update access for authenticated users" ON "public"."payslips"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true);

-- 4. Cho phép DELETE (Khi tính lại lương)
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON payslips;
CREATE POLICY "Enable delete access for authenticated users" ON "public"."payslips"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
