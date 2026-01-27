-- Migration: Add rejection_reason column to leave_requests table
-- Created: 2026-01-26
-- Description: Thêm cột lý do từ chối đơn nghỉ phép

-- Thêm cột rejection_reason
ALTER TABLE leave_requests 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL;

-- Thêm comment cho cột
COMMENT ON COLUMN leave_requests.rejection_reason IS 'Lý do từ chối đơn nghỉ phép (chỉ điền khi status = Rejected)';
