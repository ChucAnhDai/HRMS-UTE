#  Báo cáo Tổng kết Dự án HR Management System (CNPM)

## 1. Tổng quan
Dự án xây dựng hệ thống quản lý nhân sự (HRM) hiện đại, tập trung vào trải nghiệm người dùng tối ưu (UX/UI), sử dụng các công nghệ mới nhất. Hệ thống bao gồm đầy đủ các module cốt lõi để vận hành một doanh nghiệp vừa và nhỏ.

- **Công nghệ chính**: 
  - **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide Icons.
  - **Backend**: Next.js Server Actions.
  - **Database**: Supabase (PostgreSQL).
  - **Kiến trúc**: Mô hình 3 lớp (Presentation -> Business Logic -> Data Access).

---

## 2. Các Tính năng Đã Hoàn thiện

### A. Dashboard (Tổng quan)
- **Giao diện**: Hiển thị thẻ thống kê (Tổng nhân viên, Đơn nghỉ phép, Lương thực chi).
- **Biểu đồ**: Tích hợp biểu đồ thống kê cơ bản.
- **Hoạt động**: Chuyển hướng nhanh đến các chức năng chính.

### B. Quản lý Nhân viên (Employees)
- **Danh sách**: 
  - Hiển thị 2 chế độ: List (Bảng chi tiết) và Grid (Thẻ card hiện đại).
  - Tìm kiếm real-time theo tên, email, chức vụ.
  - Hiển thị Avatar (Ảnh thật hoặc tự động tạo từ tên).
- **Thêm mới**: Form nhập liệu đầy đủ thông tin (Họ tên, SĐT, Ngày vào làm, Lương CB, MST, Người phụ thuộc...).
- **Chỉnh sửa**: Cập nhật thông tin nhân viên, chức vụ (`job_title`), phòng ban.
- **Hồ sơ chi tiết (Profile)**: 
  - **Overview**: Xem thông tin cá nhân.
  - **Documents**: Quản lý và xem lịch sử Hợp đồng lao động.
  - **Payroll**: Xem lịch sử phiếu lương của riêng nhân viên đó.
  - **Time Off**: Lịch sử nghỉ phép cá nhân.

### C. Quản lý Hợp đồng (Contracts)
- **Danh sách**: Quản lý tất cả hợp đồng trong công ty.
- **Tạo mới**: Tạo hợp đồng cho nhân viên, tự động tính toán trạng thái hiệu lực.
- **Tính năng**: Xem trước file đính kèm (giả lập), theo dõi ngày hết hạn.

### D. Chấm công & Lịch làm việc (Calendar & Attendance)
- **Giao diện Lịch**: Sử dụng `FullCalendar` hiển thị trực quan các sự kiện.
- **Chấm công nhanh**: Sidebar hỗ trợ tìm kiếm nhân viên và Check-in/Check-out ngay lập tức.
- **Hiển thị**: Phân màu rõ ràng cho các trạng thái (Đi làm, Đi muộn, Nghỉ phép).

### E. Quản lý Nghỉ phép (Leave)
- **Quy trình duyệt đơn**: Nhân viên gửi đơn -> Quản lý/HR duyệt hoặc từ chối.
- **Form Modal**: Gửi đơn ngay trên giao diện mà không cần chuyển trang.
- **Tính toán**: Hệ thống tự tính số ngày nghỉ dựa trên ngày bắt đầu - kết thúc.

### F. Tính Lương (Payroll)
- **Tự động tính toán**: Tính lương dựa trên:
  - Lương cơ bản (từ Hợp đồng hiệu lực).
  - Số ngày công thực tế (từ Chấm công).
  - Số ngày nghỉ phép có lương (từ Đơn nghỉ phép đã duyệt).
- **Phiếu lương**: Hiển thị chi tiết các khoản thu nhập, khấu trừ.


### G. Quản lý Tài sản (Instruments)
- **Danh sách thiết bị**: Quản lý Laptop, Màn hình, thiết bị văn phòng.
- **Cấp phát**: Theo dõi tình trạng (Sẵn sàng/Hỏng/Đang sử dụng).
- **Thao tác nhanh**: Form thêm mới thiết bị ngay trên danh sách.

### H. Phân quyền (Authorization & RBAC)
- **3 cấp độ quyền**:
  - **ADMIN**: Toàn quyền (Tạo/Sửa/Xóa nhân viên, Cấp tài khoản, Tính lương).
  - **MANAGER**: Duyệt đơn nghỉ phép, Xem báo cáo, Quản lý nhân viên trong phòng ban.
  - **EMPLOYEE**: Xem hồ sơ cá nhân, Gửi đơn nghỉ phép, Xem lịch sử lương.
- **Trang Profile cá nhân** (`/profile`): Nhân viên chỉ xem được thông tin của chính mình.
- **Bảo vệ Server Actions**: Các thao tác nhạy cảm (Tạo/Xóa nhân viên, Cấp tài khoản) được kiểm tra quyền trước khi thực hiện.
- **UI động**: Ẩn/Hiện các nút và menu theo quyền của user hiện tại.

