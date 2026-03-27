import { dashboardService } from '@/server/services/dashboard-service'
import DashboardView from '@/components/dashboard/DashboardView'
import { requireRoleForPage } from '@/lib/auth-helpers'

export const metadata = { title: "Tổng quan | HCMUTE" };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireRoleForPage(['ADMIN', 'MANAGER']);
  const currentUserData = user.employeeData as { first_name: string; last_name: string } | undefined;
  const userName = currentUserData 
    ? `${currentUserData.last_name} ${currentUserData.first_name}` 
    : user.email.split('@')[0];

  let stats;
  try {
    stats = await dashboardService.getStats()
  } catch (error) {
    console.error("Dashboard Service Error:", error)
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
         <div className="max-w-7xl mx-auto flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-red-100">
            <h2 className="text-xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-600">Không thể tải dữ liệu thống kê bảng điều khiển. Vui lòng thử lại sau.</p>
         </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
       <div className="max-w-7xl mx-auto">
          <DashboardView stats={stats} userName={userName} />
       </div>
    </div>
  )
}
