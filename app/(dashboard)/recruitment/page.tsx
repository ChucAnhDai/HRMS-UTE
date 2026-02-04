import { recruitmentRepo } from "@/server/repositories/recruitment-repo";
import { departmentRepo } from "@/server/repositories/department-repo";
import JobOpeningsTable from "@/components/recruitment/JobOpeningsTable";

export default async function RecruitmentPage() {
  const [jobs, departments] = await Promise.all([
    recruitmentRepo.getJobOpenings(),
    departmentRepo.getDepartments(),
  ]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <JobOpeningsTable jobs={jobs || []} departments={departments || []} />
    </div>
  );
}
