-- DDL for instruments table

-- Create the table
create table instruments (
  id bigint primary key generated always as identity,
  name text not null
);

-- Insert some sample data
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello');

-- Enable Row Level Security
alter table instruments enable row level security;

-- Create policy for public read access
create policy "public can read instruments" on public.instruments for select to anon using (true);