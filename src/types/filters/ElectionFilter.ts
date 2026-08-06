import { ElectionStatus } from "../election.types";

export interface ElectionFilter {
    title?: string;
    status?: ElectionStatus;
    candidateName?: string;
    startDate?: string;
    endDate?: string;
}