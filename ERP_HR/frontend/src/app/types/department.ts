// Unified DepartmentDto interface
export interface DepartmentDto {
  deptId: number;
  deptName: string;
  parentDeptId?: number | null;
  deptLevel?: number;
  deptDescription?: string;
  estDate?: string;
  mission?: string;
  vision?: string;
  status?: string;
  email?: string;
  fax?: string;
  tele1?: string;
  tele2?: string;
  poBox?: string;
  children?: DepartmentDto[];
}
  

