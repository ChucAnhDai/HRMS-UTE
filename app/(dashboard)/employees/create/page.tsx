import CreateEmployeeForm from '@/components/employees/CreateEmployeeForm'
import { employeeService } from '@/server/services/employee-service'

export const dynamic = 'force-dynamic'

export default async function CreateEmployeePage() {
  // Lấy danh sách phòng ban để chọn khi tạo nhân viên
  const departments = await employeeService.getDepartments()

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-4xl mx-auto">
          <CreateEmployeeForm departments={departments || []} />
       </div>
    </div>
  )
}
