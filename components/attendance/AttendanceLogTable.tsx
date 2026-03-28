"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Calendar as CalendarIcon,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Pencil,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import {
  adminUpdateAttendanceAction,
  adminCreateAttendanceAction,
  adminDeleteAttendanceAction,
} from "@/server/actions/attendance-actions";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

// ---- Interfaces ----
interface AttendanceLog {
  id: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  employeeName: string;
  avatar: string | null;
}

interface SimpleEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  department_id?: number | null;
}

interface SimpleDepartment {
  id: number;
  name: string;
}

interface Props {
  logs: AttendanceLog[];
  currentDate: string;
  userRole?: string;
  employees?: SimpleEmployee[];
  departments?: SimpleDepartment[];
}

// ---- Main Component ----
export default function AttendanceLogTable({
  logs,
  currentDate,
  userRole,
  employees = [],
  departments = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Edit modal state
  const [editingLog, setEditingLog] = useState<AttendanceLog | null>(null);
  const [editMessage, setEditMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMessage, setCreateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Create modal filter state
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<AttendanceLog | null>(null);

  const isAdmin = userRole === "ADMIN" || userRole === "MANAGER";

  // Filter employees by selected department
  const filteredEmployees = selectedDeptId
    ? employees.filter((e) => e.department_id === Number(selectedDeptId))
    : employees;

  // Selected employee for email display
  const selectedEmployee = employees.find(
    (e) => e.id === Number(selectedEmpId),
  );

  // ---- Handlers ----
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    startTransition(() => {
      router.push(`/calendar?date=${newDate}`);
    });
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    const today = new Date().toISOString().split("T")[0];
    router.push(`/calendar?date=${today}`);
  };

  async function handleEditSubmit(formData: FormData) {
    const result = await adminUpdateAttendanceAction(formData);
    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Đã cập nhật chấm công",
      });
      setEditMessage({ type: "success", text: result.message });
      setTimeout(() => {
        setEditingLog(null);
        setEditMessage(null);
        router.refresh();
      }, 1500);
    } else {
      toast({
        title: "Lỗi",
        description: result.message || "Không thể cập nhật chấm công",
        variant: "destructive",
      });
      setEditMessage({ type: "error", text: result.message });
    }
  }

  async function handleCreateSubmit(formData: FormData) {
    const result = await adminCreateAttendanceAction(formData);
    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Đã tạo bản ghi chấm công",
      });
      setCreateMessage({ type: "success", text: result.message });
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateMessage(null);
        router.refresh();
      }, 1500);
    } else {
      toast({
        title: "Lỗi",
        description: result.message || "Không thể tạo chấm công",
        variant: "destructive",
      });
      setCreateMessage({ type: "error", text: result.message });
    }
  }

  // ---- Filter ----
  const filteredLogs = logs.filter((log) =>
    log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ---- Status Badge ----
  const getStatusBadge = (status: string, checkOut: string | null) => {
    if (status === "Late") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
          <AlertCircle className="w-3 h-3" /> Đi muộn
        </span>
      );
    }
    if (!checkOut) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1">
          <Clock className="w-3 h-3" /> Đang làm việc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
        <CheckCircle className="w-3 h-3" /> Đúng giờ
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Quản lý Chấm công
            </h3>
            {isAdmin && (
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setCreateMessage(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Chấm công thủ công
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-auto">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Chọn ngày:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Tìm theo tên nhân viên:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Nhập tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button className="px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800">
                  Lọc
                </button>
                <button
                  onClick={handleClearFilter}
                  className="px-4 py-2 bg-gray-500 text-white text-sm font-bold rounded-lg hover:bg-gray-600"
                >
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-16 text-center">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Tên nhân viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Ngày
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Giờ Check In
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Giờ Check Out
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isPending ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có dữ liệu chấm công cho ngày này.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
                          {log.avatar ? (
                            <Image
                              src={log.avatar}
                              alt={log.employeeName}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <span className="font-bold text-gray-800 text-sm">
                          {log.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {log.check_in_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.check_out_time ? (
                        <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          {log.check_out_time?.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">--:--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(log.status, log.check_out_time)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditingLog(log);
                              setEditMessage(null);
                            }}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button
                            onClick={() => {
                              setLogToDelete(log);
                              setIsConfirmOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận xóa chấm công"
        description={`Bạn có chắc chắn muốn xóa bản ghi chấm công của nhân viên "${logToDelete?.employeeName}" ngày ${logToDelete ? new Date(logToDelete.date).toLocaleDateString("vi-VN") : ""}?`}
        onConfirm={async () => {
          if (!logToDelete) return;
          const result = await adminDeleteAttendanceAction(logToDelete.id);
          if (result.success) {
            toast({
              title: "Thành công",
              description: result.message || "Đã xóa bản ghi chấm công",
            });
            router.refresh();
          } else {
            toast({
              title: "Lỗi",
              description: result.message || "Không thể xóa chấm công",
              variant: "destructive",
            });
          }
          setLogToDelete(null);
        }}
        variant="danger"
        confirmText="Xác nhận xóa"
      />

      {/* ===== EDIT MODAL ===== */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" /> Sửa chấm công
              </h3>
              <button
                onClick={() => setEditingLog(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleEditSubmit} className="p-5 space-y-4">
              <input type="hidden" name="id" value={editingLog.id} />

              {/* Info display */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-600">
                  <strong>Nhân viên:</strong> {editingLog.employeeName}
                </p>
                <p className="text-gray-600">
                  <strong>Ngày:</strong>{" "}
                  {new Date(editingLog.date).toLocaleDateString("vi-VN")}
                </p>
              </div>

              {/* Message */}
              {editMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    editMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {editMessage.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Giờ Check-in
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    defaultValue={editingLog.check_in_time?.slice(0, 5) || ""}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Giờ Check-out
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    defaultValue={editingLog.check_out_time?.slice(0, 5) || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  defaultValue={editingLog.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Present">Đúng giờ (Present)</option>
                  <option value="Late">Đi muộn (Late)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CREATE MODAL ===== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Chấm công thủ công
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleCreateSubmit} className="p-5 space-y-4">
              {/* Message */}
              {createMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    createMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {createMessage.text}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Lọc theo phòng ban
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => {
                    setSelectedDeptId(e.target.value);
                    setSelectedEmpId("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Tất cả phòng ban --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Nhân viên <span className="text-red-500">*</span>
                </label>
                <select
                  name="employee_id"
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {filteredEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.last_name} {emp.first_name} (#{emp.id})
                    </option>
                  ))}
                </select>
                {filteredEmployees.length === 0 && selectedDeptId && (
                  <p className="text-xs text-red-500 mt-1">
                    Không tìm thấy nhân viên nào trong phòng ban này.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Email nhân viên
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-600 truncate h-[38px] flex items-center">
                  {selectedEmployee?.email || "---"}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={currentDate}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Giờ Check-in <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Giờ Check-out
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  defaultValue="Present"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Present">Đúng giờ (Present)</option>
                  <option value="Late">Đi muộn (Late)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-sm"
                >
                  Tạo chấm công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
