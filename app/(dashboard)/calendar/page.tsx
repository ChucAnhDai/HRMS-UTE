import CalendarView from '@/components/attendance/CalendarView'
import { attendanceService } from '@/server/services/attendance-service'
import { employeeService } from '@/server/services/employee-service'

export default async function CalendarPage() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Lấy dữ liệu events và danh sách nhân viên để demo
  const [events, employees] = await Promise.all([
     attendanceService.getAttendanceEvents(currentMonth, currentYear),
     employeeService.getEmployeesList() // Tạm dùng cái này để lấy list ID và Name
  ])

  // Map lại employees list cho đúng format dropdown (có id và name)
  // Lưu ý: getEmployeesList trả về obj đã transform (id, FullName, ...)
  const employeeOptions = employees?.map((e: any) => ({
      id: e.id,
      first_name: e.first_name || '', 
      last_name: e.last_name || ''
  }))

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
       <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lịch làm việc & Chấm công</h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi thời gian check-in/check-out của nhân viên.</p>
          </div>

          <CalendarView 
             events={events || []} 
             employees={employeeOptions || []}
          />
       </div>
    </div>
  )
}
