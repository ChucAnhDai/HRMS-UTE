import { describe, it, expect } from 'vitest';
import { safeNum } from '../payroll-helpers';

describe('safeNum', () => {
  it('should return 0 for undefined, null, and empty string', () => {
    expect(safeNum(undefined)).toBe(0);
    expect(safeNum(null)).toBe(0);
    expect(safeNum('')).toBe(0);
  });

  it('should parse valid numbers and numeric strings', () => {
    expect(safeNum(5)).toBe(5);
    expect(safeNum('5')).toBe(5);
    expect(safeNum(5.5)).toBe(5.5);
    expect(safeNum('5.5')).toBe(5.5);
    expect(safeNum(-10)).toBe(-10);
  });

  it('should safely return 0 for falsy but valid numeric forms like 0 and "0"', () => {
    expect(safeNum(0)).toBe(0);
    expect(safeNum('0')).toBe(0);
  });

  it('should return 0 for invalid and non-finite numbers', () => {
    expect(safeNum('abc')).toBe(0);
    expect(safeNum(NaN)).toBe(0);
    expect(safeNum(Infinity)).toBe(0);
    expect(safeNum(-Infinity)).toBe(0);
    expect(safeNum({})).toBe(0);
    expect(safeNum([])).toBe(0);
  });
});
