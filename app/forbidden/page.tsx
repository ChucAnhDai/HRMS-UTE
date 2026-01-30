"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-red-100">
              <ShieldAlert
                className="w-20 h-20 text-red-600"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-red-600">403</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>

        {/* Info */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Nếu bạn cần quyền truy cập, vui lòng liên hệ:{" "}
            <a
              href="mailto:admin@company.com"
              className="text-red-600 hover:underline font-medium"
            >
              admin@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
