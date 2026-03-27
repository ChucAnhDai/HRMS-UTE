import PublicHeader from "@/components/layout/PublicHeader";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ | HCMUTE HRM System",
  description: "Trang chủ hệ thống quản lý nhân sự HCMUTE",
};

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="bg-[#f5f6f8] text-[#111318] transition-colors duration-200">
      <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Top Navigation */}
        {/* Top Navigation */}
        <PublicHeader user={user} />

        {/* Hero Section */}
        <section className="relative bg-white pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col gap-6 lg:w-1/2 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0d59f2]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  v2.0 đã sẵn sàng
                </div>
                <h1 className="text-[#111318] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.02em]">
                  Hệ thống Quản lý Nhân sự{" "}
                  <span className="text-[#0d59f2]">Toàn diện</span>
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-[540px]">
                  Tối ưu hóa dữ liệu nhân viên, bảng lương và chấm công trên một
                  nền tảng bảo mật duy nhất. Phù hợp cho mọi doanh nghiệp.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#0d59f2] text-white text-base font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                    Bắt đầu dùng thử
                  </button>
                  <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-white border border-gray-200 text-[#111318] text-base font-bold hover:bg-gray-50 transition-all">
                    Liên hệ ngay
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {/* Placeholder Avatars */}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-500">
                      B
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-bold text-gray-500">
                      C
                    </div>
                  </div>
                  <p>Được tin dùng bởi hơn 10,000 chuyên gia nhân sự</p>
                </div>
              </div>

              {/* Right Visual */}
              <div className="lg:w-1/2 w-full relative">
                {/* Decorative blur */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-green-400/20 rounded-full blur-[80px]"></div>

                <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden aspect-4/3 group perspective-1000 transform transition-transform hover:scale-[1.01]">
                  {/* Mockup Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white rounded text-[10px] px-2 py-1 text-gray-400 flex-1 mx-4 text-center">
                      hrm.dashboard.com
                    </div>
                  </div>

                  {/* Mockup Body */}
                  <div className="p-6 bg-white h-full">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-bold text-lg">
                          Tổng quan Hệ thống
                        </h3>
                        <p className="text-xs text-gray-400">
                          Chào mừng trở lại, Quản lý.
                        </p>
                      </div>
                      <button className="bg-[#0d59f2] text-white text-xs px-3 py-1.5 rounded">
                        Xuất báo cáo
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Tổng số nhân viên
                        </div>
                        <div className="text-2xl font-bold text-[#0d59f2]">
                          1,248
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Đúng giờ
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          96%
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Nhân viên mới
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          24
                        </div>
                      </div>
                    </div>
                    {/* Pseudo Chart */}
                    <div className="h-32 w-full bg-linear-to-r from-blue-50 to-white rounded-lg border border-dashed border-gray-200 flex items-end justify-between px-4 pb-2 gap-2">
                      <div className="w-full bg-blue-200 h-[40%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-300 h-[60%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-400 h-[30%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-500 h-[80%] rounded-t-sm"></div>
                      <div className="w-full bg-[#0d59f2] h-[65%] rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-[#111318] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em] mb-4">
                Giải pháp quản lý nhân sự toàn diện
              </h2>
              <p className="text-slate-600 text-lg">
                Bộ công cụ tích hợp giúp bạn làm việc khoa học,
                chuyên nghiệp và luôn tập trung vào giá trị cốt lõi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Feature 1 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Quản lý nhân viên
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Tập trung hồ sơ, tài liệu và lịch sử nhân sự
                    tại một nơi duy nhất.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Chấm công
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Theo dõi thời gian, quản lý ca làm và xử lý nghỉ phép dễ dàng.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">Bảng lương</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Tự động hóa tính toán lương và thuế một cách chính xác.
                  </p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    shield_person
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Phân quyền & Bảo mật
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Quy định quyền truy cập để bảo vệ dữ liệu nhạy cảm của doanh nghiệp.
                  </p>
                </div>
              </div>
              {/* Feature 5 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">Báo cáo & Phân tích</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Theo dõi tiến độ với các biểu đồ trực quan theo thời gian thực.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#f5f6f8]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h2 className="text-[#111318] text-3xl font-bold leading-tight mb-4">
                    Tập trung vào con người, không phải giấy tờ.
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Thay thế các bảng tính phức tạp bằng hệ thống tự động.
                    Dành thời gian cho các nhiệm vụ quan trọng hơn.
                  </p>
                </div>
                <ul className="flex flex-col gap-5">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Giảm 80% khối lượng công việc thủ công
                      </h4>
                      <p className="text-sm text-slate-500">
                        Tự động hóa tuyển dụng, nghỉ phép và
                        tính toán lương hàng tháng.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Nâng cao hiệu suất làm việc
                      </h4>
                      <p className="text-sm text-slate-500">
                        Nhân viên có thể chủ động cập nhật và xem
                        thông tin cá nhân của mình.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Tuân thủ đúng quy định
                      </h4>
                      <p className="text-sm text-slate-500">
                        Luôn cập nhật các thay đổi mới nhất về
                        luật lao động và các quy định về thuế.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full bg-white h-64 rounded-xl shadow-lg flex items-center justify-center text-gray-300 font-bold text-2xl">
                Hình ảnh minh họa
              </div>
            </div>
          </div>
        </section>

        {/* Target Users Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="text-center mb-16">
              <h2 className="text-[#111318] text-3xl font-bold mb-4">
                Phù hợp cho mọi vai trò
              </h2>
              <p className="text-slate-600">
                Cho dù bạn là quản lý hay nhân viên, chúng tôi đều
                có giải pháp tối ưu dành cho bạn.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* HR Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0d59f2] shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    badge
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  Dành cho Chuyên gia Nhân sự
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Tự động hóa mọi tác vụ thường nhật, quản lý phúc lợi
                  và hồ sơ một cách khoa học & dễ dàng.
                </p>
                <a
                  className="text-[#0d59f2] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Tìm hiểu thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              {/* Manager Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    supervisor_account
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  Dành cho Nhà Quản lý
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Theo dõi hiệu suất của toàn đội, phê duyệt nghỉ phép
                  và tối ưu hóa lịch trình làm việc chỉ trong tích tắc.
                </p>
                <a
                  className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Tìm hiểu thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              {/* SME Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    store
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  Dành cho Doanh nghiệp Nhỏ
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Mở rộng quy mô đội ngũ mà không tốn kém chi phí quản lý.
                  Giá cả hợp lý, triển khai nhanh và luôn đúng quy định.
                </p>
                <a
                  className="text-green-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Tìm hiểu thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-10 px-4 sm:px-10">
          <div className="max-w-[1280px] mx-auto bg-[#0d59f2] rounded-3xl overflow-hidden relative">
            {/* Abstract pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 opacity-20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-8 text-center md:text-left">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Bắt đầu quản lý đội ngũ{" "}
                  <br className="hidden md:block" /> thông minh hơn ngay hôm nay.
                </h2>
                <p className="text-blue-100 text-lg max-w-lg">
                  Hãy tham gia cùng cộng đồng các doanh nghiệp đang bứt phá.
                  Dùng thử miễn phí ngay, không rủi ro.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="bg-white text-[#0d59f2] font-bold py-3.5 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
                  Bắt đầu ngay
                </button>
                <button className="bg-transparent border border-white/30 text-white font-bold py-3.5 px-8 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto">
                  Đăng ký tư vấn
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#111318]">
                  <div className="size-6 text-[#0d59f2] flex items-center justify-center">
                    <span className="material-symbols-outlined"></span>
                  </div>
                  <span className="text-lg font-bold">Hệ thống HRM</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Nâng cao chất lượng cuộc sống công việc cho mọi người.
                  Giải pháp nhân sự toàn diện.
                </p>
              </div>
              {/* Links 1 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Sản phẩm</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Tính năng
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Bảng giá
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Tích hợp
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Cập nhật
                    </a>
                  </li>
                </ul>
              </div>
              {/* Links 2 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Công ty</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Về chúng tôi
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Cơ hội nghề nghiệp
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Báo chí
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
              {/* Links 3 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Tài nguyên</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Blog kiến thức
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Trung tâm trợ giúp
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Hội thảo & Video
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Cộng đồng
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
              <p className="text-xs text-slate-400">
                © 2026 HRM System Inc. Mọi quyền được bảo lưu.
              </p>
              <div className="flex gap-6">
                <a
                  className="text-slate-400 hover:text-[#0d59f2] transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-lg">
                    public
                  </span>
                </a>
                <a
                  className="text-slate-400 hover:text-[#0d59f2] transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-lg">
                    mail
                  </span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
