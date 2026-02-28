import { getCurrentUser } from "@/lib/auth-helpers";
import { Employee } from "@/types";
import { overtimeRepo } from "@/server/repositories/overtime-repo";
import { employeeRepo } from "@/server/repositories/employee-repo";
import { settingRepo } from "@/server/repositories/setting-repo";
import OvertimeClientView from "@/components/overtime/OvertimeClientView";

export const metadata = { title: "Tăng ca | HCMUTE" };


export default async function OvertimePage() {
  const user = await getCurrentUser();
  if (!user)
    return (
      <div className="p-8 text-center text-red-500">Bạn chưa đăng nhập</div>
    );

  const isAdmin = ["ADMIN", "MANAGER"].includes(user.role);
  const filters = isAdmin
    ? undefined
    : { employee_id: Number(user.employeeId) };

  // Fetch requests
  const requests = await overtimeRepo.getRequests(filters);

  // Fetch employees for Admin selector
  let employees: Employee[] = [];
  if (isAdmin) {
    employees = await employeeRepo.getEmployees();
  }

  // Lấy giờ tan làm từ cấu hình hệ thống (dùng làm giờ bắt đầu OT mặc định)
  const settings = await settingRepo.getSettings();
  const workEndTime = settings["work_end_time"] || "17:00";

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <OvertimeClientView
        initialRequests={requests || []}
        isAdmin={isAdmin}
        employees={employees}
        workEndTime={workEndTime}
      />
    </div>
  );
}
