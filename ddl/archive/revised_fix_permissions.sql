-- REVISED FIX: ALLOW BOTH ANONYMOUS AND LOGGED-IN USERS TO APPLY

-- 1. Ensure RLS is active
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 2. DROP conflicting policies to ensure a clean slate
DROP POLICY IF EXISTS "Public apply candidates" ON candidates;
DROP POLICY IF EXISTS "Enable insert for anon" ON candidates;
DROP POLICY IF EXISTS "Everyone can apply" ON candidates;

-- 3. CREATE POLICY: Allow ANYONE (Guest or Admin) to Insert (Apply)
-- Using 'public' role covers both 'anon' and 'authenticated'
CREATE POLICY "Everyone can apply"
ON candidates
FOR INSERT
TO public
WITH CHECK (true);

-- 4. CREATE POLICY: Allow Authenticated users (Admins) to View applications
DROP POLICY IF EXISTS "Authenticated view candidates" ON candidates;
CREATE POLICY "Authenticated view candidates"
ON candidates
FOR SELECT
TO authenticated
USING (true);

-- 5. GRANT Database-level permissions
GRANT INSERT, SELECT ON TABLE candidates TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE candidates_id_seq TO anon, authenticated, service_role;
