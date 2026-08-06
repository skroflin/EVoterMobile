import axios from 'axios';
import { clearAuthData, getAuthToken, setAuthToken, setRole, setUsername } from '../utils/helper';

import { SpringPage } from '../types/api.types';

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerificationRequest,
    MessageResponse
} from '../types/auth.types';

import type {
    VoteRequest,
    VoteResponse,
    VoterVoteHistoryResponse,
    VotingTokenResponse
} from '../types/vote.types';

import type {
    ElectionRequest,
    ElectionResponse,
    ElectionResultResponse,
    ElectionStatusUpdateRequest,
    CandidateRequest,
    CandidateResponse
} from '../types/election.types';
import { ElectionFilter } from '../types/filters/ElectionFilter';

const BASE_URL = 'http://10.0.2.2:3000/e-voting-rest-api/api/v1/';

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

export const logoutUser = async (): Promise<void> => {
    await clearAuthData();
}

export const getAllElections = (filter?: ElectionFilter, page = 0, size = 10, sort = 'createdAt,asc') => {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);

    if (filter) {
        if (filter.title?.trim()) {
            params.append('title', filter.title.trim());
        }

        if (filter.status) {
            params.append('status', filter.status);
        }

        if (filter.candidateName?.trim()) {
            params.append('candidateName', filter.candidateName.trim());
        }

        if (filter.startDate) {
            params.append('startDate', filter.startDate);
        }

        if (filter.endDate) {
            params.append('endDate', filter.endDate);
        }
    }

    return apiGetCall<SpringPage<ElectionResponse>>(`elections?${params.toString()}`);
}

export const getElectionById = (id: string) =>
    apiGetCall<ElectionResponse>(`elections/${id}`)

export const createElection = (createElectionRequest: ElectionRequest) =>
    apiPostCall<ElectionRequest, ElectionResponse>('elections', createElectionRequest);

export const updateElectionStatus = (id: string, updateElectionStatusRequest: ElectionStatusUpdateRequest) =>
    apiPatchCall<ElectionStatusUpdateRequest, ElectionResponse>(`elections/${id}/status`, updateElectionStatusRequest);

export const addCandidateToElection = (electionId: string, addCandidateRequest: CandidateRequest) => 
    apiPostCall<CandidateRequest, CandidateResponse>(`elections/${electionId}/add-candidate`, addCandidateRequest);

export const generateVotingToken = (electionId: string) =>
    apiPostCall<Record<string, never>, VotingTokenResponse>(`votes/${electionId}/generate-token`, {});

export const castVote = (electionId: string, castVoteRequest: VoteRequest) => 
    apiPostCall<VoteRequest, VoteResponse>(`votes/${electionId}/vote`, castVoteRequest);

export const getElectionResults = (electionId: string) =>
    apiGetCall<ElectionResultResponse>(`votes/${electionId}/results`);

export const getMyVoteHistory = (page = 0, size = 10, sort = 'votedAt, asc') => 
    apiGetCall<SpringPage<VoterVoteHistoryResponse>>(`votes/my-votes?page=${page}&size=${size}&sort=${sort}`);