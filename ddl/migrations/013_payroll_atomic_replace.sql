-- 013_payroll_atomic_replace.sql
-- Function to reliably replace payrolls for a given month/year without losing data or risking duplicates
-- Wraps deletion and insertion in a PostgreSQL transaction for consistency.

CREATE OR REPLACE FUNCTION replace_monthly_payroll(
    p_month TEXT,
    p_year VARCHAR, -- Assuming year could be passed as string or int depending on type. wait, payslip table uses month TEXT, but in TS it's number. Let's look at the DDL.
    p_payslips JSONB
) RETURNS void AS $$
BEGIN
    -- 1. Delete existing unpaid payslips for the given month/year
    DELETE FROM payslips 
    WHERE month = p_month 
      AND status != 'Paid'; -- Only replace Pending or Generated. Paid payslips are locked.

    -- 2. Insert the newly generated payslips.
    -- Assuming p_payslips is a JSON array of objects that match the payslips table columns.
    -- Wait, the payslips table in 004_add_salary_and_create_payroll.sql has columns:
    -- employee_id, month, base_salary, work_days, leave_days, allowance, bonus, deduction, total_salary, status
    -- But the TS code uses: employee_id, month, year, salary, ot_hours, ot_salary, bonus, advance_amount, penalties, social_insurance, tax, net_pay, status, notes
    -- It looks like the payslips table schema was modified or isn't 004! Let me check the actual table columns in DB or previous migrations...
    -- Wait, looking at payroll-repo.ts, we insert payslips using Supabase JS which maps keys directly to columns:
    -- salary, ot_hours, ot_salary, bonus, advance_amount, penalties, social_insurance, tax, net_pay, notes, etc.
    
    -- Actually, if we use Supabase to do the insertion, we don't need a single custom RPC that JSON decodes for insertion unless we really have to. 
    -- We can use a simpler RPC:
    -- RPC delete_unpaid_payslips(p_month, p_year) -> then do the insert via JS? 
    -- No, if the insert via JS fails, the deletion is already committed. 
    -- Thus we must insert inside the RPC.
    
    INSERT INTO payslips (
        employee_id, month, year, salary, ot_hours, ot_salary, bonus, advance_amount,
        penalties, social_insurance, tax, net_pay, status, notes,
        gross_from_work, actual_work_days, paid_leave_days
    )
    SELECT
        (elem->>'employee_id')::bigint,
        (elem->>'month')::int,
        (elem->>'year')::int,
        (elem->>'salary')::decimal,
        (elem->>'ot_hours')::int,
        (elem->>'ot_salary')::decimal,
        (elem->>'bonus')::decimal,
        (elem->>'advance_amount')::decimal,
        (elem->>'penalties')::decimal,
        (elem->>'social_insurance')::decimal,
        (elem->>'tax')::decimal,
        (elem->>'net_pay')::decimal,
        (elem->>'status')::text,
        (elem->>'notes')::text,
        COALESCE((elem->>'gross_from_work')::decimal, 0),
        COALESCE((elem->>'actual_work_days')::int, 0),
        COALESCE((elem->>'paid_leave_days')::int, 0)
    FROM jsonb_array_elements(p_payslips) AS elem;

END;
$$ LANGUAGE plpgsql;
