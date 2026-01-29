import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { salaryAdvanceRepo } from "@/server/repositories/salary-advance-repo";
import { redirect } from "next/navigation";
import SalaryAdvanceTable from "@/components/salary-advance/SalaryAdvanceTable";
import SalaryAdvanceRequestModal from "@/components/salary-advance/SalaryAdvanceRequestModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Quản lý Tạm ứng lương | HRM",
  description: "Danh sách yêu cầu tạm ứng lương",
};

export default async function SalaryAdvancePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Filter logic
  const isManager = user.role === "ADMIN" || user.role === "MANAGER";
  const filters: {
    employeeId?: number;
    month?: number;
    year?: number;
    status?: string;
  } = {};

  if (!isManager) {
    if (!user.employeeId) {
      return (
        <div className="p-8 text-center">
          Bạn chưa có hồ sơ nhân viên để thực hiện chức năng này.
        </div>
      );
    }
    filters.employeeId = user.employeeId;
  }

  const advances = await salaryAdvanceRepo.getRequests(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Tạm ứng lương
          </h1>
          <p className="text-gray-700">
            {isManager
              ? "Quản lý và xét duyệt các yêu cầu tạm ứng lương của nhân viên."
              : "Gửi yêu cầu tạm ứng lương và theo dõi trạng thái."}
          </p>
        </div>
        {/* Only Employees or maybe Managers can request? Usually employees. */}
        {user.employeeId && <SalaryAdvanceRequestModal />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Danh sách yêu cầu</CardTitle>
          <CardDescription className="text-gray-700">
            Các khoản tạm ứng sẽ được tự động trừ vào bảng lương tháng tương
            ứng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
            <SalaryAdvanceTable advances={advances} currentUser={user} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
