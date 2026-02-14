-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 23, 2026 lúc 01:08 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hrm_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assets`
--

CREATE TABLE `assets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `asset_tag` varchar(255) NOT NULL,
  `purchase_date` date NOT NULL,
  `purchase_cost` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Available',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assets`
--

INSERT INTO `assets` (`id`, `name`, `asset_tag`, `purchase_date`, `purchase_cost`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Laptop DELL-001', 'DELL-001', '2025-11-15', 21990000.00, 'Available', '2025-11-15 08:57:47', '2025-11-16 15:54:01'),
(2, 'Laptop MSI Katana B13 VFK', 'MSI-B13-VFK', '2025-11-15', 28990000.00, 'Available', '2025-11-15 08:59:25', '2025-11-15 17:21:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `asset_assignments`
--

CREATE TABLE `asset_assignments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `asset_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_date` date NOT NULL,
  `returned_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `asset_assignments`
--

INSERT INTO `asset_assignments` (`id`, `asset_id`, `employee_id`, `assigned_date`, `returned_date`, `created_at`, `updated_at`) VALUES
(7, 1, 6, '2025-11-16', '2025-11-16', '2025-11-16 15:52:27', '2025-11-16 15:52:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attendances`
--

INSERT INTO `attendances` (`id`, `employee_id`, `date`, `check_in_time`, `check_out_time`, `status`, `created_at`, `updated_at`) VALUES
(7, 5, '2025-11-20', NULL, NULL, 'On Leave', '2025-11-13 08:20:12', '2025-11-13 08:20:12'),
(8, 5, '2025-11-21', NULL, NULL, 'On Leave', '2025-11-13 08:20:12', '2025-11-13 08:20:12'),
(9, 5, '2025-11-17', NULL, NULL, 'On Leave', '2025-11-13 08:21:34', '2025-11-13 08:21:34'),
(10, 5, '2025-11-13', '15:44:28', '15:44:32', 'Present', '2025-11-13 08:44:28', '2025-11-13 08:44:32'),
(11, 5, '2025-11-14', NULL, NULL, 'On Leave', '2025-11-13 08:48:48', '2025-11-13 08:48:48'),
(17, 6, '2025-11-14', '20:08:28', '20:08:30', 'Present', '2025-11-14 13:08:28', '2025-11-14 13:08:30'),
(18, 7, '2025-11-23', '08:00:00', '20:00:00', 'Present', '2025-11-23 03:03:47', '2025-11-23 03:08:21'),
(19, 7, '2025-11-28', '08:30:00', '17:00:00', 'Present', '2025-11-27 17:42:50', '2025-11-27 17:43:43'),
(20, 7, '2025-12-04', '16:29:45', '16:29:47', 'Present', '2025-12-04 09:29:45', '2025-12-04 09:29:47'),
(21, 7, '2026-01-23', '18:53:58', '18:54:11', 'Present', '2026-01-23 11:53:58', '2026-01-23 11:54:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-admin@example.com|127.0.0.1', 'i:1;', 1765719832),
('laravel-cache-admin@example.com|127.0.0.1:timer', 'i:1765719832;', 1765719832),
('laravel-cache-sang1@gmail.com|127.0.0.1', 'i:1;', 1763289823),
('laravel-cache-sang1@gmail.com|127.0.0.1:timer', 'i:1763289823;', 1763289823);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `candidates`
--

CREATE TABLE `candidates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_opening_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `candidates`
--

INSERT INTO `candidates` (`id`, `job_opening_id`, `first_name`, `last_name`, `email`, `phone`, `cv_path`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 'Anh Đài', 'Chúc', 'chucanhdai@gmail.com', '0123456787', 'cvs/bR6VkRdkN30IV6nh0zzAU5ZNSfwcvHms7zbEnVUE.pdf', 'Pending', '2025-11-16 06:23:12', '2025-11-16 07:20:39'),
(3, 2, 'Sơn Bá', 'Lương', 'luongsonba@gmail.com', '0147852369', 'cvs/nv1uCTwi5QanJneloVd0FIdSWhmU1YAGpJG5UkW5.pdf', 'Pending', '2025-11-16 09:13:06', '2025-11-16 09:13:06'),
(5, 1, 'Quang Sang', 'Bùi', 'sang@gmail.com', '0123456789', 'cvs/SucSDY1IeToT2aIYyiRtpNb9bEfBzefaWanTqZOq.pdf', 'Pending', '2025-11-23 03:01:46', '2025-11-23 03:01:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `contract_type` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `departments`
--

INSERT INTO `departments` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'Phòng IT', '2025-11-11 22:19:04', '2025-11-11 22:19:04'),
(3, 'Phòng Nhân Sự', '2025-11-11 22:19:14', '2025-11-11 22:19:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `hire_date` date NOT NULL,
  `probation_end_date` date DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `annual_leave_quota` tinyint(4) NOT NULL DEFAULT 12,
  `sick_leave_quota` tinyint(4) NOT NULL DEFAULT 5,
  `other_leave_quota` tinyint(4) NOT NULL DEFAULT 5,
  `tax_code` varchar(255) DEFAULT NULL,
  `dependents` tinyint(4) NOT NULL DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `employment_status` varchar(255) NOT NULL DEFAULT 'Active',
  `termination_date` date DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `last_name`, `email`, `phone`, `hire_date`, `probation_end_date`, `salary`, `annual_leave_quota`, `sick_leave_quota`, `other_leave_quota`, `tax_code`, `dependents`, `avatar`, `employment_status`, `termination_date`, `department_id`, `user_id`, `created_at`, `updated_at`) VALUES
(5, 'Thanh Phước', 'Nguyễn', 'phuoc@gmail.com', '0123456789', '2025-11-13', NULL, 15000000.00, 12, 5, 5, NULL, 1, NULL, 'Active', NULL, 3, 3, '2025-11-13 04:42:04', '2025-11-14 18:09:08'),
(6, 'Chí HIếu', 'Đặng', 'hieu@gmail.com', '0147258369', '2025-11-14', NULL, 50000000.00, 12, 5, 5, NULL, 0, NULL, 'Active', NULL, 3, 6, '2025-11-13 18:36:07', '2025-11-23 03:00:12'),
(7, 'Quang Sang', 'Bùi', 'sang@gmail.com', '0123456789', '2025-11-23', '2025-12-23', 9000000.00, 12, 5, 5, NULL, 0, NULL, 'Active', NULL, 2, 8, '2025-11-23 03:02:45', '2025-11-23 03:02:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `holidays`
--

CREATE TABLE `holidays` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `holidays`
--

INSERT INTO `holidays` (`id`, `name`, `date`, `created_at`, `updated_at`) VALUES
(1, 'Tết Dương lịch', '2026-01-01', '2025-11-13 15:14:58', '2025-11-13 15:14:58'),
(3, 'Test lễ', '2025-11-30', '2025-11-13 15:43:01', '2025-11-13 15:43:01'),
(4, 'Test lễ', '2025-11-29', '2025-11-13 15:43:12', '2025-11-13 15:43:12'),
(5, 'Test lễ để test logic phạt - vắng', '2025-11-12', '2025-11-13 16:35:06', '2025-11-13 16:35:06'),
(6, 'test tiếp', '2025-11-14', '2025-11-13 16:35:31', '2025-11-13 16:35:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_openings`
--

CREATE TABLE `job_openings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Open',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `job_openings`
--

INSERT INTO `job_openings` (`id`, `department_id`, `title`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Lập trình app', 'Yê cầu 3 năm kinh nghiệm', 'Open', '2025-11-16 06:05:11', '2025-11-16 08:58:56'),
(2, 3, 'Cần tuyển 3 bạn HR', 'Không yêu cầu kinh nghiệm', 'Open', '2025-11-16 09:11:48', '2025-11-17 15:55:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `action_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_12_043548_create_departments_table', 1),
(5, '2025_11_12_050508_create_employees_table', 2),
(6, '2025_11_12_053839_add_role_to_users_table', 3),
(7, '2025_11_12_063612_add_user_id_to_employees_table', 4),
(8, '2025_11_12_084909_create_attendances_table', 5),
(9, '2025_11_12_161350_create_leave_requests_table', 6),
(10, '2025_11_13_013337_add_salary_to_employees_table', 7),
(11, '2025_11_13_114530_create_payslips_table', 8),
(12, '2025_11_13_123313_modify_payslips_table_for_details', 9),
(13, '2025_11_13_130803_create_settings_table', 10),
(14, '2025_11_13_135855_add_leave_quotas_to_employees_table', 11),
(15, '2025_11_13_155404_add_tax_info_to_employees_table', 12),
(16, '2025_11_13_170316_rename_deductions_in_payslips_table', 13),
(17, '2025_11_13_220503_create_holidays_table', 14),
(18, '2025_11_14_121818_add_avatar_to_employees_table', 15),
(19, '2025_11_14_125309_create_notifications_table', 16),
(20, '2025_11_14_165735_add_action_log_to_leave_requests_table', 17),
(21, '2025_11_15_123927_create_contracts_table', 18),
(22, '2025_11_15_154358_create_assets_table', 19),
(23, '2025_11_15_154450_create_asset_assignments_table', 20),
(24, '2025_11_15_231057_add_probation_end_date_to_employees_table', 21),
(25, '2025_11_16_120746_create_job_openings_table', 22),
(26, '2025_11_16_120812_create_candidates_table', 22),
(27, '2025_11_16_144740_add_department_id_to_job_openings_table', 23),
(28, '2025_11_16_220546_add_offboarding_to_employees_table', 24),
(29, '2025_11_17_232108_add_status_to_users_table', 25),
(30, '2025_11_19_115519_create_salary_histories_table', 26),
(31, '2025_11_20_002743_create_overtime_requests_table', 27),
(32, '2025_11_21_005042_add_ot_to_payslips_table', 28),
(33, '2025_11_23_103742_create_salary_advances_table', 29),
(34, '2025_11_28_020708_add_advance_amount_to_payslips_table', 30),
(35, '2025_12_04_154852_create_salary_adjustments_table', 31);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('4e90b178-97f5-4b2a-aa85-72211a641cf3', 'App\\Notifications\\NewLeaveRequest', 'App\\Models\\User', 2, '{\"leave_request_id\":19,\"employee_name\":\"B\\u00f9i Quang Sang\",\"leave_type\":\"Ngh\\u1ec9 \\u1ed1m\",\"message\":\"v\\u1eeba n\\u1ed9p m\\u1ed9t \\u0111\\u01a1n xin ngh\\u1ec9 ph\\u00e9p m\\u1edbi.\"}', '2025-11-14 10:04:49', '2025-11-14 10:04:38', '2025-11-14 10:04:49'),
('5abd6d10-4257-4cc4-a217-2e8eaac97212', 'App\\Notifications\\NewLeaveRequest', 'App\\Models\\User', 2, '{\"leave_request_id\":18,\"employee_name\":\"B\\u00f9i Quang Sang\",\"leave_type\":\"Ngh\\u1ec9 \\u1ed1m\",\"message\":\"v\\u1eeba n\\u1ed9p m\\u1ed9t \\u0111\\u01a1n xin ngh\\u1ec9 ph\\u00e9p m\\u1edbi.\"}', '2025-11-14 10:04:08', '2025-11-14 10:04:05', '2025-11-14 10:04:08'),
('87e686f3-f224-4ba7-93b9-81652efeaa4b', 'App\\Notifications\\NewLeaveRequest', 'App\\Models\\User', 2, '{\"leave_request_id\":16,\"employee_name\":\"B\\u00f9i Quang Sang\",\"leave_type\":\"Ngh\\u1ec9 ph\\u00e9p n\\u0103m\",\"message\":\"v\\u1eeba n\\u1ed9p m\\u1ed9t \\u0111\\u01a1n xin ngh\\u1ec9 ph\\u00e9p m\\u1edbi.\"}', '2025-11-14 09:55:15', '2025-11-14 09:45:15', '2025-11-14 09:55:15'),
('b248e5f5-4b49-4a22-9b68-16258a8d95be', 'App\\Notifications\\NewLeaveRequest', 'App\\Models\\User', 2, '{\"leave_request_id\":17,\"employee_name\":\"B\\u00f9i Quang Sang\",\"leave_type\":\"Ngh\\u1ec9 ph\\u00e9p n\\u0103m\",\"message\":\"v\\u1eeba n\\u1ed9p m\\u1ed9t \\u0111\\u01a1n xin ngh\\u1ec9 ph\\u00e9p m\\u1edbi.\"}', '2025-11-14 09:56:14', '2025-11-14 09:56:00', '2025-11-14 09:56:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `overtime_requests`
--

CREATE TABLE `overtime_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `hours` double NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('admin@gmail.com', '$2y$12$RPmymzRua3HAGeJqKeukSudo5Vnm36K4ByBLo/zZff98HEkayl3Ue', '2025-11-16 10:42:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payslips`
--

CREATE TABLE `payslips` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `ot_hours` double NOT NULL DEFAULT 0,
  `ot_salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `social_insurance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `penalties` decimal(10,2) NOT NULL DEFAULT 0.00,
  `advance_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_pay` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Generated',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payslips`
--

INSERT INTO `payslips` (`id`, `employee_id`, `month`, `year`, `salary`, `ot_hours`, `ot_salary`, `bonus`, `tax`, `social_insurance`, `penalties`, `advance_amount`, `net_pay`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(73, 5, 11, 2025, 15000000.00, 0, 0.00, 0.00, 0.00, 1575000.00, 4400000.00, 0.00, 9025000.00, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 22 ngày.\n', '2025-11-27 19:26:41', '2025-11-27 19:26:41'),
(74, 6, 11, 2025, 50000000.00, 0, 0.00, 0.00, 4220000.00, 5250000.00, 4400000.00, 0.00, 36130000.00, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 22 ngày.\n', '2025-11-27 19:26:41', '2025-11-27 19:26:41'),
(75, 7, 11, 2025, 9000000.00, 7, 536931.82, 500000.00, 0.00, 945000.00, 4400000.00, 500000.00, 4191931.82, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 22 ngày.\r\nTrừ tạm ứng: 3,000,000 đ.', '2025-11-27 19:26:41', '2025-11-27 19:40:50'),
(94, 5, 12, 2025, 15000000.00, 0, 0.00, 0.00, 0.00, 1575000.00, 5400000.00, 0.00, 8025000.00, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 27 ngày.\n', '2025-12-04 10:07:38', '2025-12-04 10:07:38'),
(95, 6, 12, 2025, 50000000.00, 0, 0.00, 7000000.00, 5587500.00, 5250000.00, 5400000.00, 0.00, 40762500.00, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 27 ngày.\nThưởng khác: 7,000,000 đ.\n', '2025-12-04 10:07:38', '2025-12-04 10:07:38'),
(96, 7, 12, 2025, 9000000.00, 0, 0.00, 0.00, 0.00, 945000.00, 5400000.00, 0.00, 2655000.00, 'Generated', 'Phạt đi trễ: 0 lần. Phạt vắng: 27 ngày.\n', '2025-12-04 10:07:38', '2025-12-04 10:07:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary_adjustments`
--

CREATE TABLE `salary_adjustments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `salary_adjustments`
--

INSERT INTO `salary_adjustments` (`id`, `employee_id`, `type`, `amount`, `date`, `reason`, `status`, `created_at`, `updated_at`) VALUES
(4, 6, 'bonus', 7000000.00, '2025-12-04', 'Làm Hỏng Thiết bị', 'Paid', '2025-12-04 10:07:29', '2025-12-04 10:07:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary_advances`
--

CREATE TABLE `salary_advances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `salary_advances`
--

INSERT INTO `salary_advances` (`id`, `employee_id`, `date`, `amount`, `reason`, `status`, `created_at`, `updated_at`) VALUES
(5, 7, '2025-11-28', 500000.00, 'Hết tiền', 'Paid', '2025-11-27 19:26:19', '2025-11-27 19:40:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary_histories`
--

CREATE TABLE `salary_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `old_salary` decimal(10,2) DEFAULT NULL,
  `new_salary` decimal(10,2) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `changed_at` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'late_penalty', '50000', NULL, NULL),
(2, 'absent_penalty', '200000', NULL, NULL),
(3, 'social_insurance_rate', '10.5', NULL, NULL),
(4, 'weekend_days', '0', NULL, NULL),
(5, 'tax_personal_deduction', '11000000', NULL, NULL),
(6, 'tax_dependent_deduction', '4400000', NULL, NULL),
(7, 'tax_bracket_1_limit', '5000000', NULL, NULL),
(8, 'tax_bracket_1_rate', '5', NULL, NULL),
(9, 'tax_bracket_2_limit', '10000000', NULL, NULL),
(10, 'tax_bracket_2_rate', '10', NULL, NULL),
(11, 'tax_bracket_3_limit', '18000000', NULL, NULL),
(12, 'tax_bracket_3_rate', '15', NULL, NULL),
(13, 'tax_bracket_4_limit', '32000000', NULL, NULL),
(14, 'tax_bracket_4_rate', '20', NULL, NULL),
(15, 'tax_bracket_5_limit', '52000000', NULL, NULL),
(16, 'tax_bracket_5_rate', '25', NULL, NULL),
(17, 'tax_bracket_6_limit', '80000000', NULL, NULL),
(18, 'tax_bracket_6_rate', '30', NULL, NULL),
(19, 'tax_bracket_7_rate', '35', NULL, NULL),
(20, 'ot_multiplier', '1.5', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `status`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'admin', 'admin@gmail.com', 'admin', 'active', NULL, '$2y$12$0yaCdBFs2Ygy8aKYQoXFb.NP5oATFzIC5CS.9JyuEr/iG6w3bGaXe', NULL, '2025-11-11 22:59:17', '2025-11-11 23:24:31'),
(3, 'Phước', 'phuoc@gmail.com', 'user', 'active', NULL, '$2y$12$CWlImMNxDk4C5JbY8XRPveKiwGjci0LuqvjPoInkQtmCUbsWy2BJG', NULL, '2025-11-13 04:40:54', '2025-11-13 04:40:54'),
(6, 'Hiếu', 'hieu@gmail.com', 'user', 'active', NULL, '$2y$12$IBzMhQtuJMn0/K6f4Z77zO/FIzrF7krN9WOX8pIAlT.vvt11FYhZi', NULL, '2025-11-13 18:34:17', '2025-11-13 18:34:17'),
(8, 'Sang', 'sang@gmail.com', 'user', 'active', NULL, '$2y$12$6NCUW2wzdQoRTaIRYh1RFOPoQybG88BrFNG/pAsk.YAipkHF8dRjS', NULL, '2025-11-23 03:01:04', '2025-11-23 03:01:04');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `assets_asset_tag_unique` (`asset_tag`);

--
-- Chỉ mục cho bảng `asset_assignments`
--
ALTER TABLE `asset_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_assignments_asset_id_foreign` (`asset_id`),
  ADD KEY `asset_assignments_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidates_job_opening_id_foreign` (`job_opening_id`);

--
-- Chỉ mục cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contracts_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_unique` (`email`),
  ADD KEY `employees_department_id_foreign` (`department_id`),
  ADD KEY `employees_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `holidays_date_unique` (`date`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `job_openings`
--
ALTER TABLE `job_openings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_openings_department_id_foreign` (`department_id`);

--
-- Chỉ mục cho bảng `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_requests_employee_id_foreign` (`employee_id`),
  ADD KEY `leave_requests_action_by_user_id_foreign` (`action_by_user_id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Chỉ mục cho bảng `overtime_requests`
--
ALTER TABLE `overtime_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `overtime_requests_employee_id_foreign` (`employee_id`),
  ADD KEY `overtime_requests_approved_by_foreign` (`approved_by`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payslips_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `salary_adjustments`
--
ALTER TABLE `salary_adjustments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_adjustments_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `salary_advances`
--
ALTER TABLE `salary_advances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_advances_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `salary_histories`
--
ALTER TABLE `salary_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_histories_employee_id_foreign` (`employee_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `assets`
--
ALTER TABLE `assets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `asset_assignments`
--
ALTER TABLE `asset_assignments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `job_openings`
--
ALTER TABLE `job_openings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `overtime_requests`
--
ALTER TABLE `overtime_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `payslips`
--
ALTER TABLE `payslips`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT cho bảng `salary_adjustments`
--
ALTER TABLE `salary_adjustments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `salary_advances`
--
ALTER TABLE `salary_advances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `salary_histories`
--
ALTER TABLE `salary_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `asset_assignments`
--
ALTER TABLE `asset_assignments`
  ADD CONSTRAINT `asset_assignments_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `asset_assignments_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_job_opening_id_foreign` FOREIGN KEY (`job_opening_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employees_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `job_openings`
--
ALTER TABLE `job_openings`
  ADD CONSTRAINT `job_openings_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_action_by_user_id_foreign` FOREIGN KEY (`action_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leave_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `overtime_requests`
--
ALTER TABLE `overtime_requests`
  ADD CONSTRAINT `overtime_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `overtime_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payslips`
--
ALTER TABLE `payslips`
  ADD CONSTRAINT `payslips_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `salary_adjustments`
--
ALTER TABLE `salary_adjustments`
  ADD CONSTRAINT `salary_adjustments_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `salary_advances`
--
ALTER TABLE `salary_advances`
  ADD CONSTRAINT `salary_advances_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `salary_histories`
--
ALTER TABLE `salary_histories`
  ADD CONSTRAINT `salary_histories_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
