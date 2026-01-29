# 📘 TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN PHÁT TRIỂN DỰ ÁN CREXTIO HRM
*(Phiên bản cập nhật dành cho Developer & Maintainer)*

---

## 📑 MỤC LỤC
1.  [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2.  [Kiến Trúc Hệ Thống (System Architecture)](#2-kiến-trúc-hệ-thống)
3.  [Cấu Trúc Thư Mục Chi Tiết (Project Structure)](#3-cấu-trúc-thư-mục-chi-tiết)
4.  [Chi tiết Module: MVC & Service Layer](#4-chi-tiet-mvc-service)
5.  [Phân Tích Core Modules](#5-phân-tích-core-modules)
6.  [Cơ Sở Dữ Liệu (Database Schema)](#6-cơ-sở-dữ-liệu)
7.  [Hướng Dẫn Quy Trình Phát Triển (Development Workflow)](#7-hướng-dẫn-quy-trình-phát-triển)
8.  [Bảo Mật & Phân Quyền (Security & RBAC)](#8-bảo-mật--phân-quyền)
9.  [Setup & Deployment](#9-setup--deployment)

---

## 1. TỔNG QUAN DỰ ÁN

**Crextio HRM** là hệ thống quản lý nhân sự toàn diện, được xây dựng để giải quyết bài toán quản lý con người, tài chính và tài sản cho doanh nghiệp vừa và nhỏ (SMEs).

### 🎯 Mục tiêu
- **Tự động hóa**: Giảm 80% thời gian tính lương và chốt công thủ công.
- **Minh bạch hóa**: Nhân viên có thể tự theo dõi lương, phép, và gửi yêu cầu trực tuyến.
- **Trải nghiệm UX/UI**: Giao diện hiện đại, tối giản, loading cực nhanh nhờ Server Components.

### 🛠 Tech Stack (Công nghệ lõi)
*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org) - React Server Components.
*   **Language**: [TypeScript 5.x](https://www.typescriptlang.org) (Strict Mode).
*   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com) (Alpha/Beta features enabled).
*   **Database**: [PostgreSQL](https://postgresql.org) (hosted on Supabase).
*   **Auth**: Supabase Auth (JWT & Session based).
*   **UI Library**: Shadcn UI + Radix Primitives + Lucide Icons.
*   **Deployment**: Vercel.

---

## 2. KIẾN TRÚC HỆ THỐNG SYSTEM ARCHITECTURE

Dự án áp dụng mô hình **Modular Monolithic** kết hợp **Layered Architecture**. Tuy là một codebase duy nhất (Monolith) nhưng được chia tách rõ ràng thành các lớp, giúp dễ dàng tách Module thành Microservices nếu sau này scale lên.

### 📐 Sơ đồ luồng dữ liệu (Data Flow Diagram)

```mermaid
graph TD
    User([Người dùng]) -->|Tương tác UI| View[Lớp Giao Diện (Presentation)]
    
    subgraph "Server Side (Bảo Mật)"
        View -->|Server Actions| Ctrl[Lớp Điều Khiển (Controller)]
        Ctrl -->|Validate & Check Quyền| Svc[Lớp Dịch Vụ (Service Layer)]
        Svc -->|Logic Nghiệp Vụ| Repo[Lớp Truy Xuất (Repository Layer)]
        Repo -->|SQL Query / ORM| DB[(Database)]
    end

    DB -->|Dữ liệu thô| Repo
    Repo -->|DTO (Data Objects)| Svc
    Svc -->|Business Models| Ctrl
    Ctrl -->|Clean JSON| View
```

### 🧠 Tại sao lại chọn cấu trúc này?
1.  **Separation of Concerns (SOC)**: Tách biệt logic xử lý khỏi giao diện HTML. Frontend Dev làm việc ở `app/`, Backend Dev làm việc ở `server/`.
2.  **Security by Design**: 100% logic nghiệp vụ và truy vấn DB nằm ở `server/`, không bao giờ bị leak xuống Client bundle.
3.  **Testability**: Dễ dàng viết Unit Test cho `Service` và `Repository` vì chúng là các hàm Pure Function, không phụ thuộc vào React Context hay Hook.

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT

Đây là bản đồ chi tiết của dự án. Mỗi file và thư mục đều có mục đích cụ thể.

```text
E:\CNKT_CNPM
├── 📂 .github/                     # CI/CD Workflow (GitHub Actions)
├── 📂 .vscode/                     # Cấu hình IDE (Extensions, Settings đồng bộ cho team)
├── 📂 app/                         # [PRESENTATION LAYER] - Giao diện & Routing
│   ├── 📂 (auth)/                  # [Route Group] Các trang Authentication
│   │   ├── 📂 login/               # Trang đăng nhập
│   │   │   └── 📜 page.tsx         # UI Login Form
│   │   └── 📂 callback/            # Xử lý OAuth callback từ Google/Github
│   ├── 📂 (dashboard)/             # [Route Group] Khu vực nội bộ (Cần đăng nhập)
│   │   ├── 📂 calendar/            # Module: Lịch & Chấm công
│   │   ├── 📂 employees/           # Module: Quản lý Hồ sơ nhân viên
│   │   │   ├── 📂 [id]/            # [Dynamic Route] Chi tiết nhân viên
│   │   │   ├── 📂 create/          # Trang thêm mới
│   │   │   └── 📜 page.tsx         # Trang danh sách (Table/Grid View)
│   │   ├── 📂 salary-advances/     # Module: Tạm ứng lương
│   │   │   └── 📜 page.tsx         # Bảng duyệt yêu cầu tạm ứng
│   │   ├── 📂 payroll/             # Module: Tính lương & Payslip
│   │   ├── 📂 settings/            # Module: Cấu hình hệ thống
│   │   ├── 📜 layout.tsx           # Layout Chính: Sidebar + Header Wrapper
│   │   └── 📜 page.tsx             # Dashboard Home (KPI & Charts)
│   ├── 📜 error.tsx                # Error Boundary (Xử lý lỗi toàn cục)
│   ├── 📜 globals.css              # Global Styles & Tailwind Directives
│   ├── 📜 layout.tsx               # Root Layout (Fonts, Providers, Metadata)
│   └── 📜 not-found.tsx            # Trang 404 Custom
│
├── 📂 components/                  # [UI LIBRARY] - Thư viện Components tái sử dụng
│   ├── 📂 ui/                      # Atomic Components (Base Level)
│   │   ├── 📜 button.tsx           # Button (Variants: outline, ghost, link...)
│   │   ├── 📜 card.tsx             # Card Container
│   │   ├── 📜 dialog.tsx           # Modal/Popup Engine
│   │   ├── 📜 input.tsx            # Input Fields
│   │   └── ... (30+ components)
│   ├── 📂 dashboard/               # Widget cho trang chủ Dashboard
│   │   └── 📜 StatCard.tsx         # Thẻ hiển thị số liệu KPI
│   ├── 📂 employees/               # Components nghiệp vụ Employee
│   │   ├── 📂 forms/               # Các Form nhập liệu phức tạp
│   │   │   ├── 📜 BasicInfoFields.tsx
│   │   │   └── 📜 JobInfoFields.tsx
│   │   └── 📜 EmployeeTable.tsx    # Bảng danh sách nhân viên
│   └── 📂 layout/                  # Layout Components
│       ├── 📜 Header.tsx           # Top Navigation Bar
│       └── 📜 Sidebar.tsx          # Main Navigation Menu
│
├── 📂 server/                      # [BACKEND CORE] - Trái tim của hệ thống
│   ├── 📂 actions/                 # [CONTROLLERS] - Server Actions
│   │   ├── 📜 create-employee.ts   # Xử lý Logic tạo nhân viên
│   │   ├── 📜 setting-actions.ts   # Xử lý cập nhật cấu hình
│   │   └── 📜 salary-advance.ts    # Xử lý duyệt tạm ứng
│   ├── 📂 services/                # [SERVICES] - Business Logic Rules
│   │   ├── 📜 payroll-service.ts   # Engine tính lương (Phức tạp nhất)
│   │   └── 📜 auth-service.ts      # Logic mã hóa Password, tạo User
│   └── 📂 repositories/            # [DATA ACCESS] - SQL & Data Query
│       ├── 📜 employee-repo.ts     # Các hàm Query bảng Employees
│       ├── 📜 payroll-repo.ts      # Các hàm Query bảng Payrolls
│       └── 📜 setting-repo.ts      # Các hàm Query bảng Settings
│
├── 📂 lib/                         # [UTILITIES] - Thư viện hỗ trợ
│   ├── 📜 supabase.server.ts       # Supabase Client Singleton (Server-side)
│   ├── 📜 utils.ts                 # Helper Functions (cn, formatMoney...)
│   └── 📜 auth-helpers.ts          # Auth Middleware Helper
│
├── 📂 types/                       # [TYPESCRIPT] - Định nghĩa kiểu dữ liệu
│   └── 📜 index.ts                 # Global Interfaces (Employee, Payslip...)
│
├── 📂 public/                      # Static Assets (Images, Fonts)
├── 📂 ddl/                         # Database Definition Language
│   ├── 📂 migrations/              # SQL Migration Scripts
│   └── 📜 schema.sql               # Full Database Schema
│
├── 📜 middleware.ts                # Next.js Middleware (Auth Guard)
├── 📜 next.config.ts               # Next.js Configuration
├── 📜 tailwind.config.ts           # Tailwind Configuration
└── 📜 package.json                 # Project Meta & Dependencies
```

---

## 4. CHI TIẾT MODULE: MVC & SERVICE LAYER <a name="4-chi-tiet-mvc-service"></a>

### 4.1. Áp dụng MVC trong Next.js (Modern Approach)

Truyền thống Next.js không ép buộc MVC, nhưng để code "sạch", chúng tôi tổ chức lại như sau:

| Thành phần MVC | Tương ứng trong Project | Chức năng cụ thể |
| :--- | :--- | :--- |
| **Model (M)** | `server/repositories/*` | Đại diện cho Dữ liệu. (Ví dụ: Class `EmployeeRepository` chứa phương thức `findById`). |
| **View (V)** | `app/*` & `components/*` | Giao diện hiển thị. Nhận props từ Server Actions và render HTML. |
| **Controller (C)** | `server/actions/*` | Điều phối luồng tin. Nhận request từ View, validate, gọi Service, trả kết quả. |

### 4.2. Vai trò sống còn của Service Layer (`server/services/`)

Đây là nơi chứa **"Business Logic"** (Nghiệp vụ). 
Nhiều người mới thường viết logic ngay trong Controller (Server Action). Đó là sai lầm!

**Ví dụ thực tế: Tính lương nhân viên**
Nếu bạn viết logic tính lương trong `payroll-actions.ts`, thì sau này bạn muốn viết một tính năng "Tự động tính lương vào ngày 30 hàng tháng" (Cron Job), bạn sẽ **không thể tái sử dụng** logic đó được.

Do đó, chúng tôi tách ra `PayrollService.ts`:
```typescript
class PayrollService {
  // Hàm này thuần túy tính toán, không quan tâm request đến từ đâu (Web hay CronJob)
  async calculateSalary(employeeId: string, month: number) {
     const base = await EmployeeRepo.getSalary(employeeId);
     const bonus = ...
     return base + bonus; 
  }
}
```

=> **Kết luận**:
- **Repository**: Chỉ biết "Lấy dữ liệu" (SQL).
- **Service**: Biết "Xử lý dữ liệu" (Logic).
- **Action**: Biết "Điều phối" (Input -> Service -> Output).

---

## 5. PHÂN TÍCH CORE MODULES

### 5.1. Module Employees (Quản Lý Nhân Sự)
Đây là module nền tảng, quản lý vòng đời của nhân viên.
*   **Chức năng**: Tạo mới, Sửa thông tin, Xóa (Soft delete), Tìm kiếm.
*   **Điểm đặc biệt**:
    *   Sử dụng `EmployeeProfileView` để hiển thị view 360 độ về nhân viên.
    *   Dữ liệu được validate chặt chẽ qua Zod trước khi xuống DB.
*   **Files Chính**: `app/employees/*`, `server/repositories/employee-repo.ts`.

### 5.2. Module Payroll (Tính Lương)
Module phức tạp nhất với logic tính toán động.
*   **Quy trình tính**:
    1.  User bấm "Tính lương tháng X".
    2.  Hệ thống lấy danh sách nhân viên Active.
    3.  Lấy dữ liệu hợp đồng (Lương cơ bản).
    4.  Lấy dữ liệu Chấm công (Số ngày công thực tế).
    5.  Tính toán: `Gross = Base Salary/26 * Work Days`.
    6.  Trừ các khoản: Tạm ứng, BHXH, Thuế TNCN.
    7.  Ra lương `Net`.
*   **Files Chính**: `server/services/payroll-service.ts`.

### 5.3. Module Salary Advances (Tạm Ứng Lương)
*   **Chức năng**: Cho phép nhân viên xin ứng lương trước.
*   **Quy trình**:
    1.  Nhân viên gửi yêu cầu -> Trạng thái `Pending`.
    2.  Manager/Admin nhận thông báo -> Bấm `Approve` hoặc `Reject`.
    3.  Nếu `Approve` -> Khi tính lương tháng đó, hệ thống tự động trừ khoản này.
*   **Bảo mật**: Sử dụng RLS để đảm bảo nhân viên chỉ thấy yêu cầu của mình.

---

## 6. CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Dự án sử dụng quan hệ ràng buộc chặt chẽ (Foreign Keys) để đảm bảo toàn vẹn dữ liệu.

### 🗂 Các Bảng Chính (Database Tables)

| Tên Bảng | Mô tả | Quan hệ chính |
| :--- | :--- | :--- |
| `employees` | Lưu thông tin hồ sơ nhân viên | `id` (PK), `department_id` (FK) |
| `departments` | Danh mục phòng ban | `id` (PK) |
| `contracts` | Hợp đồng lao động | `employee_id` (FK -> employees) |
| `payrolls` | Bảng lương hàng tháng | `employee_id` (FK -> employees) |
| `salary_advances` | Yêu cầu tạm ứng lương | `employee_id` (FK -> employees) |
| `leave_requests` | Đơn xin nghỉ phép | `employee_id` (FK -> employees) |
| `users` (auth) | Bảng user của Supabase Auth | Liên kết với `employees` qua `email` |

### 🔒 Chính sách Bảo mật (RLS Policies)
Chúng tôi không dùng `service_role` bừa bãi. Mọi truy vấn từ Client đều phải thông qua RLS.
*   `SELECT`: Nhân viên chỉ xem được dòng dữ liệu có `employee_id = current_user.id`.
*   `INSERT/UPDATE`: Chỉ có role `ADMIN` hoặc `MANAGER` mới được phép ghi vào các bảng nhạy cảm.

---

## 7. HƯỚNG DẪN QUY TRÌNH PHÁT TRIỂN

Mỗi khi muốn thêm 1 tính năng mới (ví dụ: Module Khen thưởng), hãy tuân thủ quy trình 5 bước:

1.  **Step 1 (DB)**: Tạo bảng `rewards` trong Database (file `ddl/migrations/create_rewards.sql`).
2.  **Step 2 (Type)**: Định nghĩa interface `Reward` trong `types/index.ts`.
3.  **Step 3 (Repository)**: Viết các hàm `getRewards`, `createReward` trong `server/repositories/reward-repo.ts`.
4.  **Step 4 (Service/Action)**: Viết Business Logic (nếu có) và Server Action để gọi xuống Repo.
5.  **Step 5 (UI)**: Tạo giao diện tại `app/(dashboard)/rewards/page.tsx`, sử dụng các component từ `components/ui`.

---

## 8. BẢO MẬT & PHÂN QUYỀN

### 8.1. Authentication (Xác thực)
*   Sử dụng Supabase Auth (Email/Password).
*   Session được lưu trong HttpOnly Cookie (An toàn hơn LocalStorage).

### 8.2. Authorization (Phân quyền)
Hệ thống phân quyền dựa trên Role (RBAC):
*   **ADMIN**: "Thần thánh" - Làm được mọi thứ.
*   **MANAGER**: "Quản lý" - Duyệt đơn, xem báo cáo, nhưng không được xóa nhân viên.
*   **EMPLOYEE**: "Nhân viên" - Chỉ xem thông tin của mình.

Code kiểm tra quyền mẫu:
```typescript
// Trong server/actions/delete-employee.ts
export async function deleteEmployee(id: string) {
  const user = await getCurrentUser();
  if (user.role !== 'ADMIN') {
    throw new Error("Bạn không có quyền thực hiện thao tác này!");
  }
  // ... logic xóa
}
```

---

## 9. SETUP & DEPLOYMENT

### Yêu cầu môi trường
*   Node.js 18+
*   NPM hoặc PNPM

### Các bước cài đặt
1.  **Clone Source Code**:
    ```bash
    git clone https://github.com/your-repo/cnkt-cnpm.git
    cd cnkt-cnpm
    ```
2.  **Cài dependencies**:
    ```bash
    npm install
    ```
3.  **Cấu hình biến môi trường**:
    Tạo file `.env.local` với nội dung:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
    SUPABASE_SERVICE_ROLE_KEY=eyJh... (Chỉ dùng server-side)
    ```
4.  **Chạy Development Server**:
    ```bash
    npm run dev
    ```
    Truy cập: `http://localhost:3000`

---
*Tài liệu được cập nhật lần cuối: 29/01/2026 bởi Team Dev.*