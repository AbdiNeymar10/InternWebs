// src/types/employee.ts

// Basic option interface for dropdown values
export interface Option {
  id: number | string;
  name: string;
  [key: string]: any; // Allow additional properties
}

// Core employee interface
export interface Employee {
  empId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  efirstName?: string; // English first name
  emiddleName?: string; // English middle name
  elastName?: string; // English last name
  dateOfBirth: string;
  birthDate?: string; // Alternative date field
  sex: string;
  maritalStatus?: string;
  hireDate?: string;
  hiredDate?: string; // Alternative date field
  photo?: string;
  salary?: string;
  positionStatus?: string;
  department?: string;
  deptJobCode?: number;
  empStatus?: number;
  retirementNo?: string;
  tinNumer?: string;
  pensionNumber?: string;
  labourUnion?: number;
  contractEnd?: string;
  fileName?: string;
  disciplinePenality?: number;
  endOfContract?: string;
  terminationDate?: string;
  reActiveDescription?: string;
  reActiveDate?: string;
  omnissionStatus?: number;
  driverType?: string;
  tess?: string;
  dedactionDescriptive?: string;
  fullNameEngWord?: string;
  permanentDate?: string;
  epid?: number;
  [key: string]: any; // Index signature for additional properties
}

// Extended employee interface with all relations
export interface EmployeeWithRelations extends Employee {
  employmentType?: {
    id: number;
    type: string;
  };
  nation?: {
    nationCode: number;
    name: string;
    description?: string;
    nationalityId?: number;
  };
  nationality?: {
    nationalityId: number;
    nationalityName?: string;
    nationalityDescription?: string;
  };
  religion?: {
    id: number;
    name: string;
    description?: string;
  };
  recruitmentType?: {
    recruitmentId?: number;
    recruitmentType: string;
    description?: string;
  };
  jobType?: {
    id: number;
    jobTitle?: string;
    status?: string;
    code?: string;
    jobTitleInAmharic?: string;
    description?: string;
  };
  position?: {
    id: number;
    name: string;
    salary?: number;
  };
  branch?: {
    id: number;
    branchName?: string;
    percentage?: string;
  };
  jobFamily?: {
    id: number;
    familyCode?: string;
    status?: string;
    familyName?: string;
  };
  icf?: {
    id: number;
    icf?: string;
    description?: string;
  };
  jobResponsibility?: {
    id: number;
    responsibility?: string;
    description?: string;
  };
  title?: {
    id?: number;
    name?: string;
  };
  payGrade?: {
    id?: number;
  };
  rank?: {
    id?: number;
  };
}

// Interface for employee form options
export interface EmployeeFormOptions {
  branches: Option[];
  employmentTypes: Option[];
  icfs: Option[];
  jobFamilies: Option[];
  jobTypes: Option[];
  nations: Option[];
  nationalities: Option[];
  positions: Option[];
  recruitmentTypes: Option[];
  religions: Option[];
  responsibilities: Option[];
}

// Interface for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

// Interface for paginated results
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Specific type for employee list with pagination
export type EmployeeListResponse = PaginatedResponse<Employee>;

// Type for employee search results
export interface EmployeeSearchResult {
  empId: string;
  fullName: string;
  position: string;
  department: string;
  photo?: string;
}

// Interface for employee creation/update payload
export interface EmployeePayload {
  empId?: string; // Optional for creation
  firstName: string;
  lastName: string;
  middleName?: string;
  efirstName?: string;
  emiddleName?: string;
  elastName?: string;
  dateOfBirth: string;
  sex: string;
  maritalStatus?: string;
  hiredDate?: string;
  tinNumer?: string;
  salary?: string;
  positionStatus?: string;
  department?: string;
  employmentTypeId?: number;
  nationCode?: number;
  nationalityId?: number;
  religionId?: number;
  recruitmentType?: string;
  jobTypeId?: number;
  positionId?: number;
  branchId?: number;
  jobFamilyId?: number;
  icfId?: number;
  rankId?: number;
  payGradeId?: number;
  titleId?: number;
  jobResponsibilityId?: number;
  photo?: File | string; // Can be either File for upload or string URL
}

// Interface for employee filter options
export interface EmployeeFilterOptions {
  department?: string;
  position?: string;
  employmentType?: number;
  status?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Interface for employee statistics
export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  byDepartment: Array<{
    department: string;
    count: number;
  }>;
  byPosition: Array<{
    position: string;
    count: number;
  }>;
}