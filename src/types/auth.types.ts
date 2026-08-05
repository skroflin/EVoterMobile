import { z } from 'zod';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    expiresIn: number;
    username: string;
    role: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface VerificationRequest {
    email: string;
    code: string;
}

export interface MessageResponse {
    message: string;
}

export interface ResetPasswordRequest {
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface AuthState {
    token: string | null;
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    initializeAuth: () => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (credentials: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Username is necessary"),
    password: z
        .string()
        .min(6, "Password must contain at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(2, "Name must have at least 2 characters"),
    lastName: z
        .string()
        .min(4, "Surname must have at least 4 characters"),
    username: z
        .string()
        .min(3, "Username must have at least 2 characters"),
    email: z
        .email("Use a correct email address"),
    password: z
        .string()
        .min(6, "Password must have at least 6 characters"),
    confirmPassword: z
        .string()
        .min(1, "Confirm your password")
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords aren't matchnihg",
        path: ['confirmPassword']
    });

export type RegisterFormData = z.infer<typeof registerSchema>;