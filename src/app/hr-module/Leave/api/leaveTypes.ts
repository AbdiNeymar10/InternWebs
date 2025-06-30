import axiosInstance from './axiosConfig';

const API_URL = 'http://localhost:8080/api/leave-types';

export const getLeaveTypes = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave types:', error);
    throw error;
  }
};

export const createLeaveType = async (leaveTypeData: any) => {
  try {
    const response = await axiosInstance.post(API_URL, leaveTypeData);
    return response.data;
  } catch (error) {
    console.error('Error creating leave type:', error);
    throw error;
  }
};

export const updateLeaveType = async (id: number, leaveTypeData: any) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, leaveTypeData);
    return response.data;
  } catch (error) {
    console.error('Error updating leave type:', error);
    throw error;
  }
};

export const deleteLeaveType = async (id: number) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting leave type:', error);
    throw error;
  }
};