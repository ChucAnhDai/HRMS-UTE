import { dashboardService } from '@/server/services/dashboard-service'
import DashboardView from '@/components/dashboard/DashboardView'

export default async function DashboardPage() {
  const stats = await dashboardService.getStats()

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-7xl mx-auto">
          <DashboardView stats={stats} />
       </div>
    </div>
  )
}
