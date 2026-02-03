import { z } from "zod";

export const AssetSchema = z.object({
  id: z.coerce.number().optional().nullable(),
  name: z.string().min(1, "Tên tài sản là bắt buộc"),
  asset_tag: z.string().min(1, "Mã tài sản là bắt buộc"),
  purchase_date: z.string().min(1, "Ngày mua là bắt buộc"),
  purchase_cost: z.coerce.number().min(0, "Giá trị không được là số âm"),
  status: z.enum(["Available", "In Use", "Broken", "Lost", "Liquidated"]).default("Available"),
});

export type AssetFormValues = z.infer<typeof AssetSchema>;
