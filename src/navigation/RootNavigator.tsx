import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { User, List, CheckSquare, PlusCircle } from 'lucide-react-native';

import { useAuthStore } from '../store/useAuthStore';
import { setOnUnauthorizedCallback } from '../api/axiosClient';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

import CreateElectionScreen from '../screens/admin/CreateElectionScreen';
import ElectionDetailsScreen from '../screens/elections/ElectionDetailsScreen';
import ElectionListScreen from '../screens/elections/ElectionListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import VoteHistoryScreen from '../screens/votes/VoteHistoryScreen';
import VoteScreen, { Election } from '../screens/votes/VoteScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { email?: string } | undefined;
    Verification: { email?: string } | undefined;
};

export type VoterTabParamList = {
    ProfileTab: undefined;
    ElectionListTab: undefined;
    MyVotesTab: undefined;
};

export type AdminTabParamList = {
    ProfileTab: undefined;
    ElectionListTab: undefined;
    AddElectionTab: undefined;
};

export type MainStackParamList = {
    MainTabs: undefined;
    VoteScreen: { electionId: string, electionTitle: string };
    ElectionDetails: { electionId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const VoterTab = createBottomTabNavigator<VoterTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <AuthStack.Screen name="Verification" component={VerificationScreen} />
    </AuthStack.Navigator>
);

const VoterTabNavigator = () => (
    <VoterTab.Navigator
        initialRouteName="ElectionListTab"
        screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: '#2563EB',
        }}
    >
        <VoterTab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
        />
        <VoterTab.Screen
            name="ElectionListTab"
            component={ElectionListScreen}
            options={{
                title: 'Popis izbora',
                tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
            }}
        />
        <VoterTab.Screen
            name="MyVotesTab"
            component={VoteHistoryScreen}
            options={{
                title: 'Moji glasovi',
                tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
            }}
        />
    </VoterTab.Navigator>
);

const AdminTabNavigator = () => (
    <AdminTab.Navigator
        initialRouteName="ElectionListTab"
        screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: '#2563EB',
        }}
    >
        <AdminTab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
                title: 'Profil',
                tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
        />
        <AdminTab.Screen
            name="ElectionListTab"
            component={ElectionListScreen}
            options={{
                title: 'Popis izbora',
                tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
            }}
        />
        <AdminTab.Screen
            name="AddElectionTab"
            component={CreateElectionScreen}
            options={{
                title: 'Kreiraj izbor',
                tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
            }}
        />
    </AdminTab.Navigator>
);

const MainAppNavigator = () => {
    const role = useAuthStore((state) => state.role);
    const isAdmin = role ? role.toUpperCase().includes('ADMIN') : false;

    return (
        <MainStack.Navigator key={isAdmin ? 'admin-stack' : 'voter-stack'}>
            {isAdmin ? (
                <MainStack.Screen
                    name="MainTabs"
                    component={AdminTabNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <MainStack.Screen
                    name="MainTabs"
                    component={VoterTabNavigator}
                    options={{ headerShown: false }}
                />
            )}
            <MainStack.Screen
                name="VoteScreen"
                component={VoteScreen}
                options={({ route }) => ({
                    title: route.params.electionTitle || 'Voting',
                    headerBackTitle: 'Back',
                })}
            />
            <MainStack.Screen
                name="ElectionDetails"
                component={ElectionDetailsScreen}
                options={{ title: 'Detalji izbora' }}
            />
        </MainStack.Navigator>
    );
};

export const RootNavigator = () => {
    const { isAuthenticated, isLoading, initializeAuth, logout } = useAuthStore();

    useEffect(() => {
        setOnUnauthorizedCallback(() => {
            logout();
        });

        initializeAuth();
    }, [initializeAuth, logout]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />;
};