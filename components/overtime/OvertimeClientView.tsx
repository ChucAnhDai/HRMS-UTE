"use client";

import { useState } from "react";
import { OvertimeRequest, Employee } from "@/types";
import { Check, X, Clock, Calendar, Plus } from "lucide-react";
import {
  approveOvertimeRequestAction,
  rejectOvertimeRequestAction,
} from "@/server/actions/overtime-actions";
import OvertimeRequestModal from "./OvertimeRequestModal";
import { TruncatedTextWithView } from "@/components/ui/ContentViewerModal";
import { toast } from "@/hooks/use-toast";

interface Props {
  initialRequests: OvertimeRequest[];
  isAdmin: boolean;
  employees?: Employee[];
  workEndTime?: string;
}

export default function OvertimeClientView({
  initialRequests,
  isAdmin,
  employees = [],
  workEndTime = "17:00",
}: Props) {
  const [requests] = useState<OvertimeRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleSuccess = () => {
    window.location.reload();
  };

  const handleApproveClick = (id: number) => {
    setConfirmingId(id);
    setConfirmAction("approve");
  };

  const handleRejectClick = (id: number) => {
    setConfirmingId(id);
    setConfirmAction("reject");
    setRejectReason("");
  };

  const handleCancelConfirm = () => {
    setConfirmingId(null);
    setConfirmAction(null);
    setRejectReason("");
  };

  const handleConfirmAction = async () => {
    if (!confirmingId || !confirmAction) return;
    setProcessingId(confirmingId);
    try {
      if (confirmAction === "approve") {
        const res = await approveOvertimeRequestAction(confirmingId);
        if (res.success) {
          toast({
            title: "Thành công",
            description: "Đã duyệt yêu cầu thành công!",
          });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast({
            title: "Lỗi",
            description: res.error || "Không thể duyệt yêu cầu",
            variant: "destructive",
          });
        }
      } else {
        if (!rejectReason.trim()) {
          toast({
            title: "Cảnh báo",
            description: "Vui lòng nhập lý do từ chối.",
            variant: "destructive",
          });
          setProcessingId(null);
          return;
        }
        const res = await rejectOvertimeRequestAction(
          confirmingId,
          rejectReason.trim(),
        );
        if (res.success) {
          toast({
            title: "Thành công",
            description: "Đã từ chối yêu cầu thành công!",
          });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast({
            title: "Lỗi",
            description: res.error || "Không thể từ chối yêu cầu",
            variant: "destructive",
          });
        }
      }
    } catch {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi không xác định.",
        variant: "destructive",
      });
    }

    setProcessingId(null);
    setConfirmingId(null);
    setConfirmAction(null);
    setRejectReason("");
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Quản lý Làm thêm giờ (OT)
          </h1>
          <p className="text-gray-500">
            {isAdmin
              ? "Quản lý và phê duyệt các yêu cầu OT của nhân viên."
              : "Đăng ký và theo dõi lịch sử làm thêm giờ của bạn."}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Đăng ký OT
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 w-fit">
        {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-gray-100 text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status === "All"
              ? "Tất cả"
              : status === "Pending"
                ? "Chờ duyệt"
                : status === "Approved"
                  ? "Đã duyệt"
                  : "Từ chối"}
          </button>
        ))}
      </div>



      {/* Approve Confirmation Modal */}
      {confirmAction === "approve" && confirmingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-50 border-2 border-green-200">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-6">
              Bạn có muốn duyệt yêu cầu này không?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancelConfirm}
                disabled={processingId !== null}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Không
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processingId !== null}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {processingId ? "Đang xử lý..." : "Có"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {confirmAction === "reject" && confirmingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" /> Từ chối yêu cầu OT
            </h3>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none ${
                  rejectReason.length > 450
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                rows={5}
                placeholder="Nhập lý do từ chối..."
                autoFocus
              />
              <div
                className={`text-xs text-right ${
                  rejectReason.length > 450
                    ? "text-red-500 font-medium"
                    : "text-gray-400"
                }`}
              >
                {rejectReason.length}/500 ký tự
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelConfirm}
                disabled={processingId !== null}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processingId !== null || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {processingId ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border boundary-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Nhân viên
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Ngày & Giờ
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">
                  Tổng giờ
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Lý do</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">
                  Trạng thái
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                    Hành động
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có dữ liệu nào
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {req.employees?.last_name} {req.employees?.first_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        MNV: #{req.employees?.id || req.employee_id}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {req.employees?.departments?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(req.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-1.5 ml-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {req.start_time.slice(0, 5)} -{" "}
                          {req.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-12 px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                        {req.hours}h
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs text-gray-600">
                      <TruncatedTextWithView
                        text={req.reason}
                        modalTitle="Lý do làm thêm giờ"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          req.status === "Approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : req.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {req.status === "Approved" && (
                          <Check className="w-3 h-3" />
                        )}
                        {req.status === "Rejected" && <X className="w-3 h-3" />}
                        {req.status === "Pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {req.status === "Approved"
                          ? "Đã duyệt"
                          : req.status === "Rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </span>
                      {req.status === "Rejected" && req.rejection_reason && (
                        <div className="text-xs text-red-500 mt-1 max-w-[160px]">
                          <TruncatedTextWithView
                            text={`Lý do: ${req.rejection_reason}`}
                            maxLength={20}
                            modalTitle="Lý do từ chối"
                          />
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {req.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApproveClick(req.id)}
                              className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200 transition-colors"
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(req.id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200 transition-colors"
                              title="Từ chối"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OvertimeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        employees={employees}
        workEndTime={workEndTime}
      />
    </div>
  );
}
