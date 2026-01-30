import QuickAttendance from "@/components/attendance/QuickAttendance";
import AttendanceLogTable from "@/components/attendance/AttendanceLogTable";
import { attendanceService } from "@/server/services/attendance-service";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getTodayAttendanceStatus } from "@/server/actions/quick-attendance";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const currentUser = await getCurrentUser();
  const { date } = await searchParams;

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = date || today;

  // Lấy dữ liệu logs chấm công theo ngày chọn
  const logs = await attendanceService.getLogsByDate(selectedDate);

  // Lấy trạng thái chấm công của user hiện tại (để hiển thị quick action)
  const todayStatus = await getTodayAttendanceStatus();

  // Map lại logs cho khớp interface components (nếu cần xử lý thêm)
  const formattedLogs =
    logs?.map(
      (log: {
        id: number;
        date: string;
        check_in_time: string | null;
        check_out_time: string | null;
        status: string;
        employeeName: string;
        avatar: string | null;
      }) => ({
        id: log.id,
        date: log.date,
        check_in_time: log.check_in_time,
        check_out_time: log.check_out_time,
        status: log.status,
        employeeName: log.employeeName,
        avatar: log.avatar,
      }),
    ) || [];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Lịch làm việc & Chấm công
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentUser?.role === "EMPLOYEE"
              ? "Theo dõi lịch sử chấm công của bạn."
              : "Quản lý thời gian check-in/check-out của nhân viên."}
          </p>
        </div>

        {/* Quick Attendance - Card chấm công nhanh */}
        <div className="mb-6">
          <QuickAttendance initialStatus={todayStatus} />
        </div>

        {/* Table View - Danh sách chấm công trong ngày */}
        <AttendanceLogTable logs={formattedLogs} currentDate={selectedDate} />
      </div>
    </div>
  );
}
