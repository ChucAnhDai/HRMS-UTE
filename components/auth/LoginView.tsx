import Link from 'next/link';
import Image from 'next/image';

export default function LoginView() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F0E6] p-4 font-sans">
      {/* Main Card Container */}
      <div className="bg-[#FAF9F5] w-full max-w-[1200px] min-h-[550px] lg:min-h-[600px] rounded-2xl lg:rounded-[32px] shadow-xl lg:shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Close Button (Decorative) */}
        <button className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* LEFT SIDE: Form */}
        <div className="w-full lg:w-5/12 p-6 lg:p-8 flex flex-col justify-between relative bg-gradient-to-br from-[#FAF9F5] to-[#F2EFE5]">
          {/* Logo / Brand */}
          <div>
            <div className="inline-flex px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-medium bg-transparent">
              Crextio
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Đăng nhập vào tài khoản</h1>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">Đăng nhập để quản lý hệ thống của bạn</p>

            <form className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400 ml-4">Email</label>
                <input
                  type="email"
                  placeholder="Email đăng nhập"
                  className="w-full px-6 py-3 rounded-full bg-[#f0eee6] border-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-medium text-sm lg:text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-gray-400 ml-4">Mật khẩu</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Mật khẩu đăng nhập"
                    className="w-full px-6 py-3 rounded-full bg-[#f0eee6] border-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-medium pr-12 text-sm lg:text-base"
                  />
                  <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#FCD34D] hover:bg-[#fbbf24] text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-lg"
              >
                Submit
              </button>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-full border border-gray-300 hover:bg-white transition-colors text-sm font-medium text-gray-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-.74.71.1 1.35.41 1.91.9-4.21 2.5-3.02 9.59 1.91 10.94-.49 1.34-1.07 2.27-1.9 3.1zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Apple
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-full border border-gray-300 hover:bg-white transition-colors text-sm font-medium text-gray-700">
                   <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-8">
            <p className="hidden xs:block">Have any account? <Link href="/register" className="underline hover:text-gray-800">Sign up</Link></p>
            <p className="block xs:hidden"><Link href="/register" className="underline hover:text-gray-800">Sign up</Link></p>
            <Link href="/terms" className="underline hover:text-gray-800">Điều khoản và điều kiện</Link>
          </div>
        </div>

        {/* RIGHT SIDE: Image & Overlays - Hidden on Mobile */}
        <div className="hidden lg:block w-full lg:w-7/12 relative bg-gray-200 overflow-hidden">
        
           {/* Background Image */}
           <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
               alt="Team working" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-black/10"></div>
           </div>

           {/* Floating UI Elements (Glassmorphism) */}
           <div className="absolute inset-0 z-10 p-12 flex flex-col justify-between">
              
              {/* Top Card: Task Review */}
              <div className="self-start transform translate-y-8 animate-fade-in-up">
                <div className="bg-gray-800/80 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl max-w-xs border border-white/10">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-medium text-gray-300">Đánh giá nhiệm vụ với nhóm</span>
                     <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                   </div>
                   <div className="text-sm font-semibold mb-1">09:30am-10:00am</div>
                   <div className="flex -space-x-2 mt-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border border-gray-700 bg-gray-600"></div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Middle Right: Avatars Circle */}
              <div className="absolute top-1/2 right-12 transform -translate-y-1/2">
                 <div className="relative w-32 h-32">
                    <div className="absolute top-0 right-0 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg"><img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-full h-full object-cover"/></div>
                    <div className="absolute bottom-2 right-8 w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg z-10"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-full h-full object-cover"/></div>
                    <div className="absolute top-8 left-0 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg"><img src="https://i.pravatar.cc/150?u=a04258114e29026702d" className="w-full h-full object-cover"/></div>
                 </div>
              </div>

              {/* Bottom: Calendar & Meeting */}
              <div className="mt-auto mb-12 flex items-end gap-4 overflow-x-auto no-scrollbar">
                  {/* Calendar Strip */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white min-w-[300px]">
                     <div className="flex justify-between text-center gap-4 text-sm">
                        <div className="opacity-50">Sun<br/><span className="text-xl font-bold">22</span></div>
                        <div className="opacity-50">Mon<br/><span className="text-xl font-bold">23</span></div>
                        <div className="opacity-100 font-bold bg-white/20 rounded-lg py-1 px-2">Tue<br/><span className="text-xl">24</span></div>
                        <div className="opacity-50">Wed<br/><span className="text-xl font-bold">25</span></div>
                        <div className="opacity-50">Thu<br/><span className="text-xl font-bold">26</span></div>
                     </div>
                  </div>

                  {/* Daily Meeting Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-2xl min-w-[200px] transform translate-y-8">
                     <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-gray-800">Cuộc họp hàng ngày</span>
                         <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                     </div>
                     <div className="text-gray-500 text-xs mb-3">12:00pm-01:00pm</div>
                     <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-300 overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${i}00`} className="w-full h-full object-cover"/>
                           </div>
                        ))}
                     </div>
                  </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
