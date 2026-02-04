"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getJobCandidatesAction,
  updateCandidateStatusAction,
} from "@/server/actions/recruitment-actions";
import { Loader2, FileText, CheckCircle2, XCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_path: string | null;
  status: string;
  created_at: string;
}

interface Props {
  jobId: number | null;
  onClose: () => void;
  jobTitle?: string;
}

export default function CandidatesListModal({
  jobId,
  onClose,
  jobTitle,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { toast } = useToast();

  const loadCandidates = useCallback(async (id: number) => {
    setLoading(true);
    const res = await getJobCandidatesAction(id);
    if (res.success && res.data) {
      setCandidates(res.data as Candidate[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (jobId) {
      loadCandidates(jobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleUpdateStatus = async (id: number, status: string) => {
    setProcessingId(id);
    const res = await updateCandidateStatusAction(id, status);
    if (res.success) {
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái ứng viên thành ${
          status === "Accepted" ? "Chấp nhận" : "Từ chối"
        }`,
        variant: "default",
      });
      if (jobId) loadCandidates(jobId);
    } else {
      toast({
        title: "Lỗi",
        description: res.error,
        variant: "destructive",
      });
    }
    setProcessingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 px-3 py-1 font-normal">
            Đã chấp nhận
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200 px-3 py-1 font-normal">
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 px-3 py-1 font-normal">
            Chờ duyệt
          </Badge>
        );
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
  };

  const getRandomColorClass = (id: number) => {
    const colors = [
      "bg-amber-400",
      "bg-blue-500",
      "bg-emerald-400",
      "bg-indigo-500",
      "bg-rose-500",
      "bg-cyan-500",
    ];
    return colors[id % colors.length];
  };

  return (
    <Dialog open={!!jobId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white overflow-hidden sm:rounded-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Danh sách ứng viên
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Vị trí:{" "}
              <span className="font-semibold text-gray-900">{jobTitle}</span>{" "}
              &bull; Total: {candidates.length}
            </DialogDescription>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50/30 p-4 sm:p-6">
          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Chưa có ứng viên nào cho vị trí này.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[200px] text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      Họ và tên
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      Mã UV
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      Số điện thoại
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      Ngày nộp
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider text-right">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-gray-50/50"
                    >
                      <TableCell className="pl-6 py-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${getRandomColorClass(candidate.id)}`}
                        >
                          {getInitials(
                            candidate.first_name,
                            candidate.last_name,
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {candidate.last_name} {candidate.first_name}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        #{candidate.id}
                      </TableCell>
                      <TableCell className="text-blue-600 font-medium">
                        {candidate.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {candidate.phone || "---"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(candidate.created_at).toLocaleDateString(
                          "vi-VN",
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(candidate.status || "Applied")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {candidate.resume_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                              asChild
                            >
                              <a
                                href={candidate.resume_path}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="w-4 h-4 mr-1" /> CV
                              </a>
                            </Button>
                          )}
                          {(!candidate.status ||
                            candidate.status === "Applied") && (
                            <>
                              <Button
                                size="sm"
                                className="h-8 bg-emerald-500 hover:bg-emerald-600"
                                disabled={processingId === candidate.id}
                                onClick={() =>
                                  handleUpdateStatus(candidate.id, "Accepted")
                                }
                              >
                                {processingId === candidate.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                                disabled={processingId === candidate.id}
                                onClick={() =>
                                  handleUpdateStatus(candidate.id, "Rejected")
                                }
                              >
                                {processingId === candidate.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
