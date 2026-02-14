-- Migration: Thay đổi từ action_by_user_id sang action_by_employee_id
-- Description: Bảng users không được sử dụng trực tiếp, thay vào đó dùng employees
-- Created: 2026-01-26

-- Bước 1: Thêm cột mới liên kết đến employees
ALTER TABLE leave_requests 
ADD COLUMN IF NOT EXISTS action_by_employee_id bigint REFERENCES employees(id) ON DELETE SET NULL;

-- Bước 2: Thêm comment mô tả
COMMENT ON COLUMN leave_requests.action_by_employee_id IS 'ID nhân viên (Admin/Manager) thực hiện duyệt/từ chối đơn';

-- Bước 3: Tạo index để query nhanh
CREATE INDEX IF NOT EXISTS idx_leave_requests_action_by_employee_id ON leave_requests(action_by_employee_id);

-- Lưu ý: Cột cũ action_by_user_id vẫn giữ lại để tương thích ngược
-- Có thể xóa sau khi đã migrate toàn bộ dữ liệu

-- Tương tự cho bảng overtime_requests nếu có
ALTER TABLE overtime_requests 
ADD COLUMN IF NOT EXISTS action_by_employee_id bigint REFERENCES employees(id) ON DELETE SET NULL;
