import { z } from "zod";

export const DepartmentSchema = z.object({
  name: z.string().min(1, "Tên phòng ban là bắt buộc").max(255, "Tên phòng ban quá dài"),
});

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>;
