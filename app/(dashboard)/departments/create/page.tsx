import { requireRoleForPage } from '@/lib/auth-helpers'
import DepartmentForm from '@/components/departments/DepartmentForm'

export const dynamic = 'force-dynamic'

export default async function CreateDepartmentPage() {
  // Chỉ Admin mới được tạo phòng ban
  await requireRoleForPage(['ADMIN'])

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <DepartmentForm mode="create" />
      </div>
    </div>
  )
}
