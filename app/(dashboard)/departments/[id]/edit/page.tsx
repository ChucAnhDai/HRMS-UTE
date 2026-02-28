import { requireRoleForPage } from '@/lib/auth-helpers'
import { departmentService } from '@/server/services/department-service'
import { notFound } from 'next/navigation'
import DepartmentForm from '@/components/departments/DepartmentForm'

export const metadata = { title: "Sửa phòng ban | HCMUTE" };


export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDepartmentPage({ params }: Props) {
  // Chỉ Admin mới được sửa phòng ban
  await requireRoleForPage(['ADMIN'])
  
  const { id } = await params
  const departmentId = parseInt(id, 10)
  
  if (isNaN(departmentId)) {
    notFound()
  }
  
  const department = await departmentService.getDepartment(departmentId)
  
  if (!department) {
    notFound()
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <DepartmentForm 
          mode="edit" 
          department={{
            id: department.id,
            name: department.name
          }} 
        />
      </div>
    </div>
  )
}
