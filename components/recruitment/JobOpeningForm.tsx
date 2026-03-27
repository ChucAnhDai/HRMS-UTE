"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, AlertCircle } from "lucide-react";
import {
  createJobAction,
  updateJobAction,
} from "@/server/actions/recruitment-actions";
import { JobOpening, Department } from "@/types/database";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import FormDraftNotice from "../common/FormDraftNotice";

interface Props {
  onClose: () => void;
  jobToEdit?: JobOpening | null;
  departments: Department[];
}

export default function JobOpeningForm({
  onClose,
  jobToEdit,
  departments,
}: Props) {
  const { savedData, saveFormData, clearSavedData, isRestored, isMounted } = 
    useFormPersistence({ 
      entity: "job", 
      action: jobToEdit ? "edit" : "create", 
      id: jobToEdit?.id || "new" 
    });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    setFieldErrors(null);

    let res;
    const prevState = {};

    if (jobToEdit) {
      res = await updateJobAction(jobToEdit.id, prevState, formData);
    } else {
      res = await createJobAction(prevState, formData);
    }

    setIsPending(false);

    if (res.success) {
      clearSavedData();
      onClose();
    } else {
      setError(res.error || "Có lỗi xảy ra");
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {jobToEdit ? "Chỉnh sửa Tin Tuyển Dụng" : "Đăng Tin Tuyển Dụng Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <FormDraftNotice isVisible={isRestored} onClear={clearSavedData} />
        </div>

        <form 
          action={handleSubmit} 
          className="p-6 pt-2 space-y-6"
          onChange={(e) => {
            const formData = new FormData(e.currentTarget);
            saveFormData(Object.fromEntries(formData.entries()));
          }}
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vị trí Tuyển dụng <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                key={`title-${isMounted}`}
                defaultValue={isMounted ? (savedData?.title as string || jobToEdit?.title || "") : (jobToEdit?.title || "")}
                placeholder="Vd: Lập trình viên PHP (Laravel)"
              />
              {fieldErrors?.title && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.title[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phòng ban Tuyển dụng <span className="text-red-500">*</span>
              </label>
              <select
                name="department_id"
                key={`department_id-${isMounted}`}
                defaultValue={isMounted ? (savedData?.department_id as string || jobToEdit?.department_id?.toString() || "") : (jobToEdit?.department_id?.toString() || "")}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn phòng ban --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {fieldErrors?.department_id && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.department_id[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                key={`status-${isMounted}`}
                defaultValue={isMounted ? (savedData?.status as string || (jobToEdit?.status || "Open")) : (jobToEdit?.status || "Open")}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open (Đang mở)</option>
                <option value="Closed">Closed (Đã đóng)</option>
                <option value="Draft">Draft (Nháp)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mô tả Công việc (Job Description){" "}
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                key={`description-${isMounted}`}
                defaultValue={isMounted ? (savedData?.description as string || (jobToEdit?.description || "")) : (jobToEdit?.description || "")}
                rows={8}
                placeholder="Mô tả chi tiết công việc, yêu cầu, quyền lợi... (Tối thiểu 20 ký tự)"
              />
              {fieldErrors?.description && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.description[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                "Đang xử lý..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {jobToEdit ? "Lưu thay đổi" : "Đăng tin"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
