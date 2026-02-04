import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  job: {
    id: number;
    title: string;
    description: string | null;
    departments: { name: string } | null;
  };
}

export default function JobCard({ job }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">Phòng ban:</span>{" "}
            {job.departments?.name}
          </div>
        </div>
      </div>

      <div className="text-gray-600 mb-6 line-clamp-2 text-sm">
        {job.description}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Could add more badges here like 'Full-time' if we had that data */}
        <div className="flex-1">
          <div className="text-xs text-gray-500">
            {/* Placeholder for tags if needed */}
            Không yêu cầu kinh nghiệm
          </div>
        </div>
        <Button asChild className="bg-blue-900 hover:bg-blue-800 rounded-lg">
          <Link href={`/careers/${job.id}`}>Xem Chi tiết & Ứng tuyển</Link>
        </Button>
      </div>
    </div>
  );
}
