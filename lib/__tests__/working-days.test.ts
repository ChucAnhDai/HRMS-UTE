import { describe, it, expect } from 'vitest';
import { countBusinessDays } from '../working-days';

describe('countBusinessDays', () => {
  const weekendDays = [0, 6]; // Sunday, Saturday
  const holidays = [
    { date: '2026-03-08', name: 'Womens Day' }, // Sunday - overlaps with weekend
    { date: '2026-09-02', name: 'National Day' }, // Wednesday - weekday holiday
  ];

  it('should correctly count days within the same week without holidays', () => {
    // Mon 2026-06-01 to Thu 2026-06-04
    const start = new Date('2026-06-01');
    const end = new Date('2026-06-04');
    
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(4); // Mon, Tue, Wed, Thu
  });

  it('should subtract weekends', () => {
    // Thu 2026-06-04 to Tue 2026-06-09
    const start = new Date('2026-06-04');
    const end = new Date('2026-06-09');
    
    // Thu, Fri, (Sat, Sun ignored), Mon, Tue = 4 days
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(4);
  });

  it('should account for weekday holidays', () => {
    // Mon 2026-08-31 to Fri 2026-09-04
    const start = new Date('2026-08-31');
    const end = new Date('2026-09-04');
    
    // Mon, Tue, (Wed holiday ignored), Thu, Fri = 4 days
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(4);
  });

  it('should not double-subtract weekend holidays', () => {
    // Fri 2026-03-06 to Tue 2026-03-10
    const start = new Date('2026-03-06');
    const end = new Date('2026-03-10');
    
    // Fri, (Sat ignored), (Sun holiday ignored), Mon, Tue = 3 days
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(3);
  });

  it('should return 1 for a single same working day', () => {
    const start = new Date('2026-06-01');
    const end = new Date('2026-06-01');
    
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(1);
  });

  it('should return 0 for a single same weekend/holiday day', () => {
    const start = new Date('2026-06-06'); // Saturday
    const end = new Date('2026-06-06');
    
    const days = countBusinessDays(start, end, weekendDays, holidays);
    expect(days).toBe(0);
  });
});
