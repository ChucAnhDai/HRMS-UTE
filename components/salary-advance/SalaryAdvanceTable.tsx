"use client";

import { useState } from "react";
import { SalaryAdvance } from "@/types";
import { CurrentUser } from "@/types/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  approveSalaryAdvanceAction,
  rejectSalaryAdvanceAction,
} from "@/server/actions/salary-advance-actions";
import { useToast } from "@/hooks/use-toast";
import { TruncatedTextWithView } from "@/components/ui/ContentViewerModal";
interface Props {
  advances: SalaryAdvance[];
  currentUser: CurrentUser | null;
}

export default function SalaryAdvanceTable({ advances, currentUser }: Props) {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Pending");

  // State cho modal duyệt
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvingAdvanceId, setApprovingAdvanceId] = useState<number | null>(
    null,
  );

  // State cho modal từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingAdvanceId, setRejectingAdvanceId] = useState<number | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const isManager =
    currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";

  // Xử lý mở modal
  const openApproveModal = (id: number) => {
    setApprovingAdvanceId(id);
    setApproveModalOpen(true);
  };

  const openRejectModal = (id: number) => {
    setRejectingAdvanceId(id);
    setRejectionReason("");
    setRejectError("");
    setRejectModalOpen(true);
  };

  const handleApprove = async () => {
    if (!approvingAdvanceId) return;

    setLoadingId(approvingAdvanceId);
    const res = await approveSalaryAdvanceAction(approvingAdvanceId);
    if (res.error) {
      toast({ title: "Lỗi", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Thành công", description: "Đã duyệt yêu cầu tạm ứng." });
    }
    setLoadingId(null);
    setApproveModalOpen(false);
    setApprovingAdvanceId(null);
  };

  const handleReject = async () => {
    if (!rejectingAdvanceId) return;

    if (!rejectionReason.trim()) {
      setRejectError("Vui lòng nhập lý do từ chối");
      return;
    }

    setLoadingId(rejectingAdvanceId);
    const res = await rejectSalaryAdvanceAction(
      rejectingAdvanceId,
      rejectionReason,
    );
    if (res.error) {
      setRejectError(res.error);
    } else {
      toast({ title: "Thành công", description: "Đã từ chối yêu cầu." });
      setRejectModalOpen(false);
      setRejectingAdvanceId(null);
      setRejectionReason("");
    }
    setLoadingId(null);
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Đã duyệt
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Chờ duyệt
          </Badge>
        );
    }
  };

  const filteredAdvances = advances.filter((item) => {
    if (activeTab === "All") return true;
    return item.status === activeTab;
  });

  const tabs = [
    { id: "Pending", label: "Chờ duyệt" },
    { id: "Approved", label: "Đã duyệt (Chờ trừ lương)" },
    { id: "Rejected", label: "Đã từ chối" },
    { id: "All", label: "Tất cả" },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 hover:bg-gray-50 focus:outline-none ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                Nhân viên
              </TableHead>
              <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                Ngày xin
              </TableHead>
              <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                Số tiền
              </TableHead>
              <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider w-[200px]">
                Lý do
              </TableHead>
              <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                Trạng thái
              </TableHead>
              {isManager && (
                <TableHead className="font-bold text-gray-900 uppercase text-xs tracking-wider text-right">
                  Hành động
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdvances.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-32 text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">Không có yêu cầu nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdvances.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <div>
                      {item.employees
                        ? `${item.employees.last_name} ${item.employees.first_name}`
                        : "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.employees?.departments?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {new Date(item.request_date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {formatMoney(Number(item.amount))}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 max-w-[200px]">
                    <TruncatedTextWithView
                      text={item.reason || ""}
                      modalTitle="Lý do tạm ứng"
                    />
                    {item.rejection_reason && (
                      <div className="text-red-500 text-xs mt-1">
                        <TruncatedTextWithView
                          text={`Lý do từ chối: ${item.rejection_reason}`}
                          maxLength={20}
                          modalTitle="Lý do từ chối tạm ứng"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  {isManager && (
                    <TableCell className="text-right">
                      {item.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-transparent text-green-600 border border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => openApproveModal(item.id)}
                            disabled={loadingId === item.id}
                            title="Duyệt"
                          >
                            {loadingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-transparent text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => openRejectModal(item.id)}
                            disabled={loadingId === item.id}
                            title="Từ chối"
                          >
                            {loadingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận duyệt */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-green-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Xác nhận duyệt tạm ứng
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Bạn có chắc chắn muốn duyệt yêu cầu tạm ứng này không? Khoản
                tiền này sẽ được lưu để trừ vào lương kỳ tới.
              </p>
            </div>

            <div className="p-6 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={() => {
                  setApproveModalOpen(false);
                  setApprovingAdvanceId(null);
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
                  <CheckCircle className="w-4 h-4" />
                )}
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal từ chối */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md m-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-red-50/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <XCircle className="w-5 h-5 text-red-600" />
                Từ chối tạm ứng lương
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
                  placeholder="VD: Không đủ điều kiện tạm ứng, đã đạt giới hạn tối đa..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectingAdvanceId(null);
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
                    <XCircle className="w-4 h-4" />
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
