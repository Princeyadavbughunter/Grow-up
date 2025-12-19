
// @ts-nocheck
'use client'
import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

// Define interfaces for the profile data
interface WorkExperience {
  id: string;
  company_name?: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

interface FreelancerProfile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  profile_picture: string;
  address: string;
  lat: number | null;
  long: number | null;
  city: string;
  district: string;
  pincode: number;
  state: string;
  interest_in: string;
  hobbies: string;
  highest_qualification: string;
  passing_year: string;
  created_at: string;
  degree_name: string;
  is_degree: boolean;
  is_diploma: boolean;
  diploma_name: string;
  is_disabled: boolean;
  resume: string | null;
  skills: string;
  gender: string;
  saved_jobs_count: number;
  follower_count: number;
  dribble_account: string | null;
  github_account: string | null;
  figma_account: string | null;
  youtube_account: string | null;
  medium_account: string | null;
  soft_skills: string;
  position: string;
  user: string;
  work_experience: WorkExperience[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  userId: string | null;
  loading: boolean;
  profileData: FreelancerProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileId: string, updatedData: Partial<FreelancerProfile>) => Promise<void>;
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
  
  // Add profile state
  const [profileData, setProfileData] = useState<FreelancerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

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
      return Promise.reject(error);
    }
  );

  // Add function to fetch profile data
  const fetchProfileData = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setProfileLoading(true);
    setProfileError(null);
    
    try {
      const response = await apiCaller.get('/freelancer/freelancer-profile/');
      
      if (response.data && response.data.length > 0) {
        setProfileData(response.data[0]);
      } else {
        setProfileData(null);
        setProfileError('No profile data found');
      }
    } catch (err: any) {
      console.error('Error fetching freelancer profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to fetch profile data');
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // Add function to update profile data
  const updateProfile = async (profileId: string, updatedData: Partial<FreelancerProfile>): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      await apiCaller.patch(`/freelancer/freelancer-profile/${profileId}/`, updatedData);
      // Refresh profile data after successful update
      await fetchProfileData();
    } catch (err: any) {
      console.error('Error updating freelancer profile:', err);
      throw new Error(err.response?.data?.message || 'Failed to update profile data');
    }
  };

  // Fetch profile data when authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchProfileData();
    }
  }, [isAuthenticated, loading]);

  // Logout function 
  const logout = async () => {
    try {
      if (authToken) {
        await apiCaller.post('/auth/revoke-access-token/');
      }
    } catch (error) {
      console.error("Error revoking token:", error);
    } finally {
      setAuthToken(null);
      setRefreshToken(null);
      setUserId(null);
      setIsAuthenticated(false);
      setProfileData(null);
      
      // Remove cookies
      Cookies.remove('access_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      Cookies.remove('user_id', { path: '/' });
      
      window.location.href = '/';
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    authToken,
    userId,
    loading,
    profileData,
    profileLoading,
    profileError,
    setIsAuthenticated,
    apiCaller,
    logout,
    refreshProfile: fetchProfileData,
    updateProfile
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
