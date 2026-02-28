import { payrollService } from "@/server/services/payroll-service";
import Link from "next/link";
import { ArrowLeft, Printer, Download, User, Building } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "Chi tiết lương | HCMUTE" };


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PayslipPage({ params }: PageProps) {
  const { id } = await params;
  const payroll = await payrollService.getPayslipById(Number(id));

  if (!payroll) {
    return <div className="p-8">Không tìm thấy bảng lương.</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const { employees } = payroll;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/payroll"
            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
          </Link>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
              <Printer className="w-4 h-4" /> In phiếu
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" /> Tải về PDF
            </button>
          </div>
        </div>

        {/* Payslip Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">PHIẾU LƯƠNG</h1>
                <p className="text-blue-100 mt-1">Tháng: {payroll.month}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100 opacity-80">Mã phiếu</p>
                <p className="font-mono font-medium">
                  {String(payroll.id).slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Employee Info */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md -mt-12 bg-gray-200">
                <Image
                  src={
                    employees?.avatar ||
                    `https://ui-avatars.com/api/?name=${employees?.first_name}+${employees?.last_name}&background=random`
                  }
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="-mt-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {employees?.last_name} {employees?.first_name}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />{" "}
                    {employees?.departments?.name || "---"}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Nhân viên chính thức
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-8">
              {/* Thu nhập */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Thu nhập
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lương cơ bản</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(payroll.salary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phụ cấp</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thưởng</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(payroll.bonus || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chi tiết công */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Chi tiết công
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày làm việc chuẩn</span>
                    <span className="font-medium text-gray-900">26</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày đi làm thực tế</span>
                    <span className="font-medium text-gray-900">---</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày nghỉ có phép</span>
                    <span className="font-medium text-gray-900">---</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Khấu trừ</span>
                <span className="font-medium text-red-600">
                  -{" "}
                  {formatCurrency(
                    payroll.salary +
                      (payroll.ot_salary || 0) +
                      (payroll.bonus || 0) -
                      payroll.net_pay,
                  )}
                </span>
              </div>

              <div className="flex justify-between items-end mt-4 p-4 bg-gray-50 rounded-lg">
                <span className="font-bold text-gray-800">Thực lĩnh</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(payroll.net_pay)}
                </span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                Phiếu lương này được tạo tự động bởi hệ thống.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
