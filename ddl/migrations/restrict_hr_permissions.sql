-- Drop old policy that allowed HR/Manager to edit
DROP POLICY IF EXISTS "Admins and HR can manage departments" ON public.departments;

-- New policy: Only ADMIN can manage departments (Insert/Update/Delete)
CREATE POLICY "Admins can manage departments" 
ON public.departments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE auth_user_id = auth.uid() 
    AND role::text = 'ADMIN'
  )
);
