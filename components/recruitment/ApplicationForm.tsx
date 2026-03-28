"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitApplicationAction } from "@/server/actions/recruitment-actions";
import { CheckCircle, AlertCircle, UploadCloud } from "lucide-react";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import FormDraftNotice from "../common/FormDraftNotice";
import { toast } from "@/hooks/use-toast";

interface Props {
  jobId: number;
}

export default function ApplicationForm({ jobId }: Props) {
  const { savedData, saveFormData, clearSavedData, isRestored, isMounted } = 
    useFormPersistence({ 
      entity: "application", 
      action: "create", 
      id: jobId,
      excludeFields: ["resume_file"]
    });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    // Append dummy ActionState
    const prevState = {};
    const res = await submitApplicationAction(prevState, formData);

    if (res.success) {
      toast({
        title: "Thành công",
        description: "Đã nộp đơn ứng tuyển thành công",
      });
      clearSavedData();
      setSuccess(true);
    } else {
      const msg = res.fieldErrors 
        ? Object.values(res.fieldErrors).flat().join(", ")
        : (res.error || "Có lỗi xảy ra khi nộp đơn.");
      
      toast({
        title: "Lỗi",
        description: msg,
        variant: "destructive",
      });
      setError(msg);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nộp đơn thành công!
        </h3>
        <p className="text-gray-600">
          Cảm ơn bạn đã quan tâm. Chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn
          sớm nhất có thể.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Ứng tuyển Vị trí này
      </h3>

      <FormDraftNotice isVisible={isRestored} onClear={clearSavedData} />

      <form 
        action={handleSubmit} 
        className="space-y-4"
        onChange={(e) => {
          const fd = new FormData(e.currentTarget);
          saveFormData(Object.fromEntries(fd.entries()));
        }}
      >
        <input type="hidden" name="job_opening_id" value={jobId} />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Tên</label>
            <Input 
              name="first_name" 
              key={`first_name-${isMounted}`}
              required 
              placeholder="Vd: Sang" 
              defaultValue={isMounted ? (savedData?.first_name as string || "") : ""}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Họ</label>
            <Input 
              name="last_name" 
              key={`last_name-${isMounted}`}
              required 
              placeholder="Vd: Bui" 
              defaultValue={isMounted ? (savedData?.last_name as string || "") : ""}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <Input
            name="email"
            key={`email-${isMounted}`}
            type="email"
            required
            placeholder="example@gmail.com"
            defaultValue={isMounted ? (savedData?.email as string || "") : ""}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Số điện thoại
          </label>
          <Input 
            name="phone" 
            key={`phone-${isMounted}`}
            type="tel" 
            required 
            placeholder="0901234567" 
            defaultValue={isMounted ? (savedData?.phone as string || "") : ""}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Tải lên CV (pdf, doc, docx)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              name="resume_file"
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-blue-600">Choose File</span>{" "}
              or drag & drop here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Sẽ hỗ trợ upload file thật sau
            </p>
          </div>
          {/* Hidden input for dummy data to satisfy Zod for now if file not uploaded */}
          <input type="hidden" name="resume_path" value="dummy_cv.pdf" />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-blue-900 hover:bg-blue-800 text-white mt-4"
      disabled={pending}
    >
      {pending ? "Đang gửi..." : "Nộp Đơn (Apply)"}
    </Button>
  );
}
