import { authFetch } from "@/utils/authFetch";
import { DepartmentDto } from "../types/department";

const API_URL = "http://localhost:8080/api/departments";

// Fetch all departments
export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await authFetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
};

// Create a new department
// (leave as is if not used in modal)
// export const createDepartment = ...

// Update an existing department
// (leave as is if not used in modal)
// export const updateDepartment = ...

export const getChildren = async (deptId: number): Promise<DepartmentDto[]> => {
  const response = await authFetch(
    `http://localhost:8080/api/departments/children/${deptId}`
  );
  if (!response.ok) throw new Error("Failed to fetch children");
  return response.json();
};
