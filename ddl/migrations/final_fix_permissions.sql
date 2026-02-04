-- FINAL FIX FOR CANDIDATE INSERT PERMISSIONS

-- 1. Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy to avoid conflict
DROP POLICY IF EXISTS "Public apply candidates" ON candidates;
DROP POLICY IF EXISTS "Enable insert for anon" ON candidates;

-- 3. Create a permissive policy for anonymous users
CREATE POLICY "Public apply candidates"
ON candidates
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. CRITICAL: Grant database-level privileges to the 'anon' role
-- RLS policies are useless if the role doesn't have basic table access
GRANT INSERT, SELECT ON TABLE candidates TO anon;
GRANT USAGE, SELECT ON SEQUENCE candidates_id_seq TO anon; -- For auto-incrementing ID
