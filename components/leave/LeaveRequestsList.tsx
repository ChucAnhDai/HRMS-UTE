"use client";

import React, { useTransition } from "react";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import {
  approveLeaveAction,
  rejectLeaveAction,
} from "@/server/actions/leave-actions";
import Image from "next/image";
import { TruncatedTextWithView } from "@/components/ui/ContentViewerModal";

interface LeaveRequestItem {
  id: number;
  EmployeeName: string;
  Avatar?: string;
  leave_type: string;
  StartDateFormatted: string;
  EndDateFormatted: string;
  Duration: string | number;
  reason: string;
  status: string;
}

interface Props {
  requests: LeaveRequestItem[];
}

export default function LeaveRequestsList({ requests }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn DUYỆT đơn này?")) return;
    startTransition(async () => {
      await approveLeaveAction(id);
    });
  };

  const handleReject = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn TỪ CHỐI đơn này?")) return;
    startTransition(async () => {
      await rejectLeaveAction(id, "Rejected by Admin via Dashboard");
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Đã duyệt
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Từ chối
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chờ duyệt
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Danh sách đơn xin nghỉ
        </h3>
        <span className="text-sm text-gray-500">
          Tổng cộng: {requests.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Nhân viên</th>
              <th className="px-6 py-3">Loại nghỉ</th>
              <th className="px-6 py-3">Thời gian</th>
              <th className="px-6 py-3">Lý do</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Chưa có đơn xin nghỉ nào.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={
                            req.Avatar ||
                            `https://ui-avatars.com/api/?name=${req.EmployeeName}&background=random`
                          }
                          alt={req.EmployeeName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {req.EmployeeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{req.leave_type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span>
                        {req.StartDateFormatted} - {req.EndDateFormatted}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({req.Duration} ngày)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs">
                    <TruncatedTextWithView
                      text={req.reason}
                      modalTitle="Lý do nghỉ phép"
                    />
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "Pending" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={isPending}
                          className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                          title="Duyệt"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={isPending}
                          className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Từ chối"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
