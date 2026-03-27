"use client";

import { updateEmployeeAction } from "@/server/actions/update-employee";
import { useActionState } from "react";
import { Save, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { Department, EmploymentStatus } from "@/types";
import EmployeeFormSections from "./EmployeeFormSections";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import FormDraftNotice from "../common/FormDraftNotice";
import { useEffect } from "react";

interface Props {
  departments: { id: number; name: string }[];
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    department_id?: number | null;
    job_title?: string | null;
    hire_date: string;
    probation_end_date?: string | null;
    tax_code?: string | null;
    dependents?: number | null;
    salary?: number | null;
    annual_leave_quota?: number;
    sick_leave_quota?: number;
    other_leave_quota?: number;
    employment_status?: EmploymentStatus;
    termination_date?: string | null;
  };
}

const initialState: { error?: string; success?: boolean } = {
  error: "",
  success: false,
};

export default function EditEmployeeForm({ departments, employee }: Props) {
  const { savedData, saveFormData, clearSavedData, isRestored, isMounted } = 
    useFormPersistence({ 
      entity: "employee", 
      action: "edit", 
      id: employee.id,
      excludeFields: ["avatarFile"]
    });

  const updateActionWithId = updateEmployeeAction.bind(null, employee.id);
  const [state, formAction, isPending] = useActionState(
    updateActionWithId,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      clearSavedData();
    }
  }, [state?.success, clearSavedData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <Edit className="w-5 h-5 text-blue-600" />
          Chỉnh sửa nhân viên: {employee.last_name} {employee.first_name}
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
            defaultValues={employee}
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
                  <Save className="w-4 h-4" /> Cập nhật nhân viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
