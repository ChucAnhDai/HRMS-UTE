import { z } from "zod";

export const LeaveRequestSchema = z.object({
  employee_id: z.coerce.number().optional(), // Có thể lấy tự động từ session
  leave_type: z.enum(["Annual Leave", "Sick Leave", "Unpaid Leave", "Maternity Leave", "Other"]),
  start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  reason: z.string().optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  
  // Normalize current date to start of day for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalize start date to start of day (in case it comes with time)
  const startCheck = new Date(start);
  startCheck.setHours(0, 0, 0, 0);

  if (startCheck < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày bắt đầu không được trong quá khứ",
      path: ["start_date"],
    });
  }

  if (end < start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày kết thúc không được trước ngày bắt đầu",
      path: ["end_date"],
    });
  }
});

export type LeaveRequestFormValues = z.infer<typeof LeaveRequestSchema>;
