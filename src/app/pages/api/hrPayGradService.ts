import axios from "axios";

const BASE_URL = "http://localhost:8080/api/hr-pay-grad"; // Backend URL

// Save pay grades (single or multiple)
export const savePayGrades = async (
  payGrades: Array<{ rankId: number; stepNo: string; salary: string }>
) => {
  try {
    const response = await axios.post(BASE_URL, payGrades, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving pay grades:", error);
    throw new Error("Failed to save pay grades");
  }
};

// Fetch all pay grades
export const fetchPayGrades = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching pay grades:", error);
    throw new Error("Failed to fetch pay grades");
  }
};

// Delete a specific pay grade by ID
export const deletePayGrade = async (id: number) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting pay grade with ID ${id}:`, error);
    throw new Error("Failed to delete pay grade");
  }
};
