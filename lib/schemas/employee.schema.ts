import { z } from "zod";

export const EmployeeSchema = z.object({
  first_name: z.string().min(1, "Họ không được để trống"),
  last_name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
  department_id: z.coerce.number().optional().nullable(),
  job_title: z.string().optional(),
  hire_date: z.string().min(1, "Ngày vào làm là bắt buộc"),
  probation_end_date: z.string().optional().nullable().or(z.literal("")),
  termination_date: z.string().optional().nullable().or(z.literal("")),
  salary: z.coerce.number().min(0, "Lương không được là số âm").optional().nullable(),
  tax_code: z.string().regex(/^[0-9]*$/, "Mã số thuế chỉ chứa số").optional().or(z.literal("")),
  dependents: z.coerce.number().int().min(0, "Số người phụ thuộc không được âm").default(0),
  annual_leave_quota: z.coerce.number().min(0, "Phép năm không được âm").default(12),
  sick_leave_quota: z.coerce.number().min(0, "Phép ốm không được âm").default(5),
  other_leave_quota: z.coerce.number().min(0, "Phép khác không được âm").default(5),
  employment_status: z.string().default("Probation"),
  avatar: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  const hireDate = new Date(data.hire_date);

  if (data.probation_end_date) {
    const probationDate = new Date(data.probation_end_date);
    if (probationDate < hireDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc thử việc không được trước ngày vào làm",
        path: ["probation_end_date"],
      });
    }
  }

  if (data.termination_date) {
    const terminationDate = new Date(data.termination_date);
    if (terminationDate < hireDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày nghỉ việc không được trước ngày vào làm",
        path: ["termination_date"],
      });
    }
  }
});

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>;
