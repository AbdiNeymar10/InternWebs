import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Employee API
export const fetchEmployee = async (empId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

// Leave Request API
export const createLeaveRequest = async (requestData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/leave/request`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating leave request:", error);
    throw error;
  }
};

export const getPendingLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leave/request/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending leave requests:", error);
    throw error;
  }
};

export const updateLeaveRequestStatus = async (
  id: number,
  status: string,
  isHR = false
) => {
  try {
    const endpoint = isHR
      ? `${API_BASE_URL}/leave/request/${id}/hr-approval`
      : `${API_BASE_URL}/leave/request/${id}/department-approval`;

    const response = await axios.put(endpoint, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating leave request:", error);
    throw error;
  }
};

// Leave History API
export const getLeaveHistory = async (empId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leave/history/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave history:", error);
    throw error;
  }
};

// Leave Balance API
export const getLeaveBalances = async (empId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leave/balance/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave balances:", error);
    throw error;
  }
};

// Notification API
export const getNotifications = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notifications/employee/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationsAsRead = async (userId: string) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/notifications/employee/${userId}/read-all`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};
