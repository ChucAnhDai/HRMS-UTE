import CreateEmployeeForm from '@/components/employees/CreateEmployeeForm'
import { employeeService } from '@/server/services/employee-service'
import Link from 'next/link'

export default async function NewEmployeePage() {
  // 1. Fetch departments from DB to populate dropdown
  const departments = await employeeService.getDepartments()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
       <div className="max-w-3xl mx-auto">
          {/* Breadcrumb / Header */}
          <div className="mb-8">
            <Link href="/employees" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Thêm nhân viên mới</h1>
            <p className="text-gray-500 text-sm mt-1">Điền thông tin bên dưới để tạo hồ sơ nhân sự mới.</p>
          </div>

          {/* Form Component */}
          <CreateEmployeeForm departments={departments || []} />
       </div>
    </div>
  )
}
