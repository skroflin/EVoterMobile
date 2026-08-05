import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    ScrollView
} from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";
import { registerSchema, RegisterFormData } from "../../types/auth.types";
import { AuthStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const register = useAuthStore((state) => state.register);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsSubmitting(true);
            await register({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                password: data.password,
            });
            Alert.alert(
                'Registration successful.',
                'You account was successfully created, you may login now.',
                [{ text: 'Okay', onPress: () => navigation.navigate('Login') }]
            )
        } catch (error: any) {
            const message =
                error?.response?.data?.message || 'An error occured while registration.';
            Alert.alert('Error upon registration', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Registration</Text>
                    <Text style={styles.subtitle}>Create an account for e-Voting system</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First name</Text>
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.firstName && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter your first name..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.firstName && (
                            <Text style={styles.errorText}>{errors.firstName.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last name</Text>
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.lastName && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter your last name..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.lastName && (
                            <Text style={styles.errorText}>{errors.lastName.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.username && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCapitalize="none"
                                    placeholder="Enter your username..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.username && (
                            <Text style={styles.errorText}>{errors.username.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail address</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="Enter your email address..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                    placeholder="Enter your password..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm password</Text>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                    placeholder="Confirm your password..."
                                    placeholderTextColor="#94A3B8"
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF"/>
                        ) : (
                            <Text style={styles.primaryButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Login')}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.secondaryButtonText}>
                            Already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '500',
    },
});