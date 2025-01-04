'use client'
import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import axios, { AxiosInstance } from 'axios';


interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  loading: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
}

interface AuthProviderProps {
  children: ReactNode;
}

const baseURL = process.env.EXPO_PUBLIC_URL as string;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwNzM2MzYzLCJpYXQiOjE3MzQ5NjgzNjMsImp0aSI6IjI1ZDE5NjkwMWE0ZjRlNjA4YzQxYjQ4MWRmMWI2NDRkIiwidXNlcl9pZCI6ImVjNzY5YzUyLTMxNzgtNDU4Ny1hMWY2LTRjODIyOGNjZDdjYiJ9.qHy0jEum5VS1ifW-nUhCu1M5Bo4rUNoB8K9szpq295E');
  const [loading, setLoading] = useState<boolean>(true);


  const apiCaller = axios.create({
    baseURL,
    onUploadProgress: (progressEvent) => {},
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  apiCaller.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  const contextValue: AuthContextType = {
    isAuthenticated,
    authToken,
    loading,
    setIsAuthenticated,
    apiCaller,
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