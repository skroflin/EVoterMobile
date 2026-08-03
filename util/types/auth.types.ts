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