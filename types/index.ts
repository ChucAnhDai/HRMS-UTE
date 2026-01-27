// Basic Database Types
export interface Department {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee' | 'user'
  status: 'active' | 'inactive'
  avatar?: string | null
  created_at?: string
}

export type EmploymentStatus = 'Active' | 'Probation' | 'Resigned' | 'Terminated' | 'On Leave' | 'Intern' | 'Part-time'

export interface Employee {
  id: number
  user_id?: number | null
  department_id?: number | null
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  avatar?: string | null
  
  // Job Info
  job_title?: string | null
  hire_date: string
  probation_end_date?: string | null
  termination_date?: string | null
  employment_status: EmploymentStatus
  
  // Salary & Tax
  salary?: number | null
  tax_code?: string | null
  dependents?: number | null
  
  // Quota
  annual_leave_quota: number
  sick_leave_quota: number
  other_leave_quota: number
  
  created_at?: string
  updated_at?: string
  
  // Relations
  department?: Department | null
  departments?: Department | null // Supabase alias
  user?: User | null
}

export interface Asset {
  id: number
  name: string
  asset_tag: string
  purchase_date: string
  purchase_cost: number
  status: 'Available' | 'In Use' | 'Maintenance' | 'Lost' | 'Broken' | 'Liquidated' | 'Sẵn sàng' | 'Đang sử dụng' | 'Đang bảo trì' | 'Mất' | 'Hỏng' | 'Đã thanh lý'
  created_at?: string
}

export interface AssetAssignment {
  id: number
  asset_id: number
  employee_id: number
  assigned_date: string
  returned_date?: string | null
  created_at?: string
  
  // Relations
  asset?: Asset
  employee?: Employee
}

export interface Attendance {
  id: number
  employee_id: number
  date: string
  check_in_time?: string | null
  check_out_time?: string | null
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday'
  created_at?: string
  
  // Relations
  employee?: Employee
}

export interface LeaveRequest {
  id: number
  employee_id: number
  leave_type: 'Annual' | 'Sick' | 'Unpaid' | 'Maternity' | 'Bereavement' | 'Other'
  start_date: string
  end_date: string
  reason?: string | null
  status: 'Pending' | 'Approved' | 'Rejected'
  action_by_user_id?: number | null
  rejection_reason?: string | null
  created_at?: string
  
  // Relations
  employee?: Employee
  approver?: User
}

export interface Contract {
  id: number
  employee_id: number
  contract_type: 'Indefinite' | 'Fixed-term' | 'Probation' | 'Internship'
  start_date: string
  end_date?: string | null
  file_path?: string | null
  notes?: string | null
  created_at?: string
  
  // Relations
  employee?: Employee
}

export interface Payslip {
  id: number
  employee_id: number
  month: number
  year: number
  salary: number
  
  // Income
  ot_hours: number
  ot_salary: number
  bonus: number
  
  // Deductions
  social_insurance: number
  tax: number
  advance_amount: number
  penalties: number
  
  net_pay: number
  status: 'Pending' | 'Paid'
  notes?: string | null
  
  created_at?: string
  updated_at?: string
  
  // Relations
  employees?: Employee 
}

export interface PayslipUpdateDTO {
  salary?: number
  ot_hours?: number
  ot_salary?: number
  bonus?: number
  advance_amount?: number
  penalties?: number
  note?: string
}

export interface OvertimeRequest {
  id: number
  employee_id: number
  date: string
  start_time: string
  end_time: string
  hours: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  approved_by?: number | null
  created_at?: string
  
  // Relations
  employees?: Employee
}
