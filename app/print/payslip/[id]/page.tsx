import { getPayslipDetailAction } from "@/server/actions/payroll-actions";
import PrintButton from "@/components/payroll/PrintButton";
import Link from "next/link";

const formatMoney = (amount: number | string | undefined | null) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount) || 0);
};

export default async function PayslipPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const result = await getPayslipDetailAction(Number(resolvedParams.id));

  if (!result.success) {
    // Explicitly assert error for narrowing
    const errorMsg =
      "error" in result ? result.error : "Đã xảy ra lỗi không xác định";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 font-bold text-xl mb-2">
            Không thể tải phiếu lương
          </div>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <Link
            href="/payroll"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const payslip = result.data;

  const emp = payslip.employees;
  const createdDate = new Date(payslip.created_at || new Date());

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-8 print:p-0 print:bg-white text-black font-serif">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none p-10 print:p-0 relative text-black">
        {/* Print Action */}
        <div className="absolute top-4 right-[-150px] print:hidden">
          <PrintButton />
        </div>

        {/* --- HEADER --- */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold uppercase text-black">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ ABC
            </h1>
            <p className="text-sm text-black">
              Địa chỉ: 123 Đường Số 1, Quận 1, TP.HCM
            </p>
            <p className="text-sm text-black">Mã số thuế: 0123456789</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase text-black">
              PHIẾU LƯƠNG
            </h2>
            <p className="text-base text-black italic">
              Tháng {payslip.month} năm {payslip.year}
            </p>
          </div>
        </div>

        {/* --- EMPLOYEE INFO --- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm text-black">
          <div className="flex border-b border-dotted border-black/30 pb-1">
            <span className="font-bold w-32">Mã nhân viên:</span>
            <span>#{payslip.employee_id}</span>
          </div>
          <div className="flex border-b border-dotted border-black/30 pb-1">
            <span className="font-bold w-32">Bộ phận:</span>

            <span>{emp?.departments?.name || emp?.department_id || "N/A"}</span>
          </div>
          <div className="flex border-b border-dotted border-black/30 pb-1">
            <span className="font-bold w-32">Họ và tên:</span>
            <span className="uppercase font-bold">
              {emp?.last_name} {emp?.first_name}
            </span>
          </div>
          <div className="flex border-b border-dotted border-black/30 pb-1">
            <span className="font-bold w-32">Chức vụ:</span>
            <span>{emp?.job_title || "N/A"}</span>
          </div>
        </div>

        {/* --- SALARY DETAILS TABLE --- */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse border border-black text-black">
            <thead className="bg-gray-100 print:bg-transparent text-black font-bold text-center">
              <tr>
                <th className="border border-black px-3 py-2 w-10">STT</th>
                <th className="border border-black px-3 py-2 text-left">
                  Nội dung
                </th>
                <th className="border border-black px-3 py-2 w-40 text-right">
                  Số tiền (VNĐ)
                </th>
                <th className="border border-black px-3 py-2 w-40">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {/* I. Thu nhập */}
              <tr className="font-bold bg-gray-50 print:bg-transparent">
                <td className="border border-black px-3 py-2 text-center">I</td>
                <td className="border border-black px-3 py-2" colSpan={3}>
                  CÁC KHOẢN THU NHẬP (INCOME)
                </td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">1</td>
                <td className="border border-black px-3 py-2">Lương cơ bản</td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.salary)}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">2</td>
                <td className="border border-black px-3 py-2">
                  Lương làm thêm giờ (OT)
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.ot_salary)}
                </td>
                <td className="border border-black px-3 py-2 text-center">
                  {payslip.ot_hours > 0 ? `${payslip.ot_hours} giờ` : ""}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">3</td>
                <td className="border border-black px-3 py-2">
                  Thưởng & Phụ cấp
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.bonus)}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>
              <tr className="font-bold">
                <td className="border border-black px-3 py-2 text-center"></td>
                <td className="border border-black px-3 py-2 text-right">
                  Tổng thu nhập:
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(
                    Number(payslip.salary) +
                      (Number(payslip.ot_salary) || 0) +
                      (Number(payslip.bonus) || 0),
                  )}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>

              {/* II. Khấu trừ */}
              <tr className="font-bold bg-gray-50 print:bg-transparent">
                <td className="border border-black px-3 py-2 text-center">
                  II
                </td>
                <td className="border border-black px-3 py-2" colSpan={3}>
                  CÁC KHOẢN KHẤU TRỪ (DEDUCTIONS)
                </td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">1</td>
                <td className="border border-black px-3 py-2">
                  Bảo hiểm (BHXH, BHYT, BHTN)
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.social_insurance)}
                </td>
                <td className="border border-black px-3 py-2">10.5%</td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">2</td>
                <td className="border border-black px-3 py-2">Thuế TNCN</td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.tax)}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">3</td>
                <td className="border border-black px-3 py-2">Tạm ứng</td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.advance_amount)}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 text-center">4</td>
                <td className="border border-black px-3 py-2">Phạt / Khác</td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(payslip.penalties)}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>
              <tr className="font-bold">
                <td className="border border-black px-3 py-2 text-center"></td>
                <td className="border border-black px-3 py-2 text-right">
                  Tổng khấu trừ:
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {formatMoney(
                    (payslip.social_insurance || 0) +
                      (payslip.tax || 0) +
                      (payslip.advance_amount || 0) +
                      (payslip.penalties || 0),
                  )}
                </td>
                <td className="border border-black px-3 py-2"></td>
              </tr>

              {/* III. Thực lĩnh */}
              <tr className="font-bold text-base">
                <td className="border border-black px-3 py-3 text-center">
                  III
                </td>
                <td className="border border-black px-3 py-3 uppercase">
                  Thực Lĩnh (NET PAY)
                </td>
                <td className="border border-black px-3 py-3 text-right text-lg">
                  {formatMoney(payslip.net_pay)}
                </td>
                <td className="border border-black px-3 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- FOOTER --- */}
        <div className="mb-12 text-black">
          <p className="text-sm italic mb-2">
            * Mọi thắc mắc về phiếu lương vui lòng liên hệ phòng Kế toán/Nhân sự
            trong vòng 03 ngày làm việc.
          </p>
          {payslip.notes && (
            <div className="text-sm p-3 border border-black border-dashed rounded">
              <strong>Ghi chú:</strong> {payslip.notes}
            </div>
          )}
        </div>

        <div className="flex justify-between text-center px-10 page-break-inside-avoid text-black">
          <div>
            <p className="font-bold text-sm uppercase mb-20">Người lập biểu</p>
            <p className="font-bold text-sm">
              ........................................
            </p>
          </div>
          <div>
            <p className="font-bold text-sm uppercase mb-20">Giám đốc</p>
            <p className="font-bold text-sm">
              ........................................
            </p>
          </div>
          <div>
            <p className="text-sm italic mb-1">
              TP. Hồ Chí Minh, ngày {createdDate.getDate()} tháng{" "}
              {createdDate.getMonth() + 1} năm {createdDate.getFullYear()}
            </p>
            <p className="font-bold text-sm uppercase mb-20">Người nhận</p>
            <p className="font-bold text-sm">
              {emp?.last_name} {emp?.first_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
