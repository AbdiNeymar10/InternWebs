import axiosInstance from './axiosConfig';

const API_URL = 'http://localhost:8080/api/hr-leave-settings';

export const getLeaveSettings = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave settings:', error);
    throw error;
  }
};

export const createLeaveSetting = async (leaveSettingData: any) => {
  try {
    const response = await axiosInstance.post(API_URL, leaveSettingData);
    return response.data;
  } catch (error) {
    console.error('Error creating leave setting:', error);
    throw error;
  }
};

export const getLeaveSettingsByType = async (leaveTypeId: number) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/by-leave-type/${leaveTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave settings by type:', error);
    throw error;
  }
};