"use client";

import { createEmployeeAction } from "@/server/actions/create-employee";
import { useActionState } from "react";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EmployeeFormSections from "./EmployeeFormSections";
import { Department } from "@/types";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import FormDraftNotice from "../common/FormDraftNotice";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Props {
  departments: Department[];
}

const initialState: { error?: string; success?: boolean } = {
  error: "",
  success: false,
};

export default function CreateEmployeeForm({ departments }: Props) {
  const { savedData, saveFormData, clearSavedData, isRestored, isMounted } = 
    useFormPersistence({ 
      entity: "employee", 
      action: "create",
      excludeFields: ["avatarFile"] 
    });

  const [state, formAction, isPending] = useActionState(
    createEmployeeAction,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Thành công",
        description: "Đã thêm nhân viên mới thành công",
      });
      clearSavedData();
    } else if (state?.error) {
      toast({
        title: "Lỗi",
        description: state.error || "Không thể thêm nhân viên mới",
        variant: "destructive",
      });
    }
  }, [state?.success, state?.error, clearSavedData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Thêm nhân viên mới
        </h3>
        <Link
          href="/employees"
          className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
      </div>

      <div className="p-8">
        <FormDraftNotice isVisible={isRestored} onClear={clearSavedData} />

        <form 
          action={formAction}
          onChange={(e) => {
            const formData = new FormData(e.currentTarget);
            saveFormData(Object.fromEntries(formData.entries()));
          }}
        >
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {state?.error}
            </div>
          )}

          <EmployeeFormSections 
            departments={departments} 
            draftValues={savedData}
            isMounted={isMounted}
          />

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2 hover:-translate-y-0.5"
            >
              {isPending ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu nhân viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
