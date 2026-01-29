"use client";

import { useState } from "react";
import { SalaryAdvance } from "@/types";
import { CurrentUser } from "@/lib/auth-helpers";
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
interface Props {
  advances: SalaryAdvance[];
  currentUser: CurrentUser | null;
}

export default function SalaryAdvanceTable({ advances, currentUser }: Props) {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Pending");

  const isManager =
    currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";

  const handleApprove = async (id: number) => {
    setLoadingId(id);
    const res = await approveSalaryAdvanceAction(id);
    if (res.error) {
      toast({ title: "Lỗi", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Thành công", description: "Đã duyệt yêu cầu tạm ứng." });
    }
    setLoadingId(null);
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (reason === null) return;
    if (!reason) {
      return toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do từ chối",
        variant: "destructive",
      });
    }

    setLoadingId(id);
    const res = await rejectSalaryAdvanceAction(id, reason);
    if (res.error) {
      toast({ title: "Lỗi", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Thành công", description: "Đã từ chối yêu cầu." });
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
                  <TableCell
                    className="text-sm text-gray-900 truncate max-w-[200px]"
                    title={item.reason || ""}
                  >
                    {item.reason}
                    {item.rejection_reason && (
                      <div className="text-red-500 text-xs mt-1">
                        Lý do từ chối: {item.rejection_reason}
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
                            variant="outline"
                            className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleApprove(item.id)}
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
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleReject(item.id)}
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
    </div>
  );
}
