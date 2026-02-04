import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-blue-600">HRM Project</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Giải pháp quản lý nhân sự toàn diện, giúp doanh nghiệp tối ưu hóa
              quy trình và nâng cao hiệu suất làm việc.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Tài nguyên</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Cộng đồng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Kết nối</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-600">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-700">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HRM Project. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
