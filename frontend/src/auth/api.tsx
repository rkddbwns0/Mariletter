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
    if (error.response.status === 401 || error.response.status === 403) {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      const logout = async () => {
        await axios.post('/auth/logout');
        navigate('IndexPage');
      };
    }
  },
);

export default instance;
