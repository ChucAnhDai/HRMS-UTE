import EmployeeProfileView from '@/components/employees/EmployeeProfileView'
import { employeeService } from '@/server/services/employee-service'
import { contractService } from '@/server/services/contract-service'
import { payrollService } from '@/server/services/payroll-service'
import { leaveService } from '@/server/services/leave-service'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EmployeeProfilePage({ params }: PageProps) {
  const { id } = await params
  const empId = Number(id)

  const [employee, contracts, payrolls, leaves] = await Promise.all([
      employeeService.getEmployee(empId),
      contractService.getContracts(empId),
      payrollService.getPayrollsByEmployeeId(empId),
      leaveService.getLeavesByEmployeeId(empId)
  ])

  if (!employee) {
      notFound()
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-7xl mx-auto">
          <EmployeeProfileView 
              employee={employee} 
              contracts={contracts || []}
              payrolls={payrolls || []}
              leaves={leaves || []}
          />
       </div>
    </div>
  )
}
