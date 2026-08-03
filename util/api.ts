import axios from 'axios';
import { clearAuthData, getAuthToken, setAuthToken, setRole, setUsername } from './helper';
import type {
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    ForgotPasswordRequest, 
    ResetPasswordRequest, 
    VerificationRequest, 
    MessageResponse
} from './types/auth.types';

import type {
    VoteRequest,
    VoteResponse,
    VoterVoteHistoryResponse,
    VotingTokenResponse
} from './types/vote.types';

import type {
    ElectionRequest,
    ElectionResponse,
    ElectionResultResponse,
    ElectionStatusUpdateRequest,
    CandidateRequest,
    CandidateResponse
} from './types/election.types';

const BASE_URL = 'http://10.0.2.2:3000/e-voting-rest-api';

async function getHeaders() {
    const token = await getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function apiGetCall<Res>(route: string): Promise<Res> {
    const headers = await getHeaders();
    const response = await axios.get<Res>(`${BASE_URL}${route}`, { headers });
    return response.data;
}

async function apiPostCall<Req, Res>(route: string, data: Req): Promise<Res> {
    const headers = await getHeaders();
    const response = await axios.post<Res>(`${BASE_URL}${route}`, data, { headers });
    return response.data;
}

async function apiPatchCall<Req, Res>(route: string, data: Req): Promise<Res> {
    const headers = await getHeaders();
    const response = await axios.patch<Res>(`${BASE_URL}${route}`, data, { headers });
    return response.data;
}

export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    const response = await apiPostCall<LoginRequest, LoginResponse>('/auth/login', loginRequest);

    if (response.token) {
        await setAuthToken(response.token);
        await setUsername(response.username);
        await setRole(response.role);
    }

    return response;
}

export const registerUser = (registerRequest: RegisterRequest) => 
    apiPostCall<RegisterRequest, MessageResponse>('auth/register', registerRequest);

export const verifyUser = (verifyRequest: VerificationRequest) =>
    apiPostCall<VerificationRequest, MessageResponse>('auth/verify', verifyRequest);

export const forgotPassword = (forgotPasswordRequest: ForgotPasswordRequest) =>
    apiPostCall<ForgotPasswordRequest, MessageResponse>('auth/forgot-password', forgotPasswordRequest);

export const resetPassword = (resetPasswordRequest: ResetPasswordRequest) =>
    apiPostCall<ResetPasswordRequest, MessageResponse>('auth/reset-password', resetPasswordRequest);

export const logoutUser = async(): Promise<void> => {
    await clearAuthData();
}