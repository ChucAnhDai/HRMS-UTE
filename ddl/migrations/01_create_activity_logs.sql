-- Tạo bảng activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id bigint REFERENCES public.employees(id),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id bigint,
    details text,
    created_at timestamp with time zone DEFAULT now()
);

-- Bật RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả user đã xác thực xem (dashboard admin view)
CREATE POLICY "Cho phép đọc activity_logs cho authenticated users" 
ON public.activity_logs 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Cho phép backend service chèn hoạt động (kể cả user tự trigger)
CREATE POLICY "Cho phép insert activity_logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- [QUAN TRỌNG] Phân quyền cơ bản (Grant Privileges)
-- Nếu thiếu bước này, cả Admin (service_role) cũng sẽ bị lỗi Permission Denied
GRANT ALL ON TABLE public.activity_logs TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.activity_logs_id_seq TO anon, authenticated, service_role;
