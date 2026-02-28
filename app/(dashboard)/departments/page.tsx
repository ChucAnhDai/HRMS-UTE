import { departmentService } from "@/server/services/department-service";
import { requireRoleForPage } from "@/lib/auth-helpers";
import DepartmentTableView from "@/components/departments/DepartmentTableView";

export const metadata = { title: "Phòng ban | HCMUTE" };


export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const currentUser = await requireRoleForPage(["ADMIN", "MANAGER"]);
  const departments = await departmentService.getDepartmentsList();

  // Chỉ Admin mới có quyền quản lý (thêm/sửa/xóa)
  const canManage = currentUser?.role === "ADMIN";

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <DepartmentTableView departments={departments} canManage={canManage} />
      </div>
    </div>
  );
}
