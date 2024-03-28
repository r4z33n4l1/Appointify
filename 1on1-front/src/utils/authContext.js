"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { accessValid, refresh, login as loginHelper , removeTokens} from './authHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        const isValid = accessValid();
        if (isValid) {
            setAuthState({
                accessToken: localStorage.getItem('access'),
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            const refreshed = await refresh();
            if (refreshed) {
                setAuthState({
                    accessToken: localStorage.getItem('access'),
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                logout();
            }
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            await loginHelper(username, password);
            await checkAuthStatus();
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setAuthState((prevState) => ({
                ...prevState,
                isLoading: false,
            }));
        }
    };

    const logout = useCallback(() => {
        removeTokens();
        setAuthState({
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
        });
        router.push('/login');
    }, [router]);

    const setLoading = (isLoading) => {
        setAuthState((prevState) => ({
            ...prevState,
            isLoading,
        }));
    };

    const contextValue = {
        ...authState,
        login,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{!authState.isLoading ? children : <p>Loading...</p>}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
