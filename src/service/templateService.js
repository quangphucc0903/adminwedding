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

export const getAllTemplates = async (page = 1, limit = 12) => {
  try {
    const response = await AdminAPI.get(
      `/templates?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error.response?.data || { message: "Failed to fetch templates" };
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await AdminAPI.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    throw error.response?.data || { message: "Failed to fetch template" };
  }
};

export const createTemplate = async (templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("name", templateData.name);
    formData.append("description", templateData.description);
    formData.append("subscriptionPlanId", templateData.subscriptionPlanId);
    formData.append("metaData", templateData.metaData);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await AdminAPI.post("/templates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error.response?.data || { message: "Failed to create template" };
  }
};

export const duplicateTemplate = async (templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("name", templateData.name);
    formData.append("description", templateData.description);
    formData.append("subscriptionPlanId", templateData.subscriptionPlan.id);
    formData.append("metaData", templateData.metaData);
    if (thumbnail) formData.append("thumbnailUrl", thumbnail);

    const response = await AdminAPI.post("/templates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error.response?.data || { message: "Failed to create template" };
  }
};

export const updateTemplate = async (id, templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append("name", templateData.name);
    formData.append("description", templateData.description);
    formData.append("subscriptionPlanId", templateData.subscriptionPlanId);
    formData.append("metaData", templateData.metaData);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await AdminAPI.patch(`/templates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error.response?.data || { message: "Failed to update template" };
  }
};

export const deleteTemplateById = async (id) => {
  try {
    const response = await AdminAPI.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error.response?.data || { message: "Failed to delete template" };
  }
};

export const createSection = async (sectionData) => {
  try {
    const response = await AdminAPI.post("/sections", sectionData);
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error.response?.data || { message: "Failed to create section" };
  }
};
export const updateSection = async (sectionData) => {
  try {
    const response = await AdminAPI.patch(`/sections/${sectionData.id}`, {
      metadata: sectionData.metadata,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error.response?.data || { message: "Failed to create section" };
  }
};

export const createSectionDuplicate = async (sectionData) => {
  try {
    // Loại bỏ id nếu có
    const { id, ...sectionDataWithoutId } = sectionData;

    // Gửi yêu cầu tạo Section không có id
    const response = await AdminAPI.post("/sections", sectionDataWithoutId);
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error.response?.data || { message: "Failed to create section" };
  }
};

export const getSectionsByTemplateId = async (templateId) => {
  try {
    const response = await AdminAPI.get(`/sections/template/${templateId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error;
  }
};

export const uploadImages = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await API.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating image:", error);
    throw error.response?.data || { message: "Failed to create image" };
  }
};

export const getAllSubscription = async () => {
  try {
    const response = await AdminAPI.get(`/subscription-plans`);
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching subcription:", error);
    throw error.response?.data || { message: "Failed to fetch subcription" };
  }
};
export const createInvitation = async (invitationData) => {
  try {
    const response = await AdminAPI.post(`/invitations`, invitationData);
    return response.data;
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw error.response?.data || { message: "Failed to create invitation" };
  }
};
export const getInvitationById = async (id) => {
  try {
    const response = await AdminAPI.get(`/invitations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invitation by ID:", error);
    throw error.response?.data || { message: "Failed to fetch invitation" };
  }
};
export const updateInvitation = async (invitationData) => {
  try {
    const { id, ...dataWithoutId } = invitationData; // Loại bỏ `id` ra khỏi dữ liệu
    const response = await AdminAPI.put(`/invitations/${id}`, dataWithoutId);
    return response.data;
  } catch (error) {
    console.error("Error updating invitation:", error);
    throw error.response?.data || { message: "Failed to update invitation" };
  }
};

export const deleteInvitation = async (invitationId) => {
  try {
    const response = await AdminAPI.delete(`/invitations/by-template/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invitation:", error);
    throw error.response?.data || { message: "Failed to delete invitation" };
  }
};


export default {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplateById,
  createSection,
  getSectionsByTemplateId,
  uploadImages,
  createInvitation,
  getInvitationById,
  updateInvitation,
  deleteInvitation
};
