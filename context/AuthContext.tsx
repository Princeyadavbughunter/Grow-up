'use client'
import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  userId: string | null;
  loading: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthTokens {
  access: string;
  refresh: string;
  user?: string;
}

const baseURL = process.env.NEXT_PUBLIC_URL as string;
const COOKIE_OPTIONS = {
  expires: 7, 
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/'
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthState = () => {
      try {
        const accessToken = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');
        const userInfo = Cookies.get('user_id');
        
        if (accessToken && refreshToken) {
          setAuthToken(accessToken);
          setRefreshToken(refreshToken);
          setIsAuthenticated(true);
          
          if (userInfo) {
            const idMatch = userInfo.match(/id - ([0-9a-f-]+)/);
            if (idMatch && idMatch[1]) {
              setUserId(idMatch[1]);
            }
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuthState();
  }, []);

  const apiCaller = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    if (authToken) {
      apiCaller.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete apiCaller.defaults.headers.common['Authorization'];
    }
  }, [authToken, apiCaller]);

  apiCaller.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      //   originalRequest._retry = true;
        
      //   try {
      //     // Implement your token refresh logic here
      //     const response = await axios.post(`${baseURL}/api/auth/token/refresh/`, {
      //       refresh: refreshToken
      //     });
          
      //     const newAccessToken = response.data.access;
          
      //     // Update token in state and cookies
      //     setAuthToken(newAccessToken);
      //     Cookies.set('access_token', newAccessToken, COOKIE_OPTIONS);
          
      //     // Retry the original request with new token
      //     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      //     return axios(originalRequest);
      //   } catch (refreshError) {
      //     // If refresh fails, log out user
      //     logout();
      //     return Promise.reject(refreshError);
      //   }
      // }
      
      return Promise.reject(error);
    }
  );

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    
    // Remove cookies
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('user_id', { path: '/' });
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    authToken,
    userId,
    loading,
    setIsAuthenticated,
    apiCaller,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthenticatedApi = () => {
  const { authToken } = useAuth();

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(
    (config) => {
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return { api };
};