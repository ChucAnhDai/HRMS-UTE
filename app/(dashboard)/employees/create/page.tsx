import CreateEmployeeForm from '@/components/employees/CreateEmployeeForm'
import { employeeService } from '@/server/services/employee-service'
import { requireRoleForPage } from '@/lib/auth-helpers'

export const metadata = { title: "Thêm nhân viên | HCMUTE" };


export const dynamic = 'force-dynamic'

export default async function CreateEmployeePage() {
  // Kiểm tra quyền: Chỉ Admin và Manager mới được tạo nhân viên
  await requireRoleForPage(['ADMIN', 'MANAGER'])
  
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
