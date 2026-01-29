-- FIX V5: ERROR DEBUGGING MODE
-- Allow ANY authenticated user to Insert/Select overtime requests.
-- This bypasses complex checks (Email, Join, Function) to confirm if the issue is strictly RLS logic vs Data mismatch.

-- 1. Enable RLS
ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to be safe
DROP POLICY IF EXISTS "Employees can view their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Employees can create their own requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can view all requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can update requests" ON overtime_requests;
DROP POLICY IF EXISTS "Admins and Managers can insert requests" ON overtime_requests;
DROP POLICY IF EXISTS "View Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Insert Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Update Overtime Requests" ON overtime_requests;
DROP POLICY IF EXISTS "Delete Overtime Requests" ON overtime_requests;

-- 3. Create SIMPLE "Authenticated Users Only" Policies

-- VIEW: Allow any logged-in user to view ALL requests (Temporary for debugging)
CREATE POLICY "View Overtime Requests" ON overtime_requests
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Allow any logged-in user to insert requests
CREATE POLICY "Insert Overtime Requests" ON overtime_requests
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

-- UPDATE: Allow any logged-in user to update (Temporary)
CREATE POLICY "Update Overtime Requests" ON overtime_requests
FOR UPDATE
USING (
  auth.role() = 'authenticated'
);

-- DELETE: Allow any logged-in user to delete (Temporary)
CREATE POLICY "Delete Overtime Requests" ON overtime_requests
FOR DELETE
USING (
  auth.role() = 'authenticated'
);
