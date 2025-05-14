export interface DepartmentDto {
  deptId: number;
  deptName: string;
  deptLevel: number;
  parentId?: number;
  children?: DepartmentDto[]; // Ensure this is typed correctly
}



// Example of DepartmentDto definition in TypeScript
export interface DepartmentDto {

  parentDeptId: number | null;

}
export interface DepartmentDto {
  deptId: number;
  deptName: string;
  deptDescription?: string;


  estDate?: string;
  mission?: string;
  vision?: string;
  status?: string;
  email?: string;
  fax?: string;
  tele1?: string;
  tele2?: string;
  pobox?: string;
}
