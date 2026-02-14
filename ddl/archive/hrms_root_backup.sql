-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.asset_assignments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  asset_id bigint NOT NULL,
  employee_id bigint NOT NULL,
  assigned_date date NOT NULL,
  returned_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT asset_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT asset_assignments_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id),
  CONSTRAINT asset_assignments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.assets (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  asset_tag text NOT NULL UNIQUE,
  purchase_date date NOT NULL,
  purchase_cost numeric NOT NULL,
  status text NOT NULL DEFAULT 'Available'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  assigned_to integer,
  assigned_date date,
  CONSTRAINT assets_pkey PRIMARY KEY (id),
  CONSTRAINT assets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id)
);
CREATE TABLE public.attendances (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  date date NOT NULL,
  check_in_time time without time zone,
  check_out_time time without time zone,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attendances_pkey PRIMARY KEY (id),
  CONSTRAINT attendances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.candidates (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  job_opening_id bigint NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  cv_path text,
  status text NOT NULL DEFAULT 'Pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  resume_path text,
  CONSTRAINT candidates_pkey PRIMARY KEY (id),
  CONSTRAINT candidates_job_opening_id_fkey FOREIGN KEY (job_opening_id) REFERENCES public.job_openings(id)
);
CREATE TABLE public.contracts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  contract_type text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  file_path text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  salary numeric DEFAULT 0,
  CONSTRAINT contracts_pkey PRIMARY KEY (id),
  CONSTRAINT contracts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.departments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.employees (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  department_id bigint,
  user_id bigint,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  hire_date date NOT NULL,
  probation_end_date date,
  salary numeric,
  annual_leave_quota integer DEFAULT 12,
  sick_leave_quota integer DEFAULT 5,
  other_leave_quota integer DEFAULT 5,
  tax_code text,
  dependents integer DEFAULT 0,
  avatar text,
  employment_status text DEFAULT 'Active'::text,
  termination_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  job_title text,
  auth_user_id uuid,
  role USER-DEFINED DEFAULT 'EMPLOYEE'::user_role,
  CONSTRAINT employees_pkey PRIMARY KEY (id),
  CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT employees_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.holidays (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  date date NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT holidays_pkey PRIMARY KEY (id)
);
CREATE TABLE public.job_openings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  department_id bigint,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'Open'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT job_openings_pkey PRIMARY KEY (id),
  CONSTRAINT job_openings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id)
);
CREATE TABLE public.leave_requests (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'Pending'::text,
  action_by_user_id bigint,
  action_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  rejection_reason text,
  action_by_employee_id bigint,
  CONSTRAINT leave_requests_pkey PRIMARY KEY (id),
  CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id),
  CONSTRAINT leave_requests_action_by_user_id_fkey FOREIGN KEY (action_by_user_id) REFERENCES public.users(id),
  CONSTRAINT leave_requests_action_by_employee_id_fkey FOREIGN KEY (action_by_employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.overtime_requests (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  hours numeric NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'Pending'::text,
  approved_by bigint,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  action_by_employee_id bigint,
  CONSTRAINT overtime_requests_pkey PRIMARY KEY (id),
  CONSTRAINT overtime_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id),
  CONSTRAINT overtime_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id),
  CONSTRAINT overtime_requests_action_by_employee_id_fkey FOREIGN KEY (action_by_employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.payrolls (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id bigint NOT NULL,
  month text NOT NULL,
  base_salary numeric NOT NULL,
  work_days integer DEFAULT 0,
  leave_days integer DEFAULT 0,
  allowance numeric DEFAULT 0,
  bonus numeric DEFAULT 0,
  deduction numeric DEFAULT 0,
  total_salary numeric NOT NULL,
  status text DEFAULT 'Draft'::text CHECK (status = ANY (ARRAY['Draft'::text, 'Paid'::text, 'Cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payrolls_pkey PRIMARY KEY (id),
  CONSTRAINT payrolls_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.payslips (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  salary numeric NOT NULL,
  ot_hours numeric DEFAULT 0,
  ot_salary numeric DEFAULT 0,
  bonus numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  social_insurance numeric DEFAULT 0,
  penalties numeric DEFAULT 0,
  advance_amount numeric DEFAULT 0,
  net_pay numeric NOT NULL,
  status text NOT NULL DEFAULT 'Generated'::text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payslips_pkey PRIMARY KEY (id),
  CONSTRAINT payslips_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.rewards_penalties (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['Reward'::text, 'Penalty'::text])),
  amount numeric NOT NULL,
  reason text,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'Pending'::text CHECK (status = ANY (ARRAY['Pending'::text, 'Processed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rewards_penalties_pkey PRIMARY KEY (id),
  CONSTRAINT rewards_penalties_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.salary_advances (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  request_date date NOT NULL DEFAULT CURRENT_DATE,
  reason text,
  status text NOT NULL DEFAULT 'Pending'::text CHECK (status = ANY (ARRAY['Pending'::text, 'Approved'::text, 'Rejected'::text])),
  approved_by bigint,
  approved_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT salary_advances_pkey PRIMARY KEY (id),
  CONSTRAINT salary_advances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id),
  CONSTRAINT salary_advances_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id)
);
CREATE TABLE public.salary_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  employee_id bigint NOT NULL,
  old_salary numeric,
  new_salary numeric NOT NULL,
  change_date date NOT NULL DEFAULT CURRENT_DATE,
  changed_by_employee_id bigint,
  reason text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT salary_history_pkey PRIMARY KEY (id),
  CONSTRAINT salary_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id),
  CONSTRAINT salary_history_changed_by_employee_id_fkey FOREIGN KEY (changed_by_employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.settings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'user'::text,
  status text NOT NULL DEFAULT 'active'::text,
  avatar text,
  email_verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);