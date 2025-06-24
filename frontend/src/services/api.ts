import axios from 'axios';

// In standalone mode, this should be available at build time
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const isDevelopment = process.env.NODE_ENV === 'development';

// Debug logging in development
if (isDevelopment) {
  console.log('=== API Configuration Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('================================');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending cookies with cross-origin requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    
    // Get token from cookie instead of localStorage
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const cookies = document.cookie;
        const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth-storage='));
        if (authCookie) {
          const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
          const token = authData.state?.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        if (isDevelopment) {
          console.error('Error parsing auth cookie:', error);
        }
      }
    }
    
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error('API Response Error:', error.response?.status, error.response?.data);
      console.error('Request Data:', error.config?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      if (error.response?.data?.message) {
        console.error('Error Message:', error.response.data.message);
      }
      if (error.response?.data?.error) {
        console.error('Error Details:', error.response.data.error);
      }
      if (error.response?.data?.validationErrors) {
        console.error('Validation Errors:', error.response.data.validationErrors);
      }
    }
    
    if (error.response?.status === 401) {
      // Clear cookie instead of localStorage
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        try {
          document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        } catch (error) {
          if (isDevelopment) {
            console.error('Error clearing auth cookie:', error);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LeaveBalance {
  id: string;
  userId: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface CreateLeaveRequestDto {
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
}

export interface UpdateLeaveRequestDto {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Leave Request API
export const leaveRequestAPI = {
  getAll: () => api.get<LeaveRequest[]>('/leave-request/all'),
  getMyLeaveRequests: () => api.get<LeaveRequest[]>('/leave-request'),
  getById: (id: string) => api.get<LeaveRequest>(`/leave-request/${id}`),
  create: (data: CreateLeaveRequestDto) => api.post<LeaveRequest>('/leave-request', data),
  update: (id: string, data: UpdateLeaveRequestDto) => api.patch<LeaveRequest>(`/leave-request/${id}`, data),
  delete: (id: string) => api.delete(`/leave-request/${id}`),
};

// Leave Balance API
export const leaveBalanceAPI = {
  getByUserId: () => api.get<LeaveBalance[]>('/leave-balance'),
  getAll: () => api.get<LeaveBalance[]>('/leave-balance'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getAll: () => api.get('/users'),
};

export default api; 