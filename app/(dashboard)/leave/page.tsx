import { leaveRepo } from "@/server/repositories/leave-repo";
import { employeeRepo } from "@/server/repositories/employee-repo";
import LeaveTableView from "@/components/leave/LeaveTableView";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";

export const dynamic = 'force-dynamic'

export default async function LeavePage() {
    const [leaves, employees] = await Promise.all([
        leaveRepo.getLeaveRequests(),
        employeeRepo.getEmployees()
    ])

    return (
        <div className="p- md:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
            <div className="max-w-7xl mx-auto">
                <LeaveTableView leaves={leaves} />
            </div>
            
            {/* Modal Form */}
            <LeaveRequestForm employees={employees} />
        </div>
    )
}
