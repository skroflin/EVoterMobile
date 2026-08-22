import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain from 'react-native-keychain';

export async function setAuthToken(token: string): Promise<boolean> {
    try {
        await Keychain.setGenericPassword('jwt', token);
        return true;
    } catch (error) {
        console.error('Error setting auth token:', error);
        return false;
    }
}

export async function getAuthToken(): Promise<string> {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            return credentials.password;
        }
        return '';
    } catch (error) {
        console.error('Error getting auth token:', error);
        return '';
    }
}

export async function clearAuthToken(): Promise<void> {
    try {
        await Keychain.resetGenericPassword();
    } catch (error) {
        console.error('Error removing auth token:', error);
    }
}

export async function setUsername(username: string): Promise<void> {
    await AsyncStorage.setItem('username', username);
}

export async function getUsername(): Promise<string> {
    return (await AsyncStorage.getItem('username')) || '';
}

export async function setRole(role: string): Promise<string> {
    await AsyncStorage.setItem('role', role);
    return role;
}

export async function getRole(): Promise<string> {
    return (await AsyncStorage.getItem('role')) || '';
}

export async function isUserAuthorized(): Promise<boolean> {
    const token = await getAuthToken();
    const username = await getUsername();
    const role = await getRole();
    return !!token && !!username && !!role;
}

export async function clearAuthData(): Promise<void> {
    try {
        await clearAuthToken();
        await Promise.all([
            AsyncStorage.removeItem('username'),
            AsyncStorage.removeItem('role'),
        ]);
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
}