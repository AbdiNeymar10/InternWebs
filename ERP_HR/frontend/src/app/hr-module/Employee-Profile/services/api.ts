// src/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Define a generic type for our API responses
type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

// Request interceptor
const beforeRequest = (endpoint: string, options: RequestInit) => {
  console.log(`[API] Starting request to ${endpoint}`);
  // You can add auth tokens or other headers here
  const token = localStorage.getItem('authToken');
  
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  };
};

// Response interceptor
const afterResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  console.log(`[API] Received response with status ${response.status}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`,
    }));

    return {
      error: errorData.message || errorData.error || 'Unknown error occurred',
      status: response.status,
    };
  }

  const data = await response.json().catch(() => ({}));
  return { data, status: response.status };
};

// Main API fetch function with TypeScript generics
async function fetchApi<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const interceptedOptions = beforeRequest(endpoint, options);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, interceptedOptions);
    return await afterResponse<T>(response);
  } catch (error) {
    console.error(`[API] Request to ${endpoint} failed:`, error);
    
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0, // 0 indicates network error
    };
  }
}

// API endpoints with typed responses
export const EmployeeApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => 
    fetchApi('/employees'),

  getById: async (empId: string): Promise<ApiResponse<any>> => 
    fetchApi(`/employees/${empId}`),

  getWithRelations: async (empId: string): Promise<ApiResponse<any>> => 
    fetchApi(`/employees/${empId}/with-relations`),

  create: async (employee: any): Promise<ApiResponse<any>> => 
    fetchApi('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    }),

  update: async (empId: string, employee: any, isFormData = false): Promise<ApiResponse<any>> => {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (isFormData) {
      // For file uploads
      options.body = employee as FormData;
      // Remove Content-Type header to let browser set it with boundary
      options.headers = {
        ...(options.headers || {}),
        'Content-Type': undefined,
      };
    } else {
      options.body = JSON.stringify(employee);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    return fetchApi(`/employees/${empId}`, options);
  },

  delete: async (empId: string): Promise<ApiResponse<void>> => 
    fetchApi(`/employees/${empId}`, {
      method: 'DELETE',
    }),
};

export const OptionsApi = {
  getAll: async (): Promise<ApiResponse<any>> => 
    fetchApi('/employee-options'),
};

// Helper function to throw errors if response contains error
export const getDataOrThrow = <T>(response: ApiResponse<T>): T => {
  if (response.error || !response.data) {
    throw new Error(response.error || 'No data received');
  }
  return response.data;
};

// Example usage in components:
// try {
//   const response = await EmployeeApi.getAll();
//   const employees = getDataOrThrow(response);
//   setEmployees(employees);
// } catch (error) {
//   toast.error(error.message);
// }