"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Loader2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  approveLeaveAction,
  rejectLeaveAction,
  updateLeaveRequestAction,
} from "@/server/actions/leave-actions";
import { useRouter } from "next/navigation";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";
import { Employee, LeaveRequest, Department } from "@/types";
import { TruncatedTextWithView } from "@/components/ui/ContentViewerModal";
import { toast } from "@/hooks/use-toast";

interface Props {
  leaves: LeaveRequest[];
  employees?: Employee[];
  departments?: Department[];
  currentUser?: {
    employeeId: number | null;
    role: string;
    employeeData?: Employee;
  } | null;
}

export default function LeaveTableView({
  leaves,
  employees = [],
  departments = [],
  currentUser = null,
}: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State cho modal duyệt
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvingLeaveId, setApprovingLeaveId] = useState<number | null>(null);

  // State cho modal từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  // State cho cảnh báo quá hạn
  const [expiredWarningOpen, setExpiredWarningOpen] = useState(false);
  const [expiredWarningMessage, setExpiredWarningMessage] = useState("");
  const [expiredWarningLeaveId, setExpiredWarningLeaveId] = useState<number | null>(
    null
  );

  // State cho modal chỉnh sửa
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Logic lọc dữ liệu (Search & Status Filter)
  const filteredLeaves = React.useMemo(() => {
    let result = leaves;

    // 1. Lọc theo trạng thái
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    // 2. Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase().trim();
      result = result.filter((l) => {
        const employeeName = `${l.employees?.last_name || ""} ${l.employees?.first_name || ""}`.toLowerCase();
        const leaveType = (l.leave_type || "").toLowerCase();
        const reason = (l.reason || "").toLowerCase();
        return (
          employeeName.includes(keyword) ||
          leaveType.includes(keyword) ||
          reason.includes(keyword)
        );
      });
    }

    return result;
  }, [leaves, searchTerm, statusFilter]);

  // Kiểm tra quyền duyệt đơn - Chỉ ADMIN, MANAGER mới được duyệt/từ chối
  const canApprove =
    currentUser?.role && ["ADMIN", "MANAGER"].includes(currentUser.role);

  // Mở modal duyệt
  const openApproveModal = (id: number) => {
    if (!canApprove) {
      toast({
        title: "Cảnh báo",
        description: "Bạn không có quyền duyệt đơn nghỉ phép!",
        variant: "destructive",
      });
      return;
    }
    setApprovingLeaveId(id);
    setApproveModalOpen(true);
  };

  const handleApprove = async () => {
    if (!approvingLeaveId) return;

    setLoadingId(approvingLeaveId);
    const result = await approveLeaveAction(approvingLeaveId);
    setLoadingId(null);

    // Nếu server trả về cảnh báo quá hạn (warning: true)
    if (result && "warning" in result && result.warning) {
      setApproveModalOpen(false);
      setExpiredWarningMessage(result.message || "Đơn nghỉ phép này đã quá hạn.");
      setExpiredWarningLeaveId(approvingLeaveId);
      setApprovingLeaveId(null);
      setExpiredWarningOpen(true);
      return;
    }

    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Đã duyệt đơn nghỉ phép",
      });
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể duyệt đơn",
        variant: "destructive",
      });
    }

    setApproveModalOpen(false);
    setApprovingLeaveId(null);
    router.refresh();
  };

  // Xử lý duyệt đơn kể cả khi quá hạn
  const handleForceApprove = async () => {
    if (!expiredWarningLeaveId) return;

    setLoadingId(expiredWarningLeaveId);
    const result = await approveLeaveAction(expiredWarningLeaveId, true); // forceApprove = true
    setLoadingId(null);

    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Đã duyệt đơn nghỉ phép thành công",
      });
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể duyệt đơn",
        variant: "destructive",
      });
    }

    setExpiredWarningOpen(false);
    setExpiredWarningLeaveId(null);
    setExpiredWarningMessage("");
    router.refresh();
  };

  // Mở modal từ chối
  const openRejectModal = (id: number) => {
    if (!canApprove) {
      toast({
        title: "Cảnh báo",
        description: "Bạn không có quyền từ chối đơn nghỉ phép!",
        variant: "destructive",
      });
      return;
    }
    setRejectingLeaveId(id);
    setRejectionReason("");
    setRejectError("");
    setRejectModalOpen(true);
  };

  // Xử lý từ chối đơn
  const handleReject = async () => {
    if (!rejectingLeaveId) return;

    if (!rejectionReason.trim()) {
      setRejectError("Vui lòng nhập lý do từ chối");
      return;
    }

    setLoadingId(rejectingLeaveId);
    const result = await rejectLeaveAction(rejectingLeaveId, rejectionReason);
    setLoadingId(null);

    if (result.error) {
      setRejectError(result.error);
      return;
    }

    // Đóng modal và refresh
    toast({
      title: "Thành công",
      description: result.message || "Đã từ chối đơn nghỉ phép",
    });

    setRejectModalOpen(false);
    setRejectingLeaveId(null);
    setRejectionReason("");
    router.refresh();
  };

  // Xử lý cập nhật đơn
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLeave) return;

    setEditLoading(true);
    setEditError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateLeaveRequestAction(
      { success: false, message: "" },
      formData
    );

    setEditLoading(false);

    if (result.error) {
      setEditError(result.error);
      return;
    }

    // Thành công
    toast({
      title: "Thành công",
      description: result.message || "Đã cập nhật đơn nghỉ phép",
    });

    setEditModalOpen(false);
    setEditingLeave(null);
    router.refresh();
  };

  // Tính số ngày nghỉ
  const calculateDays = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} ngày`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-blue-600">Nghỉ phép</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Quản lý nghỉ phép</h3>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm">
            Danh sách đơn
          </button>
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-gray-600 border border-gateway-100 hover:bg-gray-50 flex items-center gap-2">
            Báo cáo nghỉ phép
          </button> */}
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("leave-form-modal");
            el?.classList.remove("hidden");
            el?.classList.add("flex");
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Tạo đơn nghỉ
        </button>
      </div>

      {/* Leave Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold text-gray-800">Danh sách đơn từ</h4>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
              {filteredLeaves.length}/{leaves.length} đơn
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên, loại nghỉ, lý do..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-64"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer text-gray-600"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Pending">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Từ chối</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Nhân viên
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Loại nghỉ
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Từ ngày
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Đến ngày
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                  Số ngày
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Lý do
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave: LeaveRequest) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={
                              leave.employees?.avatar ||
                              `https://ui-avatars.com/api/?name=${leave.employees?.first_name || "U"}+${leave.employees?.last_name || "N"}&background=random`
                            }
                            alt="avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {leave.employees?.last_name || ""}{" "}
                          {leave.employees?.first_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {leave.leave_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(leave.start_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(leave.end_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-bold text-center">
                      {calculateDays(leave.start_date, leave.end_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px]">
                      <TruncatedTextWithView
                        text={leave.reason || ""}
                        modalTitle="Lý do nghỉ phép"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700",
                          )}
                        >
                          {leave.status === "Approved"
                            ? "Đã duyệt"
                            : leave.status === "Pending"
                              ? "Chờ duyệt"
                              : "Từ chối"}
                        </span>
                        {/* Hiển thị lý do từ chối nếu có */}
                        {leave.status === "Rejected" &&
                          leave.rejection_reason && (
                            <div className="text-xs text-red-600 max-w-[160px]">
                              <TruncatedTextWithView
                                text={leave.rejection_reason}
                                maxLength={20}
                                modalTitle="Lý do từ chối"
                              />
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút sửa - Hiển thị khi đơn Pending và thuộc về chính nhân viên đó */}
                        {leave.status === "Pending" &&
                          leave.employee_id === currentUser?.employeeId && (
                            <button
                              onClick={() => {
                                setEditingLeave(leave);
                                setEditError("");
                                setEditModalOpen(true);
                              }}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                              title="Chỉnh sửa đơn"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                        {/* Chỉ ADMIN, MANAGER mới thấy nút duyệt/từ chối */}
                        {canApprove && leave.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => openApproveModal(leave.id)}
                              disabled={loadingId === leave.id}
                              className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50"
                              title="Duyệt"
                            >
                              {loadingId === leave.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openRejectModal(leave.id)}
                              disabled={loadingId === leave.id}
                              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                              title="Từ chối"
                            >
                              {loadingId === leave.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        ) : (
                          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tạo đơn nghỉ */}
      <LeaveRequestForm
        employees={employees}
        departments={departments}
        currentUser={currentUser}
      />

      {/* Modal Chỉnh sửa đơn nghỉ */}
      {editModalOpen && editingLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg m-4 overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 bg-blue-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Edit className="w-5 h-5 text-blue-600" />
                Chỉnh sửa đơn nghỉ phép
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật thông tin cho đơn nghỉ của bạn (Chỉ đơn chờ duyệt)
              </p>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              <input type="hidden" name="leave_id" value={editingLeave.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Loại nghỉ
                  </label>
                  <select
                    name="leave_type"
                    defaultValue={editingLeave.leave_type}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  >
                    <option value="Annual Leave">Nghỉ phép năm</option>
                    <option value="Sick Leave">Nghỉ ốm</option>
                    <option value="Unpaid Leave">Nghỉ không lương</option>
                    <option value="Maternity Leave">Nghỉ thai sản</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={editingLeave.start_date}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={editingLeave.end_date}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Lý do nghỉ
                </label>
                <textarea
                  name="reason"
                  defaultValue={editingLeave.reason || ""}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingLeave(null);
                  }}
                  className="px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                >
                  {editLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editLoading ? "Đang lưu..." : "Cập nhật đơn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận duyệt đơn nghỉ phép */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-green-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-green-600" />
                Xác nhận duyệt đơn nghỉ phép
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Bạn có chắc chắn muốn duyệt đơn nghỉ phép này không?
              </p>
            </div>

            <div className="p-6 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={() => {
                  setApproveModalOpen(false);
                  setApprovingLeaveId(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={loadingId !== null}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {loadingId !== null ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal từ chối đơn nghỉ phép */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-red-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <X className="w-5 h-5 text-red-600" />
                Từ chối đơn nghỉ phép
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Vui lòng nhập lý do từ chối để nhân viên biết
              </p>
            </div>

            <div className="p-6">
              {rejectError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {rejectError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="VD: Không đủ điều kiện nghỉ phép, cần làm việc trong thời gian này..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectingLeaveId(null);
                    setRejectionReason("");
                    setRejectError("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={loadingId !== null}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {loadingId !== null ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Từ chối đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal cảnh báo đơn nghỉ phép đã quá hạn */}
      {expiredWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-amber-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                ⚠️ Cảnh báo: Đơn nghỉ phép đã quá hạn
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {expiredWarningMessage}
              </p>
            </div>

            <div className="p-6 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={() => {
                  setExpiredWarningOpen(false);
                  setExpiredWarningLeaveId(null);
                  setExpiredWarningMessage("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleForceApprove}
                disabled={loadingId !== null}
                className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {loadingId !== null ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Vẫn duyệt đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
