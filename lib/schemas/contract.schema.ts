import { z } from "zod";

export const ContractSchema = z.object({
  employee_id: z.coerce.number(),
  contract_type: z.string().min(1, "Loại hợp đồng là bắt buộc"),
  start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  end_date: z.string().optional().nullable().or(z.literal("")),
  salary: z.coerce.number().min(0, "Lương không được là số âm"),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.end_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["end_date"],
      });
    }
  }
});

export type ContractFormValues = z.infer<typeof ContractSchema>;
