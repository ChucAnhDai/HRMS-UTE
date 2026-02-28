import Link from 'next/link'
import PayrollHeader from '@/components/payroll/PayrollHeader'
import PayrollTable from '@/components/payroll/PayrollTable'
import { payrollService } from '@/server/services/payroll-service'
import { requireRoleForPage } from '@/lib/auth-helpers'

export const metadata = { title: "Lương thưởng | HCMUTE" };


export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PayrollPage({ searchParams }: Props) {
  // Check permission
  await requireRoleForPage(['ADMIN', 'MANAGER'])
  
  const { month, year } = await searchParams
  
  const currentMonth = Number(month) || new Date().getMonth() + 1
  const currentYear = Number(year) || new Date().getFullYear()

  // Fetch data
  const payslips = await payrollService.getPayrollList(currentMonth, currentYear)

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-7xl mx-auto">
          <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý Lương</h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
                  <p className="text-gray-500 text-sm">Tính toán và quản lý phiếu lương hàng tháng cho nhân viên.</p>
                  <Link href="/payroll/adjustments" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Quản lý Thưởng / Phạt &rarr;
                  </Link>
              </div>
          </div>

          <PayrollHeader />
          
          <PayrollTable payslips={payslips || []} />
       </div>
    </div>
  )
}
