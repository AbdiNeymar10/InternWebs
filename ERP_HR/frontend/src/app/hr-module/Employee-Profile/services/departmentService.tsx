import axios from 'axios';
import { DepartmentDto } from '../types/department';

const API_URL = 'http://localhost:8080/api/departments';

// Fetch all departments
export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await axios.get<DepartmentDto[]>(API_URL);
  return response.data;
};

// Create a new department
export const createDepartment = async (dept: DepartmentDto): Promise<DepartmentDto> => {
  const response = await axios.post<DepartmentDto>(API_URL, dept);
  return response.data;  // Return the created department
};

// Update an existing department
export const updateDepartment = async (dept: DepartmentDto): Promise<DepartmentDto> => {
  const response = await axios.put<DepartmentDto>(`${API_URL}/${dept.deptId}`, dept);
  return response.data;  // Return the updated department
};
export const getChildren = async (deptId: number): Promise<DepartmentDto[]> => {
  const response = await fetch(`http://localhost:8080/api/departments/children/${deptId}`);
  if (!response.ok) throw new Error('Failed to fetch children');
  return response.json();

};
