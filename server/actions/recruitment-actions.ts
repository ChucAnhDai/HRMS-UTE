"use server";

import { revalidatePath } from "next/cache";
import { recruitmentRepo } from "../repositories/recruitment-repo";
import {
  JobOpeningSchema,
  CandidateSchema,
  JobOpeningFormValues,
  CandidateFormValues,
} from "@/lib/schemas/recruitment.schema";
import { ZodError } from "zod";

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// --- JOB OPENINGS ACTIONS ---

export async function createJobAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData: JobOpeningFormValues = {
      title: formData.get("title") as string,
      department_id: Number(formData.get("department_id")),
      status: formData.get("status") as "Open" | "Closed" | "Draft",
      description: formData.get("description") as string,
    };

    const validatedData = JobOpeningSchema.parse(rawData);

    await recruitmentRepo.createJobOpening({
      title: validatedData.title,
      department_id: validatedData.department_id,
      status: validatedData.status,
      description: validatedData.description,
    });

    revalidatePath("/recruitment");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors,
        error: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống",
    };
  }
}

export async function updateJobAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData: JobOpeningFormValues = {
      title: formData.get("title") as string,
      department_id: Number(formData.get("department_id")),
      status: formData.get("status") as "Open" | "Closed" | "Draft",
      description: formData.get("description") as string,
    };

    const validatedData = JobOpeningSchema.parse(rawData);

    await recruitmentRepo.updateJobOpening(id, {
      title: validatedData.title,
      department_id: validatedData.department_id,
      status: validatedData.status,
      description: validatedData.description,
    });

    revalidatePath("/recruitment");
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors,
        error: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống",
    };
  }
}

export async function deleteJobAction(id: number): Promise<ActionState> {
  try {
    await recruitmentRepo.deleteJobOpening(id);
    revalidatePath("/recruitment");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa tin tuyển dụng này",
    };
  }
}

// --- CANDIDATE ACTIONS ---

export async function submitApplicationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData: CandidateFormValues = {
      job_opening_id: Number(formData.get("job_opening_id")),
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      resume_path: (formData.get("resume_path") as string) || "", // Tạm thời dùng string path
    };

    // Validate
    const validatedData = CandidateSchema.parse(rawData);

    // TODO: Xử lý upload file thật ở đây nếu cần, hiện tại giả định client đã upload và gửi path hoặc bỏ qua file

    await recruitmentRepo.createCandidate({
      job_opening_id: validatedData.job_opening_id,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      email: validatedData.email,
      phone: validatedData.phone,
      resume_path: validatedData.resume_path,
      status: "Applied",
    });

    // Revalidate public page could be useful if we show counts
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors,
        error: "Thông tin ứng tuyển không hợp lệ. Vui lòng kiểm tra lại.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi nộp đơn",
    };
  }
}

export async function getJobCandidatesAction(jobId: number) {
  try {
    const candidates = await recruitmentRepo.getCandidatesByJob(jobId);
    return { success: true, data: candidates };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể tải danh sách ứng viên",
    };
  }
}

export async function updateCandidateStatusAction(id: number, status: string) {
  try {
    await recruitmentRepo.updateCandidateStatus(id, status);
    revalidatePath("/recruitment"); // Revalidate to update counts if needed
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể cập nhật trạng thái",
    };
  }
}
