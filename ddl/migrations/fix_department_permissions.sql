-- Enable RLS for departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view departments (needed for dropdowns)
CREATE POLICY "Everyone can view departments" 
ON public.departments FOR SELECT 
TO authenticated, anon
USING (true);

-- Allow Admins and HR to manage departments (Insert/Update/Delete)
CREATE POLICY "Admins and HR can manage departments" 
ON public.departments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE auth_user_id = auth.uid() 
    AND (role::text = 'ADMIN' OR role::text = 'HR' OR role::text = 'MANAGER')
  )
);

-- Grant privileges
GRANT ALL ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
