import { createClient } from '@/lib/supabase.server'
import { payrollRepo } from '../repositories/payroll-repo'
import { requireAuth } from '@/lib/auth-helpers'

export const dashboardService = {
  async getStats() {
    await requireAuth()
    const supabase = await createClient()

    // 1. Tổng số nhân viên
    const { count: totalEmployees } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .in('employment_status', ['Active', 'Probation'])

    // 2. Số người đã Check-in hôm nay
    const nowInVN = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const year = nowInVN.getFullYear();
    const month = String(nowInVN.getMonth() + 1).padStart(2, '0');
    const day = String(nowInVN.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
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
    const { data: newEmployeesData } = await supabase
      .from('employees')
      .select('id, first_name, last_name, avatar, department_id, hire_date, departments(name)')
      .order('hire_date', { ascending: false })
      .limit(4)

    const newEmployees = (newEmployeesData || []).map((emp) => {
        const d = (emp as unknown as { departments: {name: string} | {name: string}[] }).departments
        let dept: { name: string } | null = null
        if (Array.isArray(d)) {
            dept = d[0] || null
        } else {
            dept = d as { name: string } | null
        }
        return {
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          avatar: emp.avatar,
          departments: dept
        }
    })

    // Department count (All available ones)
    const { count: departmentCount } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true })

    // 5. Thống kê nhân viên theo phòng ban (cho Pie Chart)
    const { data: employees } = await supabase
      .from('employees')
      .select('department_id, departments(name)')
      .in('employment_status', ['Active', 'Probation'])
    
    // Group by department
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deptStatsVal = (employees || []).reduce((acc: Record<string, number>, curr: any) => {
        // Handle explicit type issue where departments might be array or object
        const dept = curr.departments
        let deptName = 'Unknown'
        
        if (Array.isArray(dept)) {
             deptName = dept[0]?.name || 'Unknown'
        } else if (typeof dept === 'object' && dept !== null) {
             deptName = (dept as { name?: string }).name || 'Unknown'
        }
        
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
    }, {} as Record<string, number>)

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

    // 8. Hoạt động gần đây
    interface ActivityLog {
      id: number;
      action: string;
      entity_type: string;
      details: string;
      created_at: string;
      employees: { first_name: string; last_name: string; avatar: string | null } | null;
    }
    let recentActivitiesData: ActivityLog[] = [];
    try {
      const { data, error: actError } = await supabase
        .from('activity_logs')
        .select('*, employees(first_name, last_name, avatar)')
        .order('created_at', { ascending: false })
        .limit(4);
      if (!actError && data) {
         recentActivitiesData = data;
      }
    } catch {
      // Bỏ qua lỗi nếu bảng activity_logs chưa tồn tại
    }

    // 7. Thống kê lương theo tháng (Real-time)
    const currentYear = new Date().getFullYear()
    const yearlyPayslips = await payrollRepo.getYearlyStats(currentYear)
    
    const salaryData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i + 1
        return {
            name: new Date(0, i).toLocaleString('en-US', { month: 'short' }),
            received: yearlyPayslips
                ?.filter(p => p.month === monthIndex && p.status === 'Paid')
                .reduce((sum, p) => sum + (p.net_pay || 0), 0) || 0,
            pending: yearlyPayslips
                ?.filter(p => p.month === monthIndex && p.status !== 'Paid')
                .reduce((sum, p) => sum + (p.net_pay || 0), 0) || 0,
        }
    })

    return {
      totalEmployees: totalEmployees || 0,
      attendanceCount: checkInCount || 0,
      pendingLeaves: pendingLeaves || 0,
      newEmployees: newEmployees || [],
      departmentStats,
      upcomingLeaves: upcomingLeaves || [],
      recentActivities: recentActivitiesData || [],
      salaryData,
      departmentCount: departmentCount || 0
    }
  }
}
