import { createClient } from '@/lib/supabase.server'

export interface Department {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface DepartmentWithStats extends Department {
  employee_count: number
}

export const departmentRepo = {
  // Lấy danh sách tất cả phòng ban
  async getDepartments(): Promise<Department[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw new Error(error.message)
    return data || []
  },

  // Lấy danh sách phòng ban kèm số lượng nhân viên
  async getDepartmentsWithStats(): Promise<DepartmentWithStats[]> {
    const supabase = await createClient()
    
    // Lấy danh sách phòng ban
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true })
    
    if (deptError) throw new Error(deptError.message)
    
    // Lấy số lượng nhân viên theo phòng ban
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('department_id')
    
    if (empError) throw new Error(empError.message)
    
    // Đếm số nhân viên mỗi phòng ban
    const countMap = new Map<number, number>()
    employees?.forEach(emp => {
      if (emp.department_id) {
        countMap.set(emp.department_id, (countMap.get(emp.department_id) || 0) + 1)
      }
    })
    
    return (departments || []).map(dept => ({
      ...dept,
      employee_count: countMap.get(dept.id) || 0
    }))
  },

  // Lấy thông tin một phòng ban theo ID
  async getDepartmentById(id: number): Promise<Department | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(error.message)
    }
    return data
  },

  // Tạo phòng ban mới
  async createDepartment(name: string): Promise<Department> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('departments')
      .insert({ name: name.trim() })
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Cập nhật phòng ban
  async updateDepartment(id: number, name: string): Promise<Department> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('departments')
      .update({ 
        name: name.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Xóa phòng ban
  async deleteDepartment(id: number): Promise<void> {
    const supabase = await createClient()
    
    // Kiểm tra xem phòng ban có nhân viên không
    const { count, error: countError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', id)
    
    if (countError) throw new Error(countError.message)
    
    if (count && count > 0) {
      throw new Error(`Không thể xóa phòng ban này vì còn ${count} nhân viên thuộc phòng ban`)
    }
    
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }
}
