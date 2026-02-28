import axios from 'axios';

// Khởi tạo axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server trả về error
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - You do not have permission');
          break;
        case 404:
          console.error('Not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Error:', error.response.data.message);
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network error - Please check your connection');
    } else {
      // Lỗi khác
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============= CONVERSATION APIs =============

/**
 * Lấy danh sách tất cả cuộc trò chuyện
 * GET /api/conversations
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/conversations');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy chi tiết một cuộc trò chuyện
 * GET /api/conversations/:id
 */
export const getConversationById = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo cuộc trò chuyện mới
 * POST /api/conversations
 */
export const createConversation = async (data) => {
  try {
    const response = await api.post('/conversations', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// ============= MESSAGE APIs =============

/**
 * Lấy tin nhắn của một cuộc trò chuyện
 * GET /api/messages/:conversationId?page=1&limit=50
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/messages/${conversationId}`, {
      params: { page, limit }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Gửi tin nhắn mới
 * POST /api/messages
 */
export const sendMessage = async (data) => {
  try {
    const response = await api.post('/messages', data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Sửa tin nhắn
 * PUT /api/messages/:id
 */
export const updateMessage = async (messageId, content) => {
  try {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa tin nhắn
 * DELETE /api/messages/:id
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Đánh dấu tin nhắn đã đọc
 * PUT /api/messages/:id/read
 */
export const markAsRead = async (messageId) => {
  try {
    const response = await api.put(`/messages/${messageId}/read`);
    return response;
  } catch (error) {
    throw error;
  }
};

// ============= USER APIs =============

/**
 * Lấy thông tin user hiện tại
 * GET /api/user/profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user/profile');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật thông tin user
 * PUT /api/user/profile
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put('/user/profile', data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Tìm kiếm user
 * GET /api/users/search?q=keyword
 */
export const searchUsers = async (keyword) => {
  try {
    const response = await api.get('/users/search', {
      params: { q: keyword }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// ============= FILE UPLOAD APIs =============

/**
 * Upload file/image
 * POST /api/upload
 */
export const uploadFile = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// ============= AUTH APIs =============

/**
 * Đăng nhập
 * POST /api/auth/login
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Đăng ký
 * POST /api/auth/register
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;