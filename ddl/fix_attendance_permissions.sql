-- FIX QUYỀN CHO BẢNG ATTENDANCES & CONTRACTS
-- Chạy script này trong Supabase SQL Editor

-- 1. Xóa chính sách cũ để tránh lỗi trùng nếu chạy lại
DROP POLICY IF EXISTS "Public Read Attendances" ON attendances;
DROP POLICY IF EXISTS "Public Write Attendances" ON attendances;
DROP POLICY IF EXISTS "Public Read Contracts" ON contracts;
DROP POLICY IF EXISTS "Public Write Contracts" ON contracts;

-- 2. Cấp quyền Đọc/Ghi thoải mái cho bảng Attendances (Chấm công)
-- Lưu ý: Môi trường Dev nên để true, Product nên siết chặt hơn
CREATE POLICY "Public Read Attendances" ON attendances FOR SELECT USING (true);
CREATE POLICY "Public Write Attendances" ON attendances FOR ALL USING (true);

-- 3. Cấp quyền Đọc/Ghi cho bảng Contracts (Hợp đồng) - Đề phòng lỗi tương tự
CREATE POLICY "Public Read Contracts" ON contracts FOR SELECT USING (true);
CREATE POLICY "Public Write Contracts" ON contracts FOR ALL USING (true);
