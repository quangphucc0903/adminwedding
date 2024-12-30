import axios from "axios";

export const AdminAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllWedding = async (guestData) => {
  try {
    const response = await AdminAPI.get(`/wedding-details`, guestData);
    return response.data;
  } catch (error) {
    console.error("Error adding guest:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllWedding,
};
