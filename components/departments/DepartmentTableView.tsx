"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { deleteDepartmentAction } from "@/server/actions/department-actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface Department {
  id: number;
  name: string;
  employee_count: number;
  created_at: string;
}

interface Props {
  departments: Department[];
  canManage: boolean; // Chỉ Admin mới có quyền thêm/sửa/xóa
}

export default function DepartmentTableView({ departments, canManage }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleDelete = (id: number, name: string) => {
    setDepartmentToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    const { id, name } = departmentToDelete;

    setDeleteError(null);
    setDeletingId(id);

    const result = await deleteDepartmentAction(id);

    setDeletingId(null);

    if (result.error) {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể xóa phòng ban",
        variant: "destructive",
      });
      setDeleteError(result.error);
      return;
    }

    toast({
      title: "Thành công",
      description: `Đã xóa phòng ban "${name}" thành công`,
    });
    router.refresh();
  };

  // Filter departments
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <span className="font-semibold text-blue-600">Phòng ban</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Quản lý phòng ban</h3>
      </div>

      {/* Error Alert */}
      {deleteError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
          />
        </div>

        {canManage && (
          <Link
            href="/departments/create"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Thêm phòng ban
          </Link>
        )}
      </div>

      {/* Department Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Tên phòng ban
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                  Số nhân viên
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 5 : 4}
                    className="text-center py-12 text-gray-500"
                  >
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Không tìm thấy phòng ban nào</p>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      #{dept.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {dept.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        <Users className="w-4 h-4" />
                        {dept.employee_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(dept.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/departments/${dept.id}`}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canManage && (
                          <>
                            <Link
                              href={`/departments/${dept.id}/edit`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(dept.id, dept.name)}
                              disabled={deletingId === dept.id}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              title="Xóa"
                            >
                              {deletingId === dept.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Tổng cộng: <strong>{filteredDepartments.length}</strong> phòng ban
          </span>
        </div>
      </div>
      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận xóa phòng ban"
        description={`Bạn có chắc chắn muốn xóa phòng ban "${departmentToDelete?.name}"? Hành động này không thể hoàn tác và toàn bộ dữ liệu liên quan sẽ bị ảnh hưởng.`}
        onConfirm={confirmDelete}
        variant="danger"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}
