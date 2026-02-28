import EmployeeProfileView from "@/components/employees/EmployeeProfileView";
import { employeeService } from "@/server/services/employee-service";
import { contractService } from "@/server/services/contract-service";
import { payrollService } from "@/server/services/payroll-service";
import { leaveService } from "@/server/services/leave-service";
import { assetService } from "@/server/services/asset-service";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

export const metadata = { title: "Chi tiết nhân viên | HCMUTE" };


export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeProfilePage({ params }: PageProps) {
  const { id } = await params;
  const empId = Number(id);
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Security Check: Only Admin/Manager OR the Owner can view this profile
  const isManager = user.role === "ADMIN" || user.role === "MANAGER";
  const isOwner = user.employeeId === empId;

  if (!isManager && !isOwner) {
    redirect("/forbidden");
  }

  const [employee, contracts, payrolls, leaves, assets] = await Promise.all([
    employeeService.getEmployee(empId),
    contractService.getContracts(empId),
    payrollService.getPayrollsByEmployeeId(empId),
    leaveService.getLeavesByEmployeeId(empId),
    assetService.getAssetsByEmployeeId(empId),
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <EmployeeProfileView
          employee={employee}
          contracts={contracts || []}
          payrolls={payrolls || []}
          leaves={leaves || []}
          assets={assets || []}
          isOwnProfile={isOwner}
          currentUserRole={user.role}
        />
      </div>
    </div>
  );
}
