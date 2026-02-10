-- Enable RLS
ALTER TABLE public.rewards_penalties ENABLE ROW LEVEL SECURITY;

-- Policy for reading (Employees can see their own, Admins/Managers can see all)
CREATE POLICY "Users can view their own rewards/penalties or Admins/Managers view all" 
ON public.rewards_penalties FOR SELECT 
USING (
  (auth.uid() IN (
    SELECT auth_user_id FROM public.employees WHERE id = employee_id
  ))
  OR 
  (EXISTS (
    SELECT 1 FROM public.employees 
    WHERE auth_user_id = auth.uid() 
    AND (role::text = 'ADMIN' OR role::text = 'MANAGER' OR role::text = 'HR')
  ))
);

-- Policy for inserting/updating/deleting (Only Admins/Managers/HR)
CREATE POLICY "Admins, Managers and HR can manage rewards/penalties" 
ON public.rewards_penalties FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE auth_user_id = auth.uid() 
    AND (role::text = 'ADMIN' OR role::text = 'MANAGER' OR role::text = 'HR')
  )
);

-- Grant access to authenticated users
GRANT ALL ON public.rewards_penalties TO authenticated;
GRANT ALL ON public.rewards_penalties TO service_role;
