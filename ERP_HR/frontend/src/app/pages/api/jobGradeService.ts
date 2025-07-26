import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/job-grades";

export const fetchJobGrades = async () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(API_BASE_URL, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

export const createJobGrade = async (jobGradeData: {
  grade: string;
  description: string;
}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.post(API_BASE_URL, jobGradeData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

export const updateJobGrade = async (
  id: number,
  jobGradeData: { grade: string; description: string }
) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.put(`${API_BASE_URL}/${id}`, jobGradeData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

export const deleteJobGrade = async (id: number) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
