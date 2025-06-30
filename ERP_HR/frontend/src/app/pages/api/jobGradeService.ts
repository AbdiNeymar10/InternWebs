import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/job-grades";

export const fetchJobGrades = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createJobGrade = async (jobGradeData: {
  grade: string;
  description: string;
}) => {
  const response = await axios.post(API_BASE_URL, jobGradeData);
  return response.data;
};

export const updateJobGrade = async (
  id: number,
  jobGradeData: { grade: string; description: string }
) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, jobGradeData);
  return response.data;
};

export const deleteJobGrade = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
