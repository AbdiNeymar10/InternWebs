// app/services/leaveScheduleService.js
const API_BASE_URL = '/api';

export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/with-relations`);
    if (!response.ok) throw new Error('Employee not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee details:', error);
    return null;
  }
};

export const getLeaveSchedules = async (employeeId, year) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedules?employeeId=${employeeId}&year=${year}`);
    if (!response.ok) throw new Error('Failed to fetch leave schedules');
    return await response.json();
  } catch (error) {
    console.error('Error fetching leave schedules:', error);
    return [];
  }
};

export const getLeaveScheduleDetails = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedule-details/by-schedule/${scheduleId}`);
    if (!response.ok) throw new Error('Failed to fetch schedule details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule details:', error);
    return [];
  }
};

export const createLeaveSchedule = async (scheduleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    if (!response.ok) throw new Error('Failed to create leave schedule');
    return await response.json();
  } catch (error) {
    console.error('Error creating leave schedule:', error);
    return null;
  }
};

export const createLeaveScheduleDetail = async (detailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedule-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailData),
    });
    if (!response.ok) throw new Error('Failed to create schedule detail');
    return await response.json();
  } catch (error) {
    console.error('Error creating schedule detail:', error);
    return null;
  }
};

export const updateLeaveScheduleDetail = async (id, detailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedule-details/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailData),
    });
    if (!response.ok) throw new Error('Failed to update schedule detail');
    return await response.json();
  } catch (error) {
    console.error('Error updating schedule detail:', error);
    return null;
  }
};

export const deleteLeaveScheduleDetail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leave-schedule-details/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete schedule detail');
    return true;
  } catch (error) {
    console.error('Error deleting schedule detail:', error);
    return false;
  }
};