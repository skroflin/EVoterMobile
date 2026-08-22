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

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is mandatory'),
    lastName: z.string().trim().min(1, 'Last name is mandatory'),
    username: z.string().trim().min(1, 'Username is mandatory'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is mandatory')
      .email('Invalid email address')
      .refine((val) => val.toLowerCase().endsWith('@ffos.hr'), {
        message: 'Only @ffos.hr email domain is allowed',
      }),
    password: z
      .string()
      .min(8, 'Password must have at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;