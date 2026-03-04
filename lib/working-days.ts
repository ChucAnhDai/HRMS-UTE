/**
 * @module working-days
 * @description Utility để tính số ngày làm việc thực tế trong một tháng cụ thể.
 * Tính dựa trên: số ngày lịch của tháng, trừ ngày nghỉ cuối tuần, trừ ngày lễ.
 *
 * @example
 * // Tháng 3/2026, nghỉ T7 + CN, có 1 ngày lễ rơi vào thứ Tư
 * calculateWorkingDays(3, 2026, [0, 6], [{ date: '2026-03-08' }])
 * // → 21 (22 ngày làm việc - 1 ngày lễ)
 */

interface HolidayEntry {
  date: string // Format: 'YYYY-MM-DD'
  name?: string
}

/**
 * Tính số ngày làm việc thực tế trong một tháng cụ thể.
 *
 * @param month - Tháng (1-12)
 * @param year - Năm (VD: 2026)
 * @param weekendDays - Mảng các ngày nghỉ cuối tuần (0=CN, 1=T2, ..., 6=T7). VD: [0, 6]
 * @param holidays - Danh sách ngày lễ trong năm (có thể bao gồm cả năm)
 * @returns Số ngày làm việc chuẩn trong tháng đó
 *
 * @throws {Error} Nếu month không hợp lệ (ngoài 1-12)
 */
export function calculateWorkingDays(
  month: number,
  year: number,
  weekendDays: number[],
  holidays: HolidayEntry[] = []
): number {
  // Validate input
  if (month < 1 || month > 12) {
    throw new Error(`Tháng không hợp lệ: ${month}. Phải từ 1 đến 12.`)
  }
  if (year < 1970 || year > 2100) {
    throw new Error(`Năm không hợp lệ: ${year}. Phải từ 1970 đến 2100.`)
  }

  // Lấy tổng số ngày trong tháng (trick: day=0 của tháng tiếp theo = ngày cuối tháng hiện tại)
  const totalDaysInMonth = new Date(year, month, 0).getDate()

  // Tạo Set các ngày lễ trong tháng để lookup nhanh O(1)
  const holidaySet = new Set<string>()
  for (const holiday of holidays) {
    const holidayDate = new Date(holiday.date)
    // Chỉ lấy ngày lễ thuộc tháng đang tính
    if (holidayDate.getFullYear() === year && holidayDate.getMonth() + 1 === month) {
      holidaySet.add(holiday.date)
    }
  }

  let workingDays = 0

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay() // 0=CN, 1=T2, ..., 6=T7

    // Bỏ qua ngày nghỉ cuối tuần
    if (weekendDays.includes(dayOfWeek)) {
      continue
    }

    // Bỏ qua ngày lễ (chỉ khi rơi vào ngày làm việc)
    const dateStr = formatDateStr(year, month, day)
    if (holidaySet.has(dateStr)) {
      continue
    }

    workingDays++
  }

  return workingDays
}

/**
 * Format ngày thành chuỗi YYYY-MM-DD (để so sánh với holiday entries)
 */
function formatDateStr(year: number, month: number, day: number): string {
  const m = month.toString().padStart(2, '0')
  const d = day.toString().padStart(2, '0')
  return `${year}-${m}-${d}`
}

/**
 * Parse chuỗi JSON weekend_days từ settings thành mảng số.
 * Xử lý an toàn, trả về default [0, 6] (CN + T7) nếu parse lỗi.
 *
 * @param weekendDaysJson - Chuỗi JSON từ settings, VD: '["0","6"]'
 * @returns Mảng số các ngày nghỉ cuối tuần
 */
export function parseWeekendDays(weekendDaysJson: string | undefined): number[] {
  const DEFAULT_WEEKEND = [0, 6] // CN + T7

  if (!weekendDaysJson) return DEFAULT_WEEKEND

  try {
    const parsed = JSON.parse(weekendDaysJson)
    if (!Array.isArray(parsed)) return DEFAULT_WEEKEND

    const result = parsed.map(Number).filter((n: number) => !isNaN(n) && n >= 0 && n <= 6)
    return result.length > 0 ? result : DEFAULT_WEEKEND
  } catch {
    return DEFAULT_WEEKEND
  }
}

/**
 * Đếm số ngày làm việc giữa 2 khoảng thời gian (inclusive), trừ T7/CN và ngày lễ.
 * 
 * @param start - Ngày bắt đầu
 * @param end - Ngày kết thúc
 * @param weekendDays - Mảng các ngày nghỉ (vd: [0, 6] cho CN và T7)
 * @param holidays - Danh sách các ngày lễ
 */
export function countBusinessDays(
  start: Date,
  end: Date,
  weekendDays: number[],
  holidays: HolidayEntry[] = []
): number {
  let count = 0
  const current = new Date(start)
  
  // Normalize time to midnight for accurate comparison
  current.setHours(0, 0, 0, 0)
  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  // Pre-process holidays into a Set
  const holidaySet = new Set<string>()
  for (const h of holidays) {
    holidaySet.add(h.date)
  }

  while (current <= endDate) {
    const dayOfWeek = current.getDay()
    const dateStr = formatDateStr(current.getFullYear(), current.getMonth() + 1, current.getDate())
    
    const isWeekend = weekendDays.includes(dayOfWeek)
    const isHoliday = holidaySet.has(dateStr)

    if (!isWeekend && !isHoliday) {
      count++
    }

    current.setDate(current.getDate() + 1)
  }

  return count
}
