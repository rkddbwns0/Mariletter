import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from './api';
import {ActivityIndicator, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

interface UserProfile {
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  logined: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [logined, setLogined] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChanged, setAuthChanged] = useState(false);

  const triggerAuthCheck = () => setAuthChanged(p => !p);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      if (accessToken && refreshToken) {
        try {
          const response = await instance.get<UserProfile>('auth/profile', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'refresh-token': refreshToken,
            },
          });
          setUser(response.data);
          setLogined(true);
        } catch (error) {
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          setUser(null);
          setLogined(false);
        }
      } else {
        setUser(null);
        setLogined(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [authChanged]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('토큰 인증');
      triggerAuthCheck();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await instance.post('auth/login', {email, password});

      const accessToken = res.data?.accessToken || res.data?.access_token;
      const refreshToken = res.data?.refreshToken || res.data?.refresh_token;

      if (typeof accessToken === 'string' && typeof refreshToken === 'string') {
        await AsyncStorage.setItem('access_token', accessToken);
        await AsyncStorage.setItem('refresh_token', refreshToken);
        triggerAuthCheck();
      } else {
        console.error('Login error: Server response missing tokens.', res.data);
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        setUser(null);
        setLogined(false);
        setIsLoading(false);
        throw new Error('Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      setUser(null);
      setLogined(false);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    triggerAuthCheck();
  };

  const value = {
    user,
    isLoading,
    logined,
    login,
    logout,
    triggerAuthCheck,
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
