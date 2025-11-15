import apiClient from '@/lib/api-client';
import { UserLogin, UserRegister, UserResponse, Token } from '@/types/auth';

export const authService = {
    async login(data: UserLogin): Promise<Token> {
        const response = await apiClient.post<Token>('/auth/login', data);
        return response.data;
    },

    async register(data: UserRegister): Promise<UserResponse> {
        const response = await apiClient.post<UserResponse>('/auth/register', data);
        return response.data;
    },

    async getCurrentUser(): Promise<UserResponse> {
        const response = await apiClient.get<UserResponse>('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};
