import { z } from "zod";

export const JobOpeningSchema = z.object({
  title: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  department_id: z.coerce.number().min(1, "Vui lòng chọn phòng ban"),
  status: z.enum(["Open", "Closed", "Draft"]).default("Open"),
  description: z.string().min(20, "Mô tả công việc phải có ít nhất 20 ký tự"),
});

export const CandidateSchema = z.object({
  job_opening_id: z.coerce.number(),
  first_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  last_name: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  resume_path: z.string().optional(), // Sẽ xử lý upload sau
});

export type JobOpeningFormValues = z.infer<typeof JobOpeningSchema>;
export type CandidateFormValues = z.infer<typeof CandidateSchema>;
