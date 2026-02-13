import { z } from "zod";

// Schema cho Admin tạo attendance record
export const AdminAttendanceSchema = z.object({
  employee_id: z.coerce.number().min(1, "Vui lòng chọn nhân viên"),
  date: z.string().min(1, "Ngày là bắt buộc"),
  check_in_time: z.string().min(1, "Giờ check-in là bắt buộc"),
  check_out_time: z.string().optional(),
  status: z.enum(["Present", "Late"], "Trạng thái không hợp lệ"),
}).superRefine((data, ctx) => {
  // check_out_time phải sau check_in_time
  if (data.check_out_time && data.check_out_time <= data.check_in_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Giờ check-out phải sau giờ check-in",
      path: ["check_out_time"],
    });
  }
});

// Schema cho Admin sửa attendance (chỉ sửa giờ, không sửa employee/date)
export const AdminEditAttendanceSchema = z.object({
  id: z.coerce.number().min(1),
  check_in_time: z.string().min(1, "Giờ check-in là bắt buộc"),
  check_out_time: z.string().optional(),
  status: z.enum(["Present", "Late"], "Trạng thái không hợp lệ"),
}).superRefine((data, ctx) => {
  if (data.check_out_time && data.check_out_time <= data.check_in_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Giờ check-out phải sau giờ check-in",
      path: ["check_out_time"],
    });
  }
});

export type AdminAttendanceFormValues = z.infer<typeof AdminAttendanceSchema>;
export type AdminEditAttendanceFormValues = z.infer<typeof AdminEditAttendanceSchema>;
