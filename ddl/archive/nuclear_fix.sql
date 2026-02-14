-- NUCLEAR OPTION: DISABLE RLS ENTIRELY FOR CANDIDATES TABLE
-- This will allow ALL operations on the table without any policy checks
-- Use this to confirm if RLS is the issue, then we can re-enable with correct policies

-- Step 1: Disable Row Level Security completely
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant full permissions to all roles just in case
GRANT ALL ON TABLE candidates TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE candidates_id_seq TO anon, authenticated, service_role;
