import { describe, it, expect } from 'vitest';
import { EmployeeSchema } from './lib/schemas/employee.schema';

describe('EmployeeSchema Validation', () => {
  const baseData = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    hire_date: '2024-01-01',
    employment_status: 'Probation',
  };

  it('should accept valid status "Probation"', () => {
    const result = EmployeeSchema.safeParse(baseData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid status "Probation123"', () => {
    const result = EmployeeSchema.safeParse({
      ...baseData,
      employment_status: 'Probation123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid enum value');
    }
  });

  it('should accept other valid statuses', () => {
    const statuses = ["Active", "Resigned", "Terminated", "On Leave", "Intern", "Part-time"];
    statuses.forEach(status => {
      const result = EmployeeSchema.safeParse({
        ...baseData,
        employment_status: status,
      });
      expect(result.success).toBe(true);
    });
  });
});
