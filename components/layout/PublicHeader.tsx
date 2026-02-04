"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f1f5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-3">
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link href="/" className="flex items-center gap-3 text-[#111318]">
            <div className="size-8 text-[#0d59f2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]!">
                dataset
              </span>
            </div>
            <h2 className="text-[#111318] text-xl font-bold leading-tight tracking-[-0.015em]">
              HRM System
            </h2>
          </Link>

          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6 lg:gap-9">
              <Link
                className={cn(
                  "text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors",
                  pathname === "/features" && "text-[#0d59f2]",
                )}
                href="#"
              >
                Features
              </Link>
              <Link
                className={cn(
                  "text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors",
                  pathname === "/pricing" && "text-[#0d59f2]",
                )}
                href="#"
              >
                Pricing
              </Link>
              <Link
                className={cn(
                  "text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors",
                  pathname.startsWith("/careers") && "text-[#0d59f2]",
                )}
                href="/careers"
              >
                Tuyển dụng
              </Link>
            </nav>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-200 text-[#111318] text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                <span className="truncate">Login</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0d59f2] text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
              >
                <span className="truncate">Get Started</span>
              </Link>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
