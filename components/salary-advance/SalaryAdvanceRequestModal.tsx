"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import { createSalaryAdvanceAction } from "@/server/actions/salary-advance-actions";
import { useToast } from "@/hooks/use-toast";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import FormDraftNotice from "../common/FormDraftNotice";

const initialState: { error?: string; success?: boolean } = {
  error: "",
  success: false,
};

export default function SalaryAdvanceRequestModal() {
  const { savedData, saveFormData, clearSavedData, isRestored, isMounted } = 
    useFormPersistence({ 
      entity: "salary_advance", 
      action: "create" 
    });

  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createSalaryAdvanceAction,
    initialState,
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      clearSavedData();
      toast({
        title: "Thành công",
        description: "Yêu cầu tạm ứng đã được gửi thành công.",
        variant: "default",
      });
      const timer = setTimeout(() => {
        setOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    } else if (state.error && state.error !== "") {
      toast({
        title: "Lỗi",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast, clearSavedData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Tạm ứng mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đề xuất Tạm ứng lương</DialogTitle>
        </DialogHeader>

        <FormDraftNotice isVisible={isRestored} onClear={clearSavedData} />

        <form 
          action={formAction} 
          className="space-y-4 py-4"
          onChange={(e) => {
            const fd = new FormData(e.currentTarget);
            saveFormData(Object.fromEntries(fd.entries()));
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền muốn ứng (VND)</Label>
            <Input
              id="amount"
              name="amount"
              key={`amount-${isMounted}`}
              type="number"
              min="100000"
              step="50000"
              placeholder="Ví dụ: 1000000"
              defaultValue={isMounted ? (savedData?.amount as string || "") : ""}
              required
            />
            <p className="text-xs text-gray-500">Tối thiểu: 100,000đ.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do</Label>
            <Textarea
              id="reason"
              name="reason"
              key={`reason-${isMounted}`}
              placeholder="Nhập lý do tạm ứng..."
              defaultValue={isMounted ? (savedData?.reason as string || "") : ""}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gửi yêu cầu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
