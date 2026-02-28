-- Migration: Add rejection_reason column to overtime_requests table
-- Mục đích: Cho phép admin nhập lý do khi từ chối yêu cầu tăng ca

-- Thêm cột rejection_reason
ALTER TABLE overtime_requests 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL;

-- Thêm comment mô tả
COMMENT ON COLUMN overtime_requests.rejection_reason IS 'Lý do từ chối đơn tăng ca (chỉ điền khi status = Rejected)';
