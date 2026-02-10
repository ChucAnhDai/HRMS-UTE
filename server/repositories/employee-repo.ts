import { createClient } from '@/lib/supabase.server'
import { Database } from '@/types/database'


export const employeeRepo = {
  // Lấy danh sách tất cả nhân viên kèm tên phòng ban
  async getEmployees() {
    const supabase = await createClient()
    
    // Select * và join bảng departments
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        auth_user_id,
        departments (
          id,
          name
        )
      `)
      .order('hire_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  // Lấy chi tiết 1 nhân viên theo ID
  async getEmployeeById(id: number) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        auth_user_id,
        departments (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data
  },

  // Tạo nhân viên mới
  async createEmployee(employeeData: Database['public']['Tables']['employees']['Insert']) {
    const supabase = await createClient()
    
    // Convert keys from CamelCase (Form) to SnakeCase (DB) if needed
    // But for simplicity, we assume service passes correct shape or we map here
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single()

    if (error) {
      console.error('Error creating employee:', error)
      throw new Error(error.message)
    }

    return data
  },

  // Lấy danh sách phòng ban
  async getDepartments() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('departments').select('*').order('name')
    if (error) throw new Error(error.message)
    return data
  },

  // Xóa nhân viên
  async deleteEmployee(id: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('employees').delete().eq('id', id)
    
    if (error) {
      throw new Error(error.message)
    }
  },

  // Cập nhật nhân viên
  async updateEmployee(id: number, employeeData: Database['public']['Tables']['employees']['Update']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
