import { Employee, Department, EmploymentStatus } from "@/types";
import { useState } from "react";
import BasicInfoFields from "./forms/BasicInfoFields";
import JobInfoFields from "./forms/JobInfoFields";
import ImportantDatesFields from "./forms/ImportantDatesFields";
import SalaryFields from "./forms/SalaryFields";
import LeaveQuotaFields from "./forms/LeaveQuotaFields";

interface Props {
  departments: Department[];
  defaultValues?: Partial<Employee>;
  draftValues?: Record<string, unknown> | null;
  isMounted?: boolean;
}

export default function EmployeeFormSections({
  departments,
  defaultValues = {},
  draftValues,
  isMounted = false,
}: Props) {
  // Pass correct default values and departments to sub-components
  // Note: defaultValues is already Partial<Employee>, perfectly compatible with sub-components

  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>(
    defaultValues.employment_status || "Probation",
  );

  return (
    <>
      <BasicInfoFields 
        defaultValues={defaultValues} 
        draftValues={draftValues}
        isMounted={isMounted}
      />
      <JobInfoFields
        departments={departments}
        defaultValues={defaultValues}
        status={employmentStatus}
        onStatusChange={setEmploymentStatus}
        draftValues={draftValues}
        isMounted={isMounted}
      />
      <ImportantDatesFields
        defaultValues={defaultValues}
        status={employmentStatus}
        draftValues={draftValues}
        isMounted={isMounted}
      />
      <SalaryFields 
        defaultValues={defaultValues} 
        draftValues={draftValues}
        isMounted={isMounted}
      />
      <LeaveQuotaFields 
        defaultValues={defaultValues} 
        draftValues={draftValues}
        isMounted={isMounted}
      />
    </>
  );
}
