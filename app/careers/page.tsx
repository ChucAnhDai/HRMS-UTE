import { recruitmentRepo } from "@/server/repositories/recruitment-repo";
import JobCard from "@/components/recruitment/JobCard";
import Footer from "../../components/layout/Footer";
import PublicHeader from "@/components/layout/PublicHeader";

import { getCurrentUser } from "@/lib/auth-helpers";

export default async function CareersPage() {
  const user = await getCurrentUser();
  const jobs = await recruitmentRepo.getJobOpenings({ status: "Open" });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PublicHeader user={user} />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Cơ hội Nghề nghiệp
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tham gia cùng đội ngũ của chúng tôi để xây dựng những sản phẩm công
            nghệ đột phá. Chúng tôi luôn chào đón những tài năng mới!
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Các vị trí đang mở
          </h2>
          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 italic text-gray-500">
              Hiện tại chưa có vị trí nào đang tuyển dụng. Vui lòng quay lại
              sau!
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
