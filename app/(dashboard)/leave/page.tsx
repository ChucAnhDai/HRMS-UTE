import { leaveRepo } from "@/server/repositories/leave-repo";
import { employeeRepo } from "@/server/repositories/employee-repo";
import LeaveTableView from "@/components/leave/LeaveTableView";
import { getCurrentUser } from "@/lib/auth-helpers";

export const dynamic = 'force-dynamic'

export default async function LeavePage() {
    const currentUser = await getCurrentUser()
    
    const [leaves, employees] = await Promise.all([
        leaveRepo.getLeaveRequests(),
        employeeRepo.getEmployees()
    ])

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
            <div className="max-w-7xl mx-auto">
                <LeaveTableView 
                    leaves={leaves} 
                    employees={employees}
                    currentUser={currentUser ? {
                        employeeId: currentUser.employeeId,
                        role: currentUser.role,
                        employeeData: currentUser.employeeData
                    } : null}
                />
            </div>
        </div>
    )
}