---


### 3. Phân tích Kiến trúc & Quyết định Kỹ thuật

#### 3.1. Mô hình MVC trong Next.js App Router
**Câu trả lời là: CÓ, chúng ta đang áp dụng triệt để MVC.**
Mặc dù Next.js không ép buộc, nhưng để đảm bảo tính chuyên nghiệp và dễ bảo trì, chúng ta đã chia code theo cấu trúc sau:

| Thành phần MVC | Trong Project này | Nhiệm vụ cụ thể |
| :--- | :--- | :--- |
| **Model (M)** | `server/repositories/*` | Chịu trách nhiệm giao tiếp trực tiếp với Database (Supabase). Chỉ thực hiện các lệnh CRUD (Create, Read, Update, Delete), không chứa logic nghiệp vụ phức tạp. |
| **View (V)** | `app/*` & `components/*` | Giao diện người dùng (UI). Nhận dữ liệu từ Controller (Server Actions) để hiển thị và gửi tương tác của user ngược lại Controller. |
| **Controller (C)** | `server/actions/*` | Tiếp nhận yêu cầu từ View (ví dụ: submit form), kiểm tra quyền (Auth), và gọi Service để xử lý. |


#### 3.2. Vai trò đặc biệt của Service Layer (Lớp Nghiệp vụ)
Chúng ta có thêm module `server/services/*` nằm giữa Controller và Model. Đây là "Bộ não" của hệ thống.
Tại sao gọi Server Actions rồi Repository luôn mà cần Service?

*   **Logic phức tạp**: Ví dụ khi "Tạo nhân viên", không chỉ đơn giản là `insert` vào bảng. Logic nghiệp vụ yêu cầu:
    1.  Kiểm tra xem email cá nhân đã tồn tại chưa? (Service gọi Repo check).
    2.  Tự động tạo tài khoản đăng nhập tương ứng bên Auth system (Service xử lý).
    3.  Tính toán phụ cấp dựa trên chức vụ (Service tính toán).
    4.  Sau đó mới lưu vào DB (Service gọi Repo lưu).
    
*   **Luồng dữ liệu (Data Flow) chuẩn**:
    `View (UI)` -> `Action (Validates Input)` -> `Service (Business Logic)` -> `Repository (SQL Query)` -> `Database`

Nhờ tách Service, logic tính toán (ví dụ: công thức tính thuế TNCN) có thể được tái sử dụng ở nhiều nơi (trong bảng lương, trong báo cáo dự toán...) mà không phụ thuộc vào giao diện.

#### 3.3. Tại sao chọn cấu trúc thư mục phân tách (`server/` vs `app/`) thay vì cấu trúc cũ?

**Cấu trúc cũ (Pages Router / Mixed Logic):**
Trong các dự án Next.js thế hệ trước (Pages Router), logic thường bị đặt rải rác:
- Backend nằm trong `pages/api/*` (khó quản lý type-safety).
- Query Database nằm trực tiếp trong `getServerSideProps` của UI.
- **Hệ quả**: Khi dự án lớn lên, logic nghiệp vụ bị phân mảnh, khó tái sử dụng (ví dụ: logic tính lương phải viết lại ở nhiều nơi), và khó test.

**Cấu trúc hiện tại (App Router + Layered Architecture):**
Chúng ta kiên quyết tách thư mục `server/` ra khỏi `app/`.
1.  **Tách biệt tuyệt đối (Decoupling)**:
    - `app/` chỉ chứa code UI (trình bày).
    - `server/` chứa toàn bộ logic "trí tuệ" của ứng dụng.
    - **Lợi ích**: Nếu sau này cần thay đổi giao diện từ Web sang Mobile App, ta giữ nguyên được thư mục `server/`. Nếu cần đổi Database từ Supabase sang MySQL, ta chỉ cần sửa `server/repositories`, không cần sửa một dòng code UI nào.
    
2.  **Type-Safety từ đầu đến cuối**:
    - Không cần gọi API qua URL string (dễ sai sót) như `fetch('/api/user')`.
    - Server Action cho phép gọi hàm trực tiếp `createEmployee(data)` với đầy đủ gợi ý code TypeScript, đảm bảo không bao giờ sai tên biến.

3.  **Bảo mật & Hiệu năng**: 
    - Code trong `server/` được đảm bảo không bao giờ bị "leak" (lộ) xuống trình duyệt client, giảm dung lượng tải trang và tăng bảo mật tuyệt đối.

#### 3.4. Ranh giới FE/BE và Tối ưu hiệu suất trong Next.js App Router
Trước đây, FE (React) và BE (Node.js) là 2 thế giới tách biệt giao tiếp qua API REST ful. Dự án này sử dụng **Next.js App Router** để xóa nhòa ranh giới đó, mang lại hiệu suất vượt trội:

