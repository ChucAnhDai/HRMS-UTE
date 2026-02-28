"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { CurrentUser } from "@/types/auth";
import { getUserAvatarUrl } from "@/lib/utils";
import UserAvatar from "@/components/common/UserAvatar";

export default function PublicHeader({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const avatarSrc = getUserAvatarUrl(user?.avatar);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f1f5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-3">
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link href="/" className="flex items-center gap-3 text-[#111318]">
            <div className="size-8 flex items-center justify-center">
              <img
                src="/ute_logo.png"
                alt="HCMUTE Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <h2 className="text-[#111318] text-xl font-bold leading-tight tracking-[-0.015em]">
              HCMUTE <br /> HRM System
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
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      avatarUrl={avatarSrc}
                      name={user.name || user.email}
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name || user.email}
                    </span>
                  </div>
                  <Link
                    href={user.role === "EMPLOYEE" ? "/profile" : "/dashboard"}
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0d59f2] text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                  >
                    <span className="truncate">
                      {user.role === "EMPLOYEE" ? "Hồ sơ cá nhân" : "Dashboard"}
                    </span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-200 text-[#111318] text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate">Đăng nhập</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0d59f2] text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                  >
                    <span className="truncate">Bắt đầu</span>
                  </Link>
                </>
              )}
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
