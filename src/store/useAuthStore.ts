import { create } from 'zustand';
import { loginUser, logoutUser as apiLogout } from '../api/api';
import {
    getAuthToken,
    getUsername,
    getRole
} from '../utils/helper';

import type { LoginRequest } from '../types/auth.types';

interface AuthState {
    token: string | null;
    username: string | null;
    role: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    initializeAuth: () => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    username: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,

    initializeAuth: async () => {
        try {
            set({ isLoading: true });
            const token = await getAuthToken();
            const username = await getUsername();
            const role = await getRole();

            if (token) {
                set({
                    token,
                    username,
                    role,
                    isAuthenticated: true,
                });
            } else {
                set({
                    token: null,
                    username: null,
                    role: null,
                    isAuthenticated: false
                });
            }
        } catch (error) {
            console.error('Error upon initializing auth state', error);
            set({
                token: null,
                username: null,
                role: null,
                isAuthenticated: false
            });
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (credentials: LoginRequest) => {
        const response = await loginUser(credentials);

        set({
            token: response.token,
            username: response.username,
            role: response.role,
            isAuthenticated: true
        });
    },

    logout: async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Error upon user logout', error);
        } finally {
            set({
                token: null,
                username: null,
                role: null,
                isAuthenticated: false
            });
        }
    },
}));