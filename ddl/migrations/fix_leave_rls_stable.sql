-- FIX LEAVE RLS (Mirroring Overtime V5 - Authenticated Access)
-- Ensures consistency with currently working Overtime policies.
-- Security checks for Admin/Manager roles are enforced at the Server Action level.

-- 1. Enable RLS
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public Read LeaveRequests" ON leave_requests;
DROP POLICY IF EXISTS "Public Write LeaveRequests" ON leave_requests;
DROP POLICY IF EXISTS "View Leave Requests" ON leave_requests;
DROP POLICY IF EXISTS "Insert Leave Requests" ON leave_requests;
DROP POLICY IF EXISTS "Update Leave Requests" ON leave_requests;
DROP POLICY IF EXISTS "Delete Leave Requests" ON leave_requests;

-- 3. Create Stable Policies (Authenticated Users Only)

-- VIEW: Allow all authenticated users to view (Frontend filters by user)
CREATE POLICY "View Leave Requests" ON leave_requests
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Allow all authenticated users to verify (Backend enforces constraints)
CREATE POLICY "Insert Leave Requests" ON leave_requests
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

-- UPDATE: Allow all authenticated to update (Backend ensures only Admin approves)
CREATE POLICY "Update Leave Requests" ON leave_requests
FOR UPDATE
USING (
  auth.role() = 'authenticated'
);

-- DELETE: Allow all authenticated users (Admin only via UI)
CREATE POLICY "Delete Leave Requests" ON leave_requests
FOR DELETE
USING (
  auth.role() = 'authenticated'
);