1.  **React Server Components (RSC)**:
    - Các trang Dashboard, Danh sách nhân viên chạy hoàn toàn trên Server.
    - **Lợi ích**: Code kết nối Database (`db.query`) chạy ngay trong Component. Không cần gọi API `fetch`, không có độ trễ mạng (Network Latency) giữa Client-Server.

2.  **Zero Bundle Size**:
    - Các thư viện nặng xử lý logic (như thư viện tính toán) nằm ở Server, không bị gửi xuống trình duyệt của người dùng. Giúp trang web tải cực nhanh.

3.  **Server Actions**:
    - Thay vì viết API backend riêng, ta viết hàm Javascript bình thường và export `use server`. Next.js tự động biến nó thành API endpoint an toàn.

=> **Kết luận**: Cấu trúc này giúp chúng ta có tốc độ phát triển của Frontend nhưng sức mạnh và bảo mật của Backend.

#### 3.5. Sơ đồ Cây Thư mục (Project Folder Structure)

```
cnkt_cnpm/
├── app/                              # [VIEW] Presentation Layer (Giao diện) - Chạy trên Server & Client
│   ├── (dashboard)/                  # Group Route cho các trang Dashboard
│   │   ├── employees/                # Module Quản lý Nhân viên
│   │   │   ├── [id]/                 # Dynamic Route (Chi tiết NV, Sửa, Xóa)
│   │   │   ├── create/               # Trang tạo mới
│   │   │   └── page.tsx              # Trang danh sách
│   │   ├── calendar/                 # Module Lịch làm việc
│   │   ├── leave/                    # Module Nghỉ phép
│   │   ├── payroll/                  # Module Lương
│   │   ├── instruments/              # Module Tài sản
│   │   ├── layout.tsx                # Layout chung (Sidebar, Header)
│   │   └── page.tsx                  # Trang chủ Statistics
│   └── layout.tsx                    # Root Layout (Fonts, Global providers)
│
├── components/                       # [VIEW] Reusable UI Components
│   ├── employees/                    # Các component con của module Employee (Form, Table, Profile)
│   ├── payroll/                      # Component bảng lương
│   ├── leave/                        # Component form xin nghỉ, danh sách đơn
│   ├── dashboard/                    # Các thẻ thống kê, biểu đồ
│   └── ui/                           # Các component cơ sở (Button, Input, Modal...)
│
├── server/                           # [BACKEND] Business Logic & Data Access Layer
│   ├── actions/                      # [CONTROLLER] Server Actions (Entry point từ UI)
│   │   ├── create-employee.ts        # Xử lý submit form tạo NV
│   │   ├── calculate-payroll.ts      # Xử lý logic tính lương
│   │   └── ...
│   ├── services/                     # [SERVICE] Business Logic (Nghiệp vụ phức tạp)
│   │   ├── employee-service.ts       # Validate, xử lý logic nhân sự
│   │   ├── payroll-service.ts        # Công thức tính lương, thuế
│   │   └── ...
│   └── repositories/                 # [MODEL] Data Access (Truy xuất Database)
│       ├── employee-repo.ts          # Các câu lệnh SQL/Query chọc bảng employees
│       ├── payroll-repo.ts           # Các câu lệnh chọc bảng payrolls
│       └── ...
│
├── lib/                              # Utilities
│   ├── supabase.server.ts            # Cấu hình Supabase Client (Server-side)
│   └── utils.ts                      # Hàm hỗ trợ (format tiền, ngày tháng)
│
├── ddl/                              # Database Definition Scripts (SQL)
│   ├── seed_departments.sql          # Data mẫu
│   └── instruments.sql               # Tạo bảng
│
└── types/                            # TypeScript Definitions (Interfaces)
    └── database.ts                   # Type generate tự động từ Supabase
```

---

## 4. Cơ sở dữ liệu (Database Changes)
Các thay đổi quan trọng đã thực hiện trên Supabase:
1.  **Tables**: Tạo đầy đủ các bảng `employees`, `contracts`, `payrolls`, `leave_requests`, `attendances`, `assets`, `departments`.
2.  **RLS Policies**: Đã chạy script `grant_all_permissions.sql` để cấp quyền truy cập đầy đủ cho service role (tạm thời cho giai đoạn dev).
3.  **Seed Data**: Đã tạo dữ liệu mẫu cho Phòng ban (`seed_departments.sql`).
4.  **Updates**:
    - Thêm cột `job_title`, `tax_code`, `dependents` vào bảng `employees`.
    - Thêm các cột liên quan đến tính lương vào bảng `payrolls`.

---

## 5. Hướng dẫn Chạy dự án
1.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
2.  **Cấu hình môi trường**:
    - Tạo file `.env.local`
    - Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3.  **Chạy server development**:
    ```bash
    npm run dev
    ```
4.  **Truy cập**: [http://localhost:3000](http://localhost:3000)

---