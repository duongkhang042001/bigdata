import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Base API URL - có thể config từ environment
const BASE_URL = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : "http://localhost:19999/api/v1";

console.log('API Base URL:', BASE_URL);
console.log('Environment VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);


// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 0,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor để tự động thêm token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Nếu token hết hạn (401), xóa token và redirect về login
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;