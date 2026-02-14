-- Enable RLS on tables if not already enabled
alter table job_openings enable row level security;
alter table candidates enable row level security;

-- POLICY FOR JOB_OPENINGS

-- 1. Allow public (anon) and authenticated users to VIEW 'Open' jobs
-- This allows the Career page to show jobs
create policy "Public view open jobs"
on job_openings for select
to anon, authenticated
using (status = 'Open');

-- 2. Allow authenticated users (Admin/Manager) to DO EVERYTHING (Select, Insert, Update, Delete)
-- Ideally you should check for role, but 'authenticated' is a good start for internal apps
create policy "Authenticated manage jobs"
on job_openings for all
to authenticated
using (true)
with check (true);


-- POLICY FOR CANDIDATES

-- 1. Allow public (anon) to INSERT applications (Apply for job)
create policy "Public apply candidates"
on candidates for insert
to anon, authenticated
with check (true);

-- 2. Allow authenticated users (Admin/Manager) to VIEW applications
create policy "Authenticated view candidates"
on candidates for select
to authenticated
using (true);

-- 3. Allow authenticated users to DELETE candidates (optional)
create policy "Authenticated delete candidates"
on candidates for delete
to authenticated
using (true);
