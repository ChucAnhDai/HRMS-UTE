import { leaveRepo } from "@/server/repositories/leave-repo";
import { employeeRepo } from "@/server/repositories/employee-repo";
import LeaveTableView from "@/components/leave/LeaveTableView";
import { getCurrentUser } from "@/lib/auth-helpers";

import { Employee } from "@/types";

export const metadata = { title: "Nghỉ phép | HCMUTE" };


export const dynamic = "force-dynamic";

export default async function LeavePage() {
  const currentUser = await getCurrentUser();

  const [leavesData, rawEmployees, departments] = await Promise.all([
    leaveRepo.getLeaveRequests(),
    employeeRepo.getEmployees(),
    employeeRepo.getDepartments(),
  ]);

  // Ensure employees data matches expected type (handle array/object for departments if needed)

  const formattedEmployees = (rawEmployees || []).map((emp) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dept = (emp as any).departments;
    return {
      ...emp,
      departments: Array.isArray(dept) ? dept[0] : dept,
    };
  }) as unknown as Employee[];

  const leaves = (leavesData || []).map((l) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawL = l as any;
    return {
      id: rawL.id,
      employee_id: rawL.employee_id,
      leave_type: rawL.leave_type,
      start_date: rawL.start_date,
      end_date: rawL.end_date,
      reason: rawL.reason,
      status: rawL.status,
      rejection_reason: rawL.rejection_reason,
      employees: Array.isArray(rawL.employees)
        ? rawL.employees[0]
        : rawL.employees,
    };
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <LeaveTableView
          leaves={leaves}
          employees={formattedEmployees}
          departments={departments || []}
          currentUser={
            currentUser
              ? {
                  employeeId: currentUser.employeeId,
                  role: currentUser.role,
                  employeeData: currentUser.employeeData as unknown as Employee,
                }
              : null
          }
        />
      </div>
    </div>
  );
}
