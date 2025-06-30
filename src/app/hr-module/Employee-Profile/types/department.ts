// types/department.ts
export interface DepartmentDto {
  deptId: number;
  deptName: string;
  parentDeptId?: number | null;
  deptLevel?: number;
  email?: string;
  estDate?: string;
  mission?: string;
  vision?: string;
  poBox?: string;
  status?: string;
  tele1?: string;
  tele2?: string;
}