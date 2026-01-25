import { createClient } from '@/lib/supabase.server'

export const dashboardService = {
  async getStats() {
    const supabase = await createClient()

    // 1. Tổng số nhân viên
    const { count: totalEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })

    // 2. Số người đã Check-in hôm nay
    const today = new Date().toISOString().split('T')[0]
    const { count: checkInCount } = await supabase
      .from('attendances')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)

    // 3. Số đơn xin nghỉ đang chờ duyệt (Pending)
    const { count: pendingLeaves } = await supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    // 4. Lấy 5 nhân viên mới nhất
    const { data: newEmployees } = await supabase
      .from('employees')
      .select('id, first_name, last_name, avatar, department_id, hire_date, departments(name)')
      .order('hire_date', { ascending: false })
      .limit(4)

    // 5. Thống kê nhân viên theo phòng ban (cho Pie Chart)
    const { data: employees } = await supabase
      .from('employees')
      .select('department_id, departments(name)')
    
    // Group by department
    const deptStatsVal = employees?.reduce((acc: any, curr) => {
        const deptName = curr.departments?.name || 'Unknown'
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
    }, {})

    const departmentStats = Object.keys(deptStatsVal || {}).map((key, index) => ({
        name: key,
        value: deptStatsVal[key],
        color: ['#a855f7', '#ef4444', '#eab308', '#14b8a6', '#3b82f6'][index % 5]
    }))

    // 6. Nghỉ phép sắp tới (Upcoming Leads)
    const { data: upcomingLeaves } = await supabase
      .from('leave_requests')
      .select('*, employees(first_name, last_name, avatar)')
      .eq('status', 'Approved')
      .gte('start_date', today)
      .limit(5)
      .order('start_date', { ascending: true })

    return {
      totalEmployees: totalEmployees || 0,
      attendanceCount: checkInCount || 0,
      pendingLeaves: pendingLeaves || 0,
      newEmployees: newEmployees || [],
      departmentStats,
      upcomingLeaves: upcomingLeaves || []
    }
  }
}
