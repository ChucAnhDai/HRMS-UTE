import { employeeService } from '@/server/services/employee-service'
import EmployeeTableView from '@/components/employees/EmployeeTableView'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
  const employees = await employeeService.getEmployeesList()

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-7xl mx-auto">
          <EmployeeTableView employees={employees} />
       </div>
    </div>
  )
}