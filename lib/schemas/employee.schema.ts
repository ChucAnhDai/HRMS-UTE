import { z } from "zod";

export const EmployeeSchema = z.object({
  first_name: z.string().min(1, "Họ không được để trống").max(250, "Họ không được quá 250 ký tự"),
  last_name: z.string().min(1, "Tên không được để trống").max(250, "Tên không được quá 250 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(0\d{9}|\+\d{10})$/, "Số điện thoại phải gồm đúng 10 số (nếu bắt đầu bằng 0) hoặc 11 ký tự (nếu bắt đầu bằng +)").optional().or(z.literal("")),
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

  // Validate termination date is required for resigned/terminated employees
  if (
    ["Resigned", "Terminated"].includes(data.employment_status) &&
    !data.termination_date
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày nghỉ việc là bắt buộc với trạng thái Đã nghỉ/Đã chấm dứt",
      path: ["termination_date"],
    });
  }

  // Validate job title vs status
  if (
    data.employment_status === "Active" &&
    data.job_title &&
    (data.job_title.toLowerCase().includes("thử việc") ||
      data.job_title.toLowerCase().includes("probation"))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nhân viên chính thức không nên để chức danh là Thử việc",
      path: ["job_title"],
    });
  }

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
