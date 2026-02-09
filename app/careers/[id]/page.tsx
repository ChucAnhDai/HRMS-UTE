import { notFound } from "next/navigation";
import { recruitmentRepo } from "@/server/repositories/recruitment-repo";
import ApplicationForm from "@/components/recruitment/ApplicationForm";
import Footer from "../../../components/layout/Footer";
import PublicHeader from "@/components/layout/PublicHeader";
import { Briefcase, Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth-helpers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  const resolvedParams = await params;
  const job = await recruitmentRepo.getJobOpeningById(
    Number(resolvedParams.id),
  );

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PublicHeader user={user} />

      {/* Breadcrumb / Back Link */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            href="/careers"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Danh sách
          </Link>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="mb-6">
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 mb-4 hover:bg-blue-100">
                  {job.departments?.name || "General"}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 line-clamp-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Hồ Chí Minh, VN
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> Full-time
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{" "}
                    {new Date(job.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="prose prose-blue max-w-none text-gray-700">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Mô tả công việc
                </h3>
                <div className="whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Yêu cầu & Quyền lợi
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Tham gia phát triển các dự án phần mềm quy mô lớn.</li>
                    <li>Môi trường làm việc trẻ trung, năng động.</li>
                    <li>
                      Được đào tạo bài bản về quy trình làm việc và công nghệ
                      mới.
                    </li>
                    <li>Lương thưởng hấp dẫn, review 2 lần/năm.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ApplicationForm jobId={job.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
