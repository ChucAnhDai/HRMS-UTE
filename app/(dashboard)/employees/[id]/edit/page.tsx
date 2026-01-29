import EditEmployeeForm from "@/components/employees/EditEmployeeForm";
import EmployeeDetailSidebar from "@/components/employees/EmployeeDetailSidebar";
import { employeeService } from "@/server/services/employee-service";
import { contractRepo } from "@/server/repositories/contract-repo";
import { assetRepo } from "@/server/repositories/asset-repo";
import { salaryHistoryRepo } from "@/server/repositories/salary-history-repo";
import { notFound } from "next/navigation";
import { requireRoleForPage } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({ params }: PageProps) {
  await requireRoleForPage(["ADMIN", "MANAGER"]);
  const { id } = await params;
  const employeeId = Number(id);

  if (isNaN(employeeId)) {
    notFound();
  }

  // Fetch dữ liệu song song
  const [
    departments,
    employee,
    contracts,
    assets,
    availableAssets,
    salaryHistory,
  ] = await Promise.all([
    employeeService.getDepartments(),
    employeeService.getEmployee(employeeId),
    contractRepo.getContractsByEmployeeId(employeeId).catch(() => []),
    assetRepo.getAssetsByEmployeeId(employeeId).catch(() => []),
    assetRepo
      .getAssets()
      .then(
        (all) =>
          all?.filter(
            (a) => a.status === "Sẵn sàng" || a.status === "Available",
          ) || [],
      )
      .catch(() => []),
    salaryHistoryRepo.getSalaryHistoryByEmployee(employeeId).catch(() => []),
  ]);

  if (!employee) {
    notFound();
  }

  const employeeName = `${employee.last_name} ${employee.first_name}`;

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Main Edit Form */}
        <EditEmployeeForm departments={departments || []} employee={employee} />

        {/* Hợp đồng, Tài sản, Lịch sử lương - nằm dưới form chính */}
        <EmployeeDetailSidebar
          employeeId={employeeId}
          employeeName={employeeName}
          contracts={contracts || []}
          assets={assets || []}
          salaryHistory={salaryHistory || []}
          availableAssets={availableAssets || []}
        />
      </div>
    </div>
  );
}
