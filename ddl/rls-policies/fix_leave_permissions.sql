-- FIX QUYỀN CHO BẢNG LEAVE_REQUESTS
-- Chạy script này trong Supabase SQL Editor

-- 1. Xóa chính sách cũ 
DROP POLICY IF EXISTS "Public Read LeaveRequests" ON leave_requests;
DROP POLICY IF EXISTS "Public Write LeaveRequests" ON leave_requests;

-- 2. Cấp quyền Đọc/Ghi 
CREATE POLICY "Public Read LeaveRequests" ON leave_requests FOR SELECT USING (true);
CREATE POLICY "Public Write LeaveRequests" ON leave_requests FOR ALL USING (true);
