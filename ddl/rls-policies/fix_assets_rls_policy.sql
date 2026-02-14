-- Enable RLS cho bảng assets (nếu chưa bật)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policy cho phép mọi người (authenticated users) xem
CREATE POLICY "Enable read access for all users" ON assets FOR SELECT USING (true);

-- Policy cho phép admin/authenticated users thêm mới
CREATE POLICY "Enable insert access for all users" ON assets FOR INSERT WITH CHECK (true);

-- Policy cho phép update
CREATE POLICY "Enable update access for all users" ON assets FOR UPDATE USING (true);

-- Policy cho phép delete
CREATE POLICY "Enable delete access for all users" ON assets FOR DELETE USING (true);
