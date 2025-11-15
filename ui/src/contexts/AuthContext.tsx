import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, UserResponse } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { onboardingService } from '@/services/onboarding.service';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ redirectTo: string }>;
    logout: () => void;
    setUser: (user: UserResponse) => void;
    checkOnboardingStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const user = await authService.getCurrentUser();
                    setAuthState({
                        user,
                        token,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    setAuthState({
                        user: null,
                        token: null,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    token: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<{ redirectTo: string }> => {
        try {
            const tokenData = await authService.login({ email, password });
            localStorage.setItem('access_token', tokenData.access_token);

            const user = await authService.getCurrentUser();
            localStorage.setItem('user', JSON.stringify(user));

            setAuthState({
                user,
                token: tokenData.access_token,
                isLoading: false,
                isAuthenticated: true,
            });

            // Kiểm tra onboarding status sau khi login thành công
            const onboardingCompleted = await checkOnboardingStatus();
            console.log('Login - Onboarding completed status:', onboardingCompleted);

            if (onboardingCompleted) {
                console.log('Login - Redirecting to dashboard');
                return { redirectTo: "/dashboard" };
            } else {
                console.log('Login - Redirecting to onboarding');
                return { redirectTo: "/onboarding" };
            }
        } catch (error) {
            throw error;
        }
    };

    const checkOnboardingStatus = async (): Promise<boolean> => {
        try {
            const statusResponse = await onboardingService.getStatus();
            console.log('Onboarding status response:', statusResponse);
            return statusResponse.completed;
        } catch (error) {
            // Nếu có lỗi khi kiểm tra status, mặc định là chưa hoàn thành
            console.error('Error checking onboarding status:', error);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
        });
    };

    const setUser = (user: UserResponse) => {
        setAuthState(prev => ({
            ...prev,
            user,
        }));
        localStorage.setItem('user', JSON.stringify(user));
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                setUser,
                checkOnboardingStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
