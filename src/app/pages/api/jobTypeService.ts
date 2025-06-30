import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/job_types";

// Fetch all job types
export const fetchJobTypes = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Fetch a job type by ID
export const fetchJobTypeById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Create a new job type
export const createJobType = async (jobTypeData: {
  jobTitle: string;
  jobTitleInAmharic: string;
  description: string;
  status: string;
  code?: string;
}) => {
  const { id, ...payloadWithoutId } = jobTypeData as any;

  const response = await axios.post(API_BASE_URL, payloadWithoutId);
  return response.data;
};

// Update a job type
export const updateJobType = async (
  id: number,
  jobTypeData: {
    jobTitle: string;
    jobTitleInAmharic: string;
    description: string;
    status: string;
    code?: string;
  }
) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, jobTypeData);
  return response.data;
};

// Delete a job type
export const deleteJobType = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
