-- Add salary column to contracts table
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS salary DECIMAL(15, 2) DEFAULT 0;

-- Create payrolls table for monthly salary calculation
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Format: 'YYYY-MM'
    base_salary DECIMAL(15, 2) NOT NULL,
    work_days INT DEFAULT 0,
    leave_days INT DEFAULT 0, -- Paid leave days
    allowance DECIMAL(15, 2) DEFAULT 0, -- Phụ cấp
    bonus DECIMAL(15, 2) DEFAULT 0,
    deduction DECIMAL(15, 2) DEFAULT 0,
    total_salary DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Paid', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, month) -- Prevent duplicate payrolls for same month
);

-- RLS Policies for payrolls
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON payrolls FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON payrolls FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON payrolls FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON payrolls FOR DELETE USING (true);
