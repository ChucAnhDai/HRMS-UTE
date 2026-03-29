import { createClient } from '@/lib/supabase.server'
import { SalaryAdvance } from '@/types'

export const salaryAdvanceRepo = {
  async createRequest(data: Pick<SalaryAdvance, 'employee_id' | 'amount' | 'reason' | 'request_date'>) {
    const supabase = await createClient()
    const { data: newRequest, error } = await supabase
      .from('salary_advances')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return newRequest
  },

  async getRequestById(id: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('salary_advances')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as unknown as SalaryAdvance
  },

  async getRequests(filters?: {
    employeeId?: number
    month?: number
    year?: number
    status?: string
  }) {
    const supabase = await createClient()
    let query = supabase
      .from('salary_advances')
      .select(`
        *,
        employees!salary_advances_employee_id_fkey (
          id,
          first_name,
          last_name,
          department_id,
          departments (name)
        )
      `)
      .order('request_date', { ascending: false })

    if (filters?.employeeId) {
      query = query.eq('employee_id', filters.employeeId)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    if (filters?.month && filters?.year) {
      // Filter by range of the month
      const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
      // Logic to find end date, or just check >= start and < next month start
      // For simplicity in supabase filter:
      // We can check if request_date is within the month
      // Or we can rely on JS filtering if data is small, but DB filtering is better.
      // Let's assume standard month filtering logic.
       const nextMonth = filters.month === 12 ? 1 : filters.month + 1;
       const nextYear = filters.month === 12 ? filters.year + 1 : filters.year;
       const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
       
       query = query.gte('request_date', startDate).lt('request_date', endDate)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data as unknown as SalaryAdvance[]
  },

  async updateStatus(id: number, status: 'Approved' | 'Rejected', approverEmployeeId: number, rejectionReason?: string) {
    const supabase = await createClient()
    const updateData: {
      status: string;
      approved_by: number;
      approved_at: string;
      rejection_reason?: string;
    } = {
      status,
      approved_by: approverEmployeeId,
      approved_at: new Date().toISOString()
    }

    if (status === 'Rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason
    }

    const { data, error } = await supabase
      .from('salary_advances')
      .update(updateData)
      .eq('id', id)
      .eq('status', 'Pending')
      .select()
      .single()

    if (error) {
        if (error.code === 'PGRST116') {
            throw new Error('Đơn tạm ứng này đã được xử lý trước đó. Vui lòng tải lại trang.')
        }
        throw new Error(error.message)
    }
    return data
  },

  async getTotalApprovedAdvances(employeeId: number, month: number, year: number) {
    const supabase = await createClient()
    
    // Calculate start and end of month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    const { data, error } = await supabase
      .from('salary_advances')
      .select('amount')
      .eq('employee_id', employeeId)
      .eq('status', 'Approved')
      .gte('request_date', startDate)
      .lt('request_date', endDate)

    if (error) throw new Error(error.message)
    
    // Sum amounts
    return data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  }
}
