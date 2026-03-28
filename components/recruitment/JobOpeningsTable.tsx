"use client";

import { useState } from "react";
import { Briefcase, Plus, Users, Search, XCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobOpeningForm from "./JobOpeningForm";
import CandidatesListModal from "./CandidatesListModal";
import { deleteJobAction } from "@/server/actions/recruitment-actions";
import { JobOpening, Department } from "@/types/database";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface JobOpeningWithDetails extends JobOpening {
  departments: { name: string } | null;
  candidates: { count: number }[];
}

interface Props {
  jobs: JobOpeningWithDetails[];
  departments: Department[];
}

export default function JobOpeningsTable({ jobs, departments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobOpening | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCandidatesJob, setViewCandidatesJob] = useState<JobOpening | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [jobToDeleteId, setJobToDeleteId] = useState<number | null>(null);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setJobToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDeleteId === null) return;
    const res = await deleteJobAction(jobToDeleteId);
    if (res.success) {
      toast({
        title: "Thành công",
        description: "Đã xóa tin tuyển dụng",
      });
    } else {
      toast({
        title: "Lỗi",
        description: res.error || "Không thể xóa tin tuyển dụng",
        variant: "destructive",
      });
    }
    setJobToDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-blue-600" />
          Quản lý Tin Tuyển dụng
        </h1>
        <Button
          onClick={() => {
            setJobToEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5 mr-1" />
          Đăng tin mới
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo Vị trí (Title)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Vị trí (Title)</th>
                <th className="px-6 py-4">Phòng ban</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Số lượng ứng viên</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Chưa có tin tuyển dụng nào hoặc không tìm thấy kết quả.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                        job_id: #{job.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {job.departments?.name || "Chưa phân loại"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`
                          ${job.status === "Open" ? "bg-green-100 text-green-700 border-green-200" : ""}
                          ${job.status === "Closed" ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
                          ${job.status === "Draft" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
                        `}
                        variant="outline"
                      >
                        {job.status === "Open" && "Đang mở"}
                        {job.status === "Closed" && "Đã đóng"}
                        {job.status === "Draft" && "Nháp"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {job.candidates?.[0]?.count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {job.created_at
                        ? new Date(job.created_at).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="bg-cyan-500 hover:bg-cyan-600 h-8"
                          onClick={() => setViewCandidatesJob(job)}
                        >
                          Xem Ứng viên
                        </Button>
                        <Button
                          size="sm"
                          className="bg-amber-400 hover:bg-amber-500 text-amber-950 h-8"
                          onClick={() => {
                            setJobToEdit(job);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 bg-rose-500 hover:bg-rose-600"
                          onClick={() => handleDelete(job.id)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <JobOpeningForm
          onClose={() => setIsModalOpen(false)}
          departments={departments}
          jobToEdit={jobToEdit}
        />
      )}

      {viewCandidatesJob && (
        <CandidatesListModal
          jobId={viewCandidatesJob.id}
          jobTitle={viewCandidatesJob.title}
          onClose={() => setViewCandidatesJob(null)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận xóa bản tin"
        description="Bạn có chắc chắn muốn xóa tin tuyển dụng này? Toàn bộ hồ sơ ứng viên liên quan sẽ bị ảnh hưởng."
        onConfirm={confirmDelete}
        variant="danger"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}
