import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/icf"; // Replace with your backend URL

// Fetch all ICFs
export const fetchICFs = async () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(API_BASE_URL, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

// Fetch ICF by ID
export const fetchICFById = async (id: number) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

// Create a new ICF
export const createICF = async (icfData: {
  ICF: string;
  description: string;
}) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await axios.post(API_BASE_URL, icfData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ICF:", error);
    throw error;
  }
};

// Delete an ICF
export const deleteICF = async (id: number) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
