import { z } from "zod";

// Schema cho từng bậc thuế trong biểu thuế lũy tiến
const TaxBracketSchema = z.object({
  limit: z.number().min(0, "Mức thu nhập không được âm"),
  rate: z.number().min(0, "Thuế suất không được âm").max(100, "Thuế suất không được vượt quá 100%"),
});

// Schema chính cho Settings
export const SettingsSchema = z.object({
  base_salary_min: z.coerce.number().min(0, "Lương cơ bản tối thiểu không được âm"),
  insurance_percent: z.coerce.number().min(0, "Tỷ lệ bảo hiểm không được âm").max(100, "Tỷ lệ bảo hiểm không được vượt quá 100%"),
  standard_work_days: z.coerce.number().min(1, "Số ngày công chuẩn phải ít nhất là 1").max(31, "Số ngày công chuẩn không được vượt quá 31"),
  personal_deduction: z.coerce.number().min(0, "Giảm trừ bản thân không được âm"),
  dependent_deduction: z.coerce.number().min(0, "Giảm trừ gia cảnh không được âm"),
  work_start_time: z.string().min(1, "Giờ vào làm là bắt buộc"),
  work_end_time: z.string().min(1, "Giờ tan làm là bắt buộc"),
  penalty_late: z.coerce.number().min(0, "Số tiền phạt đi trễ không được âm"),
  penalty_absence: z.coerce.number().min(0, "Số tiền phạt vắng không phép không được âm"),
  tax_brackets: z.string().optional(), // JSON string, validated separately
}).superRefine((data, ctx) => {
  // Cross-field: Work Start < Work End
  if (data.work_start_time >= data.work_end_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Giờ vào làm phải sớm hơn giờ tan làm",
      path: ["work_start_time"],
    });
  }

  // Tax Brackets: validate JSON and each bracket
  if (data.tax_brackets) {
    try {
      const brackets = JSON.parse(data.tax_brackets);
      if (!Array.isArray(brackets)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Biểu thuế lũy tiến không hợp lệ",
          path: ["tax_brackets"],
        });
        return;
      }
      for (let i = 0; i < brackets.length; i++) {
        const result = TaxBracketSchema.safeParse(brackets[i]);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Bậc thuế ${i + 1}: ${result.error.issues[0].message}`,
            path: ["tax_brackets"],
          });
          return;
        }
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Biểu thuế lũy tiến không hợp lệ (JSON lỗi)",
        path: ["tax_brackets"],
      });
    }
  }
});

export type SettingsFormValues = z.infer<typeof SettingsSchema>;
