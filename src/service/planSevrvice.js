import axios from "axios";

// Tạo instance axios
export const AdminAPI = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});
export const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
// Hàm để lấy access token từ cookie hoặc sessionStorage
const getAccessToken = () => {
  // Bạn có thể lấy token từ cookie hoặc sessionStorage
  return sessionStorage.getItem("access_token");
};

API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để tự động thêm token vào các yêu cầu
AdminAPI.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const fetchAllPlans = async () => {
  try {
    const response = await AdminAPI.get("/subscription-plans");
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};
export const deletePlanById = async (id) => {
  try {
    const response = await AdminAPI.delete(`/subscription-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw error;
  }
};
export const updatePlanById = async (id, updatedData) => {
  try {
    const response = await AdminAPI.put(
      `/subscription-plans/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating subscription plan:",
      error.response?.data || error
    );
    throw error;
  }
};
export const createSubscriptionPlans = async (data) => {
  const response = await AdminAPI.post(`/subscription-plans`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getAllOrders = async (page, limit) => {
  const response = await AdminAPI.get(`/subscriptions?page=${page}&limit=${limit}`);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await AdminAPI.post(`/subscriptions/create`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await AdminAPI.get(`/subscriptions/${id}`);
  return response.data;
};