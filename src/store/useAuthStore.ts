import { create } from 'zustand';
import { loginUser, registerUser, logoutUser as apiLogout } from '../api/api';
import {
    getAuthToken,
    getUsername,
    getRole
} from '../utils/helper';

import type { LoginRequest, RegisterRequest, AuthState } from '../types/auth.types';

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

    register: async (credentials: RegisterRequest) => {
        await registerUser(credentials);
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