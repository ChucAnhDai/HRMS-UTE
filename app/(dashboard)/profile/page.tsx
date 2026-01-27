import { getCurrentUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { employeeService } from '@/server/services/employee-service'
import { contractService } from '@/server/services/contract-service'
import { payrollService } from '@/server/services/payroll-service'
import { leaveService } from '@/server/services/leave-service'
import { assetService } from '@/server/services/asset-service'
import EmployeeProfileView from '@/components/employees/EmployeeProfileView'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || !currentUser.employeeId) {
    redirect('/login')
  }

  const empId = currentUser.employeeId

  const [employee, contracts, payrolls, leaves, assets] = await Promise.all([
    employeeService.getEmployee(empId),
    contractService.getContracts(empId),
    payrollService.getPayrollsByEmployeeId(empId),
    leaveService.getLeavesByEmployeeId(empId),
    assetService.getAssetsByEmployeeId(empId)
  ])

  if (!employee) {
    redirect('/login')
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-sm text-gray-500 mt-1">Xem thông tin và lịch sử làm việc của bạn</p>
          </div>
          <Link 
            href="/profile/change-password"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Đổi mật khẩu
          </Link>
        </div>
        
        <EmployeeProfileView 
          employee={employee} 
          contracts={contracts || []}
          payrolls={payrolls || []}
          leaves={leaves || []}
          assets={assets || []}
          isOwnProfile={true}
          currentUserRole={currentUser.role}
        />
      </div>
    </div>
  )
}
