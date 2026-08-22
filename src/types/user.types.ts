export type UserRole = 'Super admin' | 'Admin' | 'Voter' | 'Unknown';

export interface UserResponse {
  username: string;
  role: UserRole;
  createdAt: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
  tokenIssued?: boolean;
}