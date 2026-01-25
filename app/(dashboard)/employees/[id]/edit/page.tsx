import EditEmployeeForm from '@/components/employees/EditEmployeeForm'
import { employeeService } from '@/server/services/employee-service'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditEmployeePage({ params }: PageProps) {
  const { id } = await params
  
  // Fetch dữ liệu song song
  const [departments, employee] = await Promise.all([
      employeeService.getDepartments(),
      employeeService.getEmployee(Number(id))
  ])

  if (!employee) {
      notFound()
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-4xl mx-auto">
          <EditEmployeeForm departments={departments || []} employee={employee} />
       </div>
    </div>
  )
}
