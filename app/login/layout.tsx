import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | HCMUTE HRM System",
  description: "Đăng nhập vào hệ thống quản lý nhân sự HCMUTE",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
