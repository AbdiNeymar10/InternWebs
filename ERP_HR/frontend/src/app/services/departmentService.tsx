import { authFetch } from "@/utils/authFetch";
import { DepartmentDto } from "../types/department";

const API_URL = "http://localhost:8080/api/departments";

// Fetch all departments
export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await authFetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
};

// Fetch children departments based on deptId
export const getChildren = async (deptId: number): Promise<DepartmentDto[]> => {
  const response = await authFetch(`${API_URL}/children/${deptId}`);
  if (!response.ok) throw new Error("Failed to fetch children");
  return response.json();
};

// Create a new department
export const createDepartment = async (
  dept: DepartmentDto
): Promise<DepartmentDto> => {
  const response = await authFetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dept),
  });
  if (!response.ok) throw new Error("Failed to create department");
  return response.json();
};

// Update an existing department
export const updateDepartment = async (
  dept: DepartmentDto
): Promise<DepartmentDto> => {
  const response = await authFetch(`${API_URL}/${dept.deptId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dept),
  });
  if (!response.ok) throw new Error("Failed to update department");
  return response.json();
};
