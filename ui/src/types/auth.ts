export enum GenderEnum {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    email: string;
    password: string;
    full_name: string;
    gender?: GenderEnum;
    age?: number;
    height?: number; // cm
    weight?: number; // kg
}

export interface UserResponse {
    id: number;
    email: string;
    full_name: string;
    gender?: string;
    age?: number;
    height?: number;
    weight?: number;
    is_active: boolean;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: UserResponse | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
