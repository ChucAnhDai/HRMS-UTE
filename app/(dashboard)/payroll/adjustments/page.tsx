import { requireRole } from '@/lib/auth-helpers'
import { employeeRepo } from '@/server/repositories/employee-repo'
import RewardAdjustmentView from '@/components/rewards/RewardAdjustmentView'

export const metadata = {
  title: 'Rewards & Penalties - Payroll System',
}

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function RewardsPage({ searchParams }: PageProps) {
  await requireRole(['ADMIN', 'MANAGER'])

  const params = await searchParams
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1
  const year = params.year ? parseInt(params.year) : new Date().getFullYear()

  const employees = await employeeRepo.getEmployees() || []

  return (
      <div className="p-6">
        <RewardAdjustmentView employees={employees} month={month} year={year} />
      </div>
  )
}
