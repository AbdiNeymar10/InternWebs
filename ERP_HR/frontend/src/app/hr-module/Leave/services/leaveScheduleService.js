import { authFetch } from "@/utils/authFetch";
const API_BASE_URL = "http://localhost:8080/api";

export const getLeaveSchedules = async () => {
  const response = await authFetch(`${API_BASE_URL}/leave-schedules`);
  return await response.json();
};

export const getLeaveScheduleDetails = async (scheduleId) => {
  const response = await authFetch(
    `${API_BASE_URL}/leave-schedules/${scheduleId}/details`
  );
  return await response.json();
};

export const createLeaveSchedule = async (scheduleData) => {
  const response = await authFetch(`${API_BASE_URL}/leave-schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  });
  return await response.json();
};

export const updateLeaveSchedule = async (id, scheduleData) => {
  const response = await authFetch(`${API_BASE_URL}/leave-schedules/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  });
  return await response.json();
};

export const deleteLeaveSchedule = async (id) => {
  await authFetch(`${API_BASE_URL}/leave-schedules/${id}`, {
    method: "DELETE",
  });
};

// For schedule details
export const createLeaveScheduleDetail = async (detailData) => {
  const response = await authFetch(`${API_BASE_URL}/leave-schedule-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(detailData),
  });
  return await response.json();
};

export const updateLeaveScheduleDetail = async (id, detailData) => {
  const response = await authFetch(
    `${API_BASE_URL}/leave-schedule-details/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detailData),
    }
  );
  return await response.json();
};

export const deleteLeaveScheduleDetail = async (id) => {
  await authFetch(`${API_BASE_URL}/leave-schedule-details/${id}`, {
    method: "DELETE",
  });
};
