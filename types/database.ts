export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: number
          name: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: number
          name: string
          email: string
          role: string
          status: string
          avatar: string | null
          email_verified_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          email: string
          role?: string
          status?: string
          avatar?: string | null
          email_verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          email?: string
          role?: string
          status?: string
          avatar?: string | null
          email_verified_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      employees: {
        Row: {
          id: number
          department_id: number | null
          user_id: number | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          hire_date: string
          probation_end_date: string | null
          salary: number | null
          annual_leave_quota: number
          sick_leave_quota: number
          other_leave_quota: number
          tax_code: string | null
          dependents: number
          avatar: string | null
          employment_status: string | null
          termination_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          department_id?: number | null
          user_id?: number | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          hire_date: string
          probation_end_date?: string | null
          salary?: number | null
          annual_leave_quota?: number
          sick_leave_quota?: number
          other_leave_quota?: number
          tax_code?: string | null
          dependents?: number
          avatar?: string | null
          employment_status?: string | null
          termination_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          department_id?: number | null
          user_id?: number | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          hire_date?: string
          probation_end_date?: string | null
          salary?: number | null
          annual_leave_quota?: number
          sick_leave_quota?: number
          other_leave_quota?: number
          tax_code?: string | null
          dependents?: number
          avatar?: string | null
          employment_status?: string | null
          termination_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contracts: {
        Row: {
          id: number
          employee_id: number
          contract_type: string
          start_date: string
          end_date: string | null
          salary: number | null
          file_path: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          employee_id: number
          contract_type: string
          start_date: string
          end_date?: string | null
          salary?: number | null
          file_path?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          employee_id?: number
          contract_type?: string
          start_date?: string
          end_date?: string | null
          salary?: number | null
          file_path?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      payrolls: {
        Row: {
          id: string
          employee_id: number
          month: string
          base_salary: number
          work_days: number
          leave_days: number
          bonus: number | null
          deduction: number | null
          allowance: number | null
          total_salary: number
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          employee_id: number
          month: string
          base_salary: number
          work_days?: number
          leave_days?: number
          bonus?: number | null
          deduction?: number | null
          allowance?: number | null
          total_salary: number
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: number
          month?: string
          base_salary?: number
          work_days?: number
          leave_days?: number
          bonus?: number | null
          deduction?: number | null
          allowance?: number | null
          total_salary?: number
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      attendances: {
        Row: {
          id: number
          employee_id: number
          date: string
          check_in_time: string | null
          check_out_time: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          employee_id: number
          date: string
          check_in_time?: string | null
          check_out_time?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          employee_id?: number
          date?: string
          check_in_time?: string | null
          check_out_time?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      leave_requests: {
        Row: {
          id: number
          employee_id: number
          leave_type: string
          start_date: string
          end_date: string
          reason: string | null
          status: string
          action_by_user_id: number | null
          action_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          employee_id: number
          leave_type: string
          start_date: string
          end_date: string
          reason?: string | null
          status?: string
          action_by_user_id?: number | null
          action_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          employee_id?: number
          leave_type?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          status?: string
          action_by_user_id?: number | null
          action_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      assets: {
        Row: {
          id: number
          name: string
          asset_tag: string
          purchase_date: string
          purchase_cost: number
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          asset_tag: string
          purchase_date: string
          purchase_cost: number
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          asset_tag?: string
          purchase_date?: string
          purchase_cost?: number
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
