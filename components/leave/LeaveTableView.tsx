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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  approveLeaveAction,
  rejectLeaveAction,
} from "@/server/actions/leave-actions";
import { useRouter } from "next/navigation";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";
import { Employee, LeaveRequest, Department } from "@/types";

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

  // State cho modal duyệt
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvingLeaveId, setApprovingLeaveId] = useState<number | null>(null);

  // State cho modal từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  // Kiểm tra quyền duyệt đơn - Chỉ ADMIN, MANAGER mới được duyệt/từ chối
  const canApprove =
    currentUser?.role && ["ADMIN", "MANAGER"].includes(currentUser.role);

  // Mở modal duyệt
  const openApproveModal = (id: number) => {
    if (!canApprove) {
      alert("Bạn không có quyền duyệt đơn nghỉ phép!");
      return;
    }
    setApprovingLeaveId(id);
    setApproveModalOpen(true);
  };

  const handleApprove = async () => {
    if (!approvingLeaveId) return;

    setLoadingId(approvingLeaveId);
    await approveLeaveAction(approvingLeaveId);
    setLoadingId(null);

    setApproveModalOpen(false);
    setApprovingLeaveId(null);
    router.refresh();
  };

  // Mở modal từ chối
  const openRejectModal = (id: number) => {
    if (!canApprove) {
      alert("Bạn không có quyền từ chối đơn nghỉ phép!");
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
    setRejectModalOpen(false);
    setRejectingLeaveId(null);
    setRejectionReason("");
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
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm">
            Danh sách đơn
          </button>
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-gray-600 border border-gateway-100 hover:bg-gray-50 flex items-center gap-2">
            Báo cáo nghỉ phép
          </button>
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
          <h4 className="text-lg font-bold text-gray-800">Danh sách đơn từ</h4>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-64"
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
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
              {leaves.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    Chưa có dữ liệu nghỉ phép
                  </td>
                </tr>
              ) : (
                leaves.map((leave: LeaveRequest) => (
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
                    <td
                      className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate"
                      title={leave.reason || ""}
                    >
                      {leave.reason || "---"}
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
                            <span
                              className="text-xs text-red-600 max-w-[120px] truncate cursor-help"
                              title={leave.rejection_reason}
                            >
                              {leave.rejection_reason}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Chỉ ADMIN, MANAGER mới thấy nút duyệt/từ chối */}
                      {canApprove && leave.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
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
                        </div>
                      ) : canApprove ? (
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      ) : (
                        // Nhân viên thường chỉ thấy trạng thái, không có nút thao tác
                        <span className="text-xs text-gray-400">---</span>
                      )}
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

      {/* Modal xác nhận duyệt đơn nghỉ */}
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

      {/* Modal từ chối đơn nghỉ */}
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
    </div>
  );
}
