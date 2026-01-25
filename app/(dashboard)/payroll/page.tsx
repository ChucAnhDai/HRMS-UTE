import { payrollService } from '@/server/services/payroll-service'
import PayrollHeader from '@/components/payroll/PayrollHeader'
import PayrollTable from '@/components/payroll/PayrollTable'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function PayrollPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentDate = new Date()
  const month = params.month ? parseInt(params.month) : currentDate.getMonth() + 1
  const year = params.year ? parseInt(params.year) : currentDate.getFullYear()

  const payrolls = await payrollService.getPayrollByMonth(month, year)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PayrollHeader month={month} year={year} />
        <PayrollTable payrolls={payrolls || []} />
      </div>
    </div>
  )
}
