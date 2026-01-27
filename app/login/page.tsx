'use client'

import React, { useState, useTransition } from 'react'
import { Mail, Lock, Eye, Facebook, Chrome, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { loginAction } from '@/server/actions/auth-actions';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  async function handleSubmit(formData: FormData) {
     setError('');
     startTransition(async () => {
        const result = await loginAction(null, formData);
        if (result?.error) {
           setError(result.error);
        }
     });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-2 group min-h-[700px]">
        
        {/* Left Side: Branding/Visual */}
        <div className="hidden lg:flex bg-blue-600 p-16 flex-col justify-between relative overflow-hidden">
           {/* Background Effects */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

           <div className="relative z-10 flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                 <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight uppercase">HR System</span>
           </div>

           <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black text-white leading-tight">Quản trị Nhân sự <br/>Thông minh.</h2>
              <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-sm">Nền tảng quản lý nhân sự, chấm công và tính lương toàn diện cho doanh nghiệp hiện đại.</p>
              
              <div className="flex gap-4 pt-10">
                 <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 flex-1">
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest">Nhân sự</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 flex-1">
                    <p className="text-2xl font-bold text-white">99%</p>
                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest">Hài lòng</p>
                 </div>
              </div>
           </div>

           <div className="relative z-10 flex items-center gap-4">
              <div className="flex -space-x-4">
                 {[1, 2, 3, 4].map(n => (
                   <div key={n} className="w-10 h-10 rounded-full border-4 border-blue-600 bg-white/20 ring-2 ring-blue-600/20 flex items-center justify-center text-xs font-bold text-white">U{n}</div>
                 ))}
              </div>
              <p className="text-xs font-bold text-blue-100">Tham gia cùng cộng đồng HR</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 md:p-20 flex flex-col justify-center">
           <div className="space-y-2 mb-12">
              <h3 className="text-3xl font-black text-gray-900">Chào mừng trở lại!</h3>
              <p className="text-gray-500 font-medium">Vui lòng đăng nhập để truy cập vào hệ thống.</p>
           </div>

           <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
                 <div className="relative group/input">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 transition-colors" />
                    <input name="email" type="email" required placeholder="name@company.com" className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all shadow-inner text-black" />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mật khẩu</label>
                    <Link href="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Quên?</Link>
                 </div>
                 <div className="relative group/input">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 transition-colors" />
                    <input name="password" type="password" required placeholder="••••••••" className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all shadow-inner text-black" />
                    <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                       <Eye className="h-5 w-5" />
                    </button>
                 </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                 <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-0 cursor-pointer" />
                 <label htmlFor="remember" className="text-sm font-bold text-gray-600 cursor-pointer select-none">Ghi nhớ đăng nhập</label>
              </div>

              <button disabled={isPending} className="w-full py-5 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                 {isPending ? 'Đang xử lý...' : 'Đăng nhập ngay'} <ArrowRight className="h-5 w-5" />
              </button>
           </form>

           <div className="mt-12 space-y-8">
              <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Hoặc tiếp tục với</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="flex items-center justify-center gap-3 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all font-bold text-sm text-gray-900">
                    <Chrome className="h-5 w-5 text-red-500" /> Google
                 </button>
                 <button type="button" className="flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-2xl shadow-sm hover:bg-blue-700 transition-all font-bold text-sm text-white">
                    <Facebook className="h-5 w-5" /> Facebook
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
