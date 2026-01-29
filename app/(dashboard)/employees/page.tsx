import { employeeService } from "@/server/services/employee-service";
import EmployeeTableView from "@/components/employees/EmployeeTableView";
import { getCurrentUser, requireRoleForPage } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  // Catch-22: If we redirect ADMIN/MANAGER only, we block access.
  // The requirement is: Hide "Add" button and "Actions" for Employee.
  // User check is strict: "vào xem lộ hết thông tin à?".
  // This implies EMPLOYEES SHOULD NOT SEE THE LIST AT ALL.

  // So:
  await requireRoleForPage(["ADMIN", "MANAGER"]);

  const [employees, user] = await Promise.all([
    employeeService.getEmployeesList(),
    getCurrentUser(),
  ]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <EmployeeTableView employees={employees} currentUser={user} />
      </div>
    </div>
  );
}
