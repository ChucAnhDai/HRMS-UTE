import { Employee, Department } from '@/types'
import BasicInfoFields from './forms/BasicInfoFields'
import JobInfoFields from './forms/JobInfoFields'
import ImportantDatesFields from './forms/ImportantDatesFields'
import SalaryFields from './forms/SalaryFields'
import LeaveQuotaFields from './forms/LeaveQuotaFields'

interface Props {
  departments: Department[]
  defaultValues?: Partial<Employee>
}

export default function EmployeeFormSections({ departments, defaultValues = {} }: Props) {
  // Pass correct default values and departments to sub-components
  // Note: defaultValues is already Partial<Employee>, perfectly compatible with sub-components
  
  return (
    <>
      <BasicInfoFields defaultValues={defaultValues} />
      <JobInfoFields departments={departments} defaultValues={defaultValues} />
      <ImportantDatesFields defaultValues={defaultValues} />
      <SalaryFields defaultValues={defaultValues} />
      <LeaveQuotaFields defaultValues={defaultValues} />
    </>
  )
}
