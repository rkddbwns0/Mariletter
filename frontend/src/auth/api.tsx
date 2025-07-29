import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {navigate} from '../utils/navigationSerivce';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:3000',
});

instance.interceptors.request.use(async config => {
  const access_token = await AsyncStorage.getItem('access_token');
  const refresh_token = await AsyncStorage.getItem('refresh_token');

  if (access_token) {
    config.headers['Authorization'] = `Bearer ${access_token}`;
  }

  if (refresh_token) {
    config.headers['refresh-token'] = refresh_token;
  }

  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!accessToken || !refreshToken) {
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          navigate('IndexPage');
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          'http://10.0.2.2:3000/auth/profile',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'refresh-token': refreshToken,
            },
          },
        );

        const newAccessToken = refreshResponse.data?.access_token;
        const newRefreshToken = refreshResponse.data?.refresh_token;

        if (newAccessToken && newRefreshToken) {
          await AsyncStorage.setItem('access_token', newAccessToken);
          await AsyncStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['refresh-token'] = newRefreshToken;

          return instance(originalRequest);
        } else {
          console.error(
            'Token refresh failed: Invalid response from server.',
            refreshResponse.data,
          );
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          navigate('IndexPage');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        navigate('IndexPage');
        return Promise.reject(refreshError);
      }
    } else if (error.response.status === 403) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      navigate('IndexPage');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default instance;
