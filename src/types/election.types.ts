export enum ElectionStatus {
    PREPARATION = 'Preparation',
    ACTIVE = 'Active',
    CLOSED = 'Closed',
    UNKNOWN = 'Unknown',
}

export interface CandidateRequest {
    name: string;
    bio: string;   
}

export interface CandidateResponse {
    id: string;
    name: string;
    bio: string;
}

export interface ElectionRequest {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    candidates: CandidateRequest[];
}

export interface ElectionResponse {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    candidates: CandidateResponse[];
    isActive?: boolean;
    status?: ElectionStatus
}

export interface CandidateResultResponse {
    fullName: string;
    candidateUUID: string;
    voteCount: number;
}

export interface ElectionResultResponse {
    electionName: string;
    isClosed: boolean;
    results: CandidateResultResponse[];
    message: string;
}

export interface ElectionStatusUpdateRequest {
    status: ElectionStatus;
}