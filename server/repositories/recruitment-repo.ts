import { createClient } from "@/lib/supabase.server";
import { Database } from "@/types/database";

type JobOpeningInsert = Database["public"]["Tables"]["job_openings"]["Insert"];
type JobOpeningUpdate = Database["public"]["Tables"]["job_openings"]["Update"];

type CandidateInsert = Database["public"]["Tables"]["candidates"]["Insert"];

export const recruitmentRepo = {
  // --- JOB OPENINGS ---

  async getJobOpenings(filters?: { status?: string; department_id?: number }) {
    const supabase = await createClient();
    let query = supabase
      .from("job_openings")
      .select(`
        *,
        departments (
          name
        ),
        candidates:candidates(count)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.department_id) {
      query = query.eq("department_id", filters.department_id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  async getJobOpeningById(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_openings")
      .select(`
        *,
        departments (
          name
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createJobOpening(data: JobOpeningInsert) {
    const supabase = await createClient();
    const { data: res, error } = await supabase
      .from("job_openings")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return res;
  },

  async updateJobOpening(id: number, data: JobOpeningUpdate) {
    const supabase = await createClient();
    const { data: res, error } = await supabase
      .from("job_openings")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return res;
  },

  async deleteJobOpening(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from("job_openings").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- CANDIDATES ---

  async createCandidate(data: CandidateInsert) {
    const supabase = await createClient();
    const { data: res, error } = await supabase
      .from("candidates")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return res;
  },

  async getCandidatesByJob(jobId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("job_opening_id", jobId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async updateCandidateStatus(id: number, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("candidates")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};
