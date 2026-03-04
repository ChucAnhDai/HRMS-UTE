-- 014_add_payslip_work_columns.sql
-- Thêm các cột phục vụ việc lưu trữ thông tin ngày công và lương gross chính xác tại thời điểm tính lương
-- (Tránh phải reverse-engineer lại từ net pay)

ALTER TABLE payslips 
ADD COLUMN IF NOT EXISTS gross_from_work DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_work_days INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS paid_leave_days INT DEFAULT 0;
