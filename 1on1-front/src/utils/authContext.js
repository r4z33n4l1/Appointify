"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { accessValid, refresh, login as loginHelper , removeTokens} from './authHelper';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        isAuthenticated: false,
        isLoading: true,
        tokenName: "",
    });
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        const isValid = accessValid();
        if (isValid) {
            const accessToken = localStorage.getItem('access');
            const decoded = accessToken ? jwtDecode(accessToken) : null;
            setAuthState({
                accessToken: accessToken,
                isAuthenticated: true,
                isLoading: false,
                tokenName: decoded ? decoded.username : "",
            });
        } else {
            const refreshed = await refresh();
            if (refreshed) {
                const accessToken = localStorage.getItem('access');
                const decodedToken = accessToken ? jwtDecode(accessToken) : null;
                setAuthState({
                    accessToken: accessToken,
                    isAuthenticated: true,
                    isLoading: false,
                    tokenUsername: decodedToken ? decodedToken.username : "", // Set username from decoded token
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
        try {
          setLoading(true);
          const isSuccess = await loginHelper(username, password);
          if (isSuccess) {
            await checkAuthStatus();
            router.push('/dashboard');
          } else {
            // Handle the failed login attempt
            throw new Error('Login failed. Please check your credentials.');
          }
        } catch (error) {
          // Here, set an error state to show the error in the UI
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false,
            error: error.message, // Add an error property to your authState
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
