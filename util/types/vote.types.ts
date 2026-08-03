export interface VoteRequest {
    candidateUUID: string;
    token: string;
}

export interface VoteResponse {
    voteUUID: string;
    castAt: string;
    message: string;
    electionName: string;
}

export interface VoterVoteHistoryResponse {
    electionId: string;
    electionName: string;
    votedAt: string;
}

export interface VotingTokenResponse {
    token: string;
}