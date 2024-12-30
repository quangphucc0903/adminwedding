import axios from "axios";

// Tạo một instance axios với base URL từ môi trường
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm đăng ký
export const register = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// Hàm đăng nhập
// Hàm đăng nhập
export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      identifier: email,
      password,
    });

    // Sau khi đăng nhập thành công, lưu access_token vào cookie và sessionStorage
    if (response.data?.access_token) {
      sessionStorage.setItem("access_token", response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// Reset Password API
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post(
      `/auth/reset-password?token=${token}`,
      {
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
};
