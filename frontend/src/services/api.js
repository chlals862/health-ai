import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// API 클라이언트 인스턴스
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(async (config) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('토큰 추가 실패:', error);
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      auth.signOut();
    }
    return Promise.reject(error);
  }
);

// ===== 인증 API =====
export const authService = {
  verifyToken: async (token) => {
    const response = await api.post('/api/auth/verify-token', { token });
    return response.data;
  },

  getUserData: async (userId) => {
    const response = await api.get(`/api/auth/user-data/${userId}`);
    return response.data;
  },

  updateUserData: async (userId, data) => {
    const response = await api.put(`/api/auth/update-user/${userId}`, data);
    return response.data;
  },
};

// ===== 건강 데이터 API =====
export const healthService = {
  addHealthData: async (data) => {
    const response = await api.post('/api/health/data', data);
    return response.data;
  },

  getHealthData: async (userId) => {
    const response = await api.get(`/api/health/data/${userId}`);
    return response.data;
  },

  updateHealthData: async (docId, data) => {
    const response = await api.put(`/api/health/data/${docId}`, data);
    return response.data;
  },

  deleteHealthData: async (docId) => {
    const response = await api.delete(`/api/health/data/${docId}`);
    return response.data;
  },
};

export default api;
