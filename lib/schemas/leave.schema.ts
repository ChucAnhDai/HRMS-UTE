import { z } from "zod";

export const LeaveRequestSchema = z.object({
  employee_id: z.coerce.number().optional(), // Có thể lấy tự động từ session
  leave_type: z.string().min(1, "Loại nghỉ phép là bắt buộc"),
  start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  reason: z.string().optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  
  if (end < start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày kết thúc không được trước ngày bắt đầu",
      path: ["end_date"],
    });
  }
});

export type LeaveRequestFormValues = z.infer<typeof LeaveRequestSchema>;
