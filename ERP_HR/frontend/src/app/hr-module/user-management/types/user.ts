export interface User {
  id?: number;
  fullName: string;
  email: string;
  empId: string;
  password: string;
  role: 'EMPLOYEE' | 'ADMIN';
  token?: string;
  otp?: string;
  otpGeneratedTime?: string;
  refreshedToken?: string;
}

export interface UserResponse {
  status: number;
  message: string;
  error?: string;
  ourUser?: User;
  ourUserLists?: User[];
  token?: string;
  refreshedToken?: string;
}