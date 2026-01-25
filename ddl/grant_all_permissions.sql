-- Cấp quyền cho bảng employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
GRANT ALL ON employees TO postgres, service_role;
GRANT ALL ON employees TO authenticated, anon;
CREATE POLICY "Enable all access for employees" ON employees USING (true) WITH CHECK (true);

-- Cấp quyền cho bảng contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON contracts TO postgres, service_role;
GRANT ALL ON contracts TO authenticated, anon;
CREATE POLICY "Enable all access for contracts" ON contracts USING (true) WITH CHECK (true);

-- Cấp quyền cho bảng attendances
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
GRANT ALL ON attendances TO postgres, service_role;
GRANT ALL ON attendances TO authenticated, anon;
CREATE POLICY "Enable all access for attendances" ON attendances USING (true) WITH CHECK (true);

-- Cấp quyền cho bảng leave_requests
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
GRANT ALL ON leave_requests TO postgres, service_role;
GRANT ALL ON leave_requests TO authenticated, anon;
CREATE POLICY "Enable all access for leave_requests" ON leave_requests USING (true) WITH CHECK (true);

-- Cấp quyền cho bảng payrolls (Quan trọng cho lỗi bạn đang gặp)
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
GRANT ALL ON payrolls TO postgres, service_role;
GRANT ALL ON payrolls TO authenticated, anon;
CREATE POLICY "Enable all access for payrolls" ON payrolls USING (true) WITH CHECK (true);

-- Cấp quyền cho bảng users và departments
GRANT ALL ON users TO authenticated, anon;
GRANT ALL ON departments TO authenticated, anon;
