-- Comprehensive RLS setup for Recruitment Module
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is enabled
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 2. Clean up old policies to avoid conflicts
DROP POLICY IF EXISTS "Public view open jobs" ON job_openings;
DROP POLICY IF EXISTS "Authenticated manage jobs" ON job_openings;
DROP POLICY IF EXISTS "Public apply candidates" ON candidates;
DROP POLICY IF EXISTS "Authenticated view candidates" ON candidates;
DROP POLICY IF EXISTS "Authenticated delete candidates" ON candidates;

-- 3. CANDIDATES POLICIES
-- Allow anyone (public/anon) to INSERT (Apply)
CREATE POLICY "Public apply candidates"
ON candidates FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow admins/authenticated users to VIEW candidates
CREATE POLICY "Authenticated view candidates"
ON candidates FOR SELECT
TO authenticated
USING (true);

-- 4. JOB OPENINGS POLICIES
-- Allow public to VIEW Open jobs
CREATE POLICY "Public view open jobs"
ON job_openings FOR SELECT
TO anon, authenticated
USING (status = 'Open');

-- Allow admins to Manage jobs (Insert/Update/Delete/Select all)
CREATE POLICY "Authenticated manage jobs"
ON job_openings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
