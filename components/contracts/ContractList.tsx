"use client";

import { createContractAction } from "@/server/actions/create-contract";
import {
  updateContractAction,
  deleteContractAction,
} from "@/server/actions/contract-actions";
import { useActionState, useState, useTransition } from "react";
import {
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { Contract } from "@/types";

interface ContractWithDetails extends Contract {
  StartDateFormatted?: string;
  EndDateFormatted?: string;
  Status?: string;
  salary?: number;
}

interface Props {
  employeeId: number;
  contracts: ContractWithDetails[];
}

const initialState = {
  error: "",
  success: false,
  message: "",
};

export default function ContractList({ employeeId, contracts }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] =
    useState<ContractWithDetails | null>(null);
  const [state, formAction, isPending] = useActionState(
    editingContract ? updateContractAction : createContractAction,
    initialState,
  );
  const [isPendingTransition, startTransition] = useTransition();

  const handleEdit = (contract: ContractWithDetails) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContract(null);
  };

  const handleDelete = async (contractId: number) => {
    if (!confirm("Bạn có chắc muốn xóa hợp đồng này?")) return;

    startTransition(async () => {
      const result = await deleteContractAction(contractId, employeeId);
      if (result.success) {
        alert("Xóa hợp đồng thành công!");
        window.location.reload();
      } else {
        alert(result.error || "Lỗi khi xóa hợp đồng");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Hợp đồng lao động
        </h3>
        <button
          onClick={() => {
            setEditingContract(null);
            setShowForm(!showForm);
          }}
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Đóng" : "Thêm mới"}
        </button>
      </div>

      <div className="p-6">
        {/* Form Thêm/Sửa Hợp Đồng */}
        {showForm && (
          <form
            action={formAction}
            className="mb-8 bg-blue-50/50 p-4 rounded-lg border border-blue-100"
          >
            <input type="hidden" name="employee_id" value={employeeId} />
            {editingContract && (
              <input
                type="hidden"
                name="contract_id"
                value={editingContract.id}
              />
            )}

            {state?.error && (
              <div className="mb-4 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {state.error}
              </div>
            )}

            {state?.success && !isPending && (
              <div className="mb-4 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />{" "}
                {editingContract ? "Cập nhật" : "Thêm"} hợp đồng thành công!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Loại hợp đồng
                </label>
                <select
                  name="contract_type"
                  defaultValue={editingContract?.contract_type || "Thử việc"}
                  className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="Thử việc">Hợp đồng thử việc</option>
                  <option value="Chính thức 1 năm">Chính thức 1 năm</option>
                  <option value="Chính thức 3 năm">Chính thức 3 năm</option>
                  <option value="Không thời hạn">
                    Không xác định thời hạn
                  </option>
                  <option value="Thực tập">Thực tập sinh</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mức lương cơ bản (VND)
                </label>
                <input
                  type="number"
                  name="salary"
                  required
                  min="0"
                  defaultValue={editingContract?.salary || ""}
                  placeholder="0"
                  className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  defaultValue={editingContract?.start_date || ""}
                  className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ngày kết thúc (Để trống nếu vô hạn)
                </label>
                <input
                  type="date"
                  name="end_date"
                  defaultValue={editingContract?.end_date || ""}
                  className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={editingContract?.notes || ""}
                  placeholder="Ghi chú thêm..."
                  className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {isPending
                  ? "Đang lưu..."
                  : editingContract
                    ? "Cập nhật"
                    : "Lưu hợp đồng"}
              </button>
            </div>
          </form>
        )}

        {/* Danh sách hợp đồng */}
        {contracts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Chưa có hợp đồng nào.
          </p>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {contract.contract_type}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contract.StartDateFormatted} -{" "}
                      {contract.EndDateFormatted}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        contract.Status === "Hiệu lực"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {contract.Status}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Mức lương:</span>{" "}
                    <span className="text-blue-600 font-bold">
                      {contract.salary
                        ? contract.salary.toLocaleString("vi-VN")
                        : "0"}{" "}
                      VND
                    </span>
                  </p>
                  {contract.notes && (
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">Ghi chú:</span>{" "}
                      {contract.notes}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(contract)}
                      disabled={isPendingTransition}
                      className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id)}
                      disabled={isPendingTransition}
                      className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
