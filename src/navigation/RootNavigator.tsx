import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuthStore } from '../store/useAuthStore';
import CreateElectionScreen from '../screens/admin/CreateElectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ElectionDetailsScreen from '../screens/elections/ElectionDetailsScreen';
import ElectionListScreen from '../screens/elections/ElectionListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import VoteHistoryScreen from '../screens/votes/VoteHistoryScreen';
import VoteScreen from '../screens/votes/VoteScreen';

import { IconOutline } from '@ant-design/icons-react-native'
import { setOnUnauthorizedCallback } from '../api/axiosClient';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type VoterTabParamList = {
    ProfileTab: undefined;
    ElectionListTab: undefined;
    MyVotesTab: undefined;
}

export type AdminTabParamList = {
    ProfileTab: undefined;
    ElectionListTab: undefined;
    AddElectionTab: undefined;
}

export type MainStackParamList = {
    MainTabs: undefined;
    VoteScreen: { electionId: string, electionTitle: string };
    ElectionDetails: { electionId: string };
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const VoterTab = createBottomTabNavigator<VoterTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
)

const VoterTabNavigator = () => (
    <VoterTab.Navigator initialRouteName="ElectionListTab" screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563EB'
    }}>
        <VoterTab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name="user" size={size} color={color} />
                )
            }}
        />
        <VoterTab.Screen
            name="ElectionListTab"
            component={ElectionListScreen}
            options={{
                title: 'Election List',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name='unordered-list' size={size} color={color} />
                )
            }}
        />
        <VoterTab.Screen
            name="MyVotesTab"
            component={VoteHistoryScreen}
            options={{
                title: 'My Votes',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name='check-square' size={size} color={color} />
                )
            }}
        />
    </VoterTab.Navigator>
)

const AdminTabNavigator = () => (
    <AdminTab.Navigator initialRouteName="ElectionListTab" screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563EB'
    }}>
        <AdminTab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name="user" size={size} color={color} />
                )
            }}
        />
        <AdminTab.Screen
            name="ElectionListTab"
            component={ElectionListScreen}
            options={{
                title: 'Election List',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name='unordered-list' size={size} color={color} />
                )
            }} />
        <AdminTab.Screen
            name="AddElectionTab"
            component={CreateElectionScreen}
            options={{
                title: 'Add Election',
                tabBarIcon: ({ color, size }) => (
                    <IconOutline name='plus-circle' size={size} color={color} />
                )
            }} />
    </AdminTab.Navigator>
)

const MainAppNavigator = () => {
    const role = useAuthStore((state) => state.role);
    const isAdmin = role === 'ROLE_ELECTION_ADMIN';

    return (
        <MainStack.Navigator>
            <MainStack.Screen
                name="MainTabs"
                component={isAdmin ? AdminTabNavigator : VoterTabNavigator}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="VoteScreen"
                component={VoteScreen}
                options={({ route }) => ({
                    title: route.params.electionTitle || 'Voting',
                    headerBackTitle: 'Back'
                })}
            />
            <MainStack.Screen
                name="ElectionDetails"
                component={ElectionDetailsScreen}
                options={{ title: 'Election Details' }}
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

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}