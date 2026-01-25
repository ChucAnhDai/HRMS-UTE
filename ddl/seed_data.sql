-- 1. Insert Departments
INSERT INTO departments (name) VALUES
('Phòng Kỹ Thuật (Engineering)'),
('Phòng Nhân Sự (HR)'),
('Phòng Kinh Doanh (Sales)'),
('Ban Giám Đốc (Board)');

-- 2. Insert Employees (Giả sử ID phòng ban lần lượt là 1, 2, 3, 4 vì mới reset DB)
INSERT INTO employees (first_name, last_name, email, department_id, hire_date, salary, employment_status, avatar) VALUES
('Sáng', 'Bùi Quang', 'sang.bui@example.com', 1, '2023-01-15', 25000000, 'Active', 'https://ui-avatars.com/api/?name=Bui+Quang+Sang&background=0D8ABC&color=fff'),
('Lan', 'Nguyễn Thị', 'lan.nguyen@example.com', 2, '2023-03-10', 15000000, 'Active', 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=random'),
('Hùng', 'Phạm Văn', 'hung.pham@example.com', 1, '2024-05-20', 18000000, 'Active', NULL),
('Tuấn', 'Trần Minh', 'tuan.tran@example.com', 3, '2022-11-01', 30000000, 'Active', 'https://ui-avatars.com/api/?name=Tran+Minh+Tuan&background=random'),
('Mai', 'Lê Thị', 'mai.le@example.com', 2, '2023-08-15', 12000000, 'Terminated', NULL);
