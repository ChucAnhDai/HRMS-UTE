/**
 * @module payroll-helpers
 * @description Tách các hàm tính toán tài chính ra riêng (clean code).
 * - calculateProgressiveTax: Tính thuế TNCN lũy tiến
 * - calculateSocialInsurance: Tính BHXH (tuân thủ luật VN: < 14 ngày = miễn)
 * - clampDeductions: Xử lý logic chống âm lương
 */

// ─── Types ────────────────────────────────────────────────────────────
export interface TaxBracket {
  limit: number // Mức thu nhập (0 = bậc cuối cùng, vô hạn)
  rate: number  // Thuế suất (%)
}

export interface DeductionInput {
  socialInsurance: number
  tax: number
  penalties: number
  advanceAmount: number
  totalIncome: number
}

export interface DeductionResult {
  socialInsurance: number
  tax: number
  penalties: number
  advanceAmount: number
  totalDeductions: number
  netPay: number
}

// ─── Default Tax Brackets (Biểu thuế TNCN Việt Nam) ─────────────────
export const DEFAULT_TAX_BRACKETS: TaxBracket[] = [
  { limit: 5_000_000, rate: 5 },
  { limit: 10_000_000, rate: 10 },
  { limit: 18_000_000, rate: 15 },
  { limit: 32_000_000, rate: 20 },
  { limit: 52_000_000, rate: 25 },
  { limit: 80_000_000, rate: 30 },
  { limit: 0, rate: 35 }, // 0 = vô hạn
]

// ─── Minimum days for BHXH (Luật BHXH Việt Nam) ─────────────────────
const MIN_DAYS_FOR_INSURANCE = 14

// ─── Functions ────────────────────────────────────────────────────────

/**
 * Tính thuế TNCN theo biểu thuế lũy tiến.
 *
 * @param taxableIncome - Thu nhập chịu thuế (sau giảm trừ)
 * @param brackets - Biểu thuế lũy tiến
 * @returns Số tiền thuế phải nộp (làm tròn)
 */
export function calculateProgressiveTax(
  taxableIncome: number,
  brackets: TaxBracket[] = DEFAULT_TAX_BRACKETS
): number {
  if (taxableIncome <= 0) return 0

  let tax = 0
  let previousLimit = 0

  for (const bracket of brackets) {
    const { limit, rate } = bracket
    const rateDecimal = rate / 100

    // Bậc cuối cùng (limit = 0 = vô hạn)
    if (limit === 0) {
      tax += (taxableIncome - previousLimit) * rateDecimal
      break
    }

    if (taxableIncome > limit) {
      tax += (limit - previousLimit) * rateDecimal
      previousLimit = limit
    } else {
      tax += (taxableIncome - previousLimit) * rateDecimal
      break
    }
  }

  return Math.round(tax)
}

/**
 * Tính Bảo hiểm xã hội (BHXH).
 * Theo luật VN: nếu totalBillableDays < 14 thì KHÔNG đóng BHXH.
 *
 * @param salaryBase - Lương cơ bản (mức đóng BHXH)
 * @param insuranceRate - Tỷ lệ đóng BHXH (decimal, VD: 0.105 = 10.5%)
 * @param totalBillableDays - Tổng ngày có hưởng lương (đi làm + nghỉ có lương)
 * @returns Số tiền BHXH phải đóng (= 0 nếu < 14 ngày)
 */
export function calculateSocialInsurance(
  salaryBase: number,
  insuranceRate: number,
  totalBillableDays: number
): number {
  if (salaryBase <= 0 || insuranceRate <= 0) return 0

  // Luật VN: Đi làm dưới 14 ngày trong tháng → miễn đóng BHXH
  if (totalBillableDays < MIN_DAYS_FOR_INSURANCE) {
    return 0
  }

  return Math.round(salaryBase * insuranceRate)
}

/**
 * Xử lý logic khấu trừ và chống âm lương.
 *
 * Rules:
 * - Nếu actualWorkDays = 0: penalties = 0 (không phạt khi không đi làm)
 * - BHXH = 0 nếu totalBillableDays < 14 (đã xử lý ở calculateSocialInsurance)
 * - netPay có thể âm CHỈ do tạm ứng (advanceAmount)
 * - Thuế = 0 nếu totalIncome = 0
 *
 * @param input - Các khoản khấu trừ đầu vào
 * @param actualWorkDays - Số ngày thực tế đi làm
 * @returns Kết quả khấu trừ đã được clean (DeductionResult)
 */
export function clampDeductions(
  input: DeductionInput,
  actualWorkDays: number
): DeductionResult {
  const { socialInsurance, totalIncome, advanceAmount } = input
  let { tax, penalties } = input

  // Rule: Không đi làm ngày nào → không phạt đi trễ
  if (actualWorkDays === 0) {
    penalties = 0
  }

  // Rule: Thu nhập = 0 → thuế = 0
  if (totalIncome <= 0) {
    tax = 0
  }

  // Tính tổng khấu trừ (BHXH + Thuế + Phạt + Tạm ứng)
  const totalDeductions = socialInsurance + tax + penalties + advanceAmount

  // netPay có thể âm do tạm ứng — đây là nợ thật
  const netPay = totalIncome - totalDeductions

  return {
    socialInsurance,
    tax,
    penalties,
    advanceAmount,
    totalDeductions,
    netPay,
  }
}

/**
 * Parse tax brackets từ JSON string với fallback an toàn.
 *
 * @param jsonStr - Chuỗi JSON biểu thuế
 * @returns Mảng TaxBracket[]
 */
export function parseTaxBrackets(jsonStr: string | undefined): TaxBracket[] {
  if (!jsonStr) return DEFAULT_TAX_BRACKETS

  try {
    const parsed = JSON.parse(jsonStr)
    if (!Array.isArray(parsed)) return DEFAULT_TAX_BRACKETS

    // Validate từng bracket
    const valid = parsed.every(
      (b: TaxBracket) =>
        typeof b.limit === 'number' &&
        typeof b.rate === 'number' &&
        b.rate >= 0 &&
        b.rate <= 100
    )

    return valid ? parsed : DEFAULT_TAX_BRACKETS
  } catch {
    return DEFAULT_TAX_BRACKETS
  }
}
