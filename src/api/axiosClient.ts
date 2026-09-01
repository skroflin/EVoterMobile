import axios from "axios";
import { getAuthToken } from "../utils/helper";

const BASE_URL = 'http://10.0.2.2:8080/e-voting-rest-api/v1'

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
    onUnauthorizedCallback = callback;
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            if (onUnauthorizedCallback) {
                onUnauthorizedCallback();
            }
        }
        return Promise.reject(error);
    }
);