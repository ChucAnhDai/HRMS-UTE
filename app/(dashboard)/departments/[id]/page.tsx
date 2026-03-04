import { departmentService } from "@/server/services/department-service";
import { requireRoleForPage } from "@/lib/auth-helpers";
import DepartmentDetailView from "@/components/departments/DepartmentDetailView";
import { notFound } from "next/navigation";

export const metadata = { title: "Chi tiết phòng ban | HCMUTE" };

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  // Check auth cơ bản
  await requireRoleForPage(["ADMIN", "MANAGER", "EMPLOYEE"]);

  const { id } = await params;
  const deptId = Number(id);

  if (isNaN(deptId)) {
    notFound();
  }

  const detail = await departmentService.getDepartmentDetail(deptId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <DepartmentDetailView
          department={detail.department}
          employees={detail.employees}
        />
      </div>
    </div>
  );
}
