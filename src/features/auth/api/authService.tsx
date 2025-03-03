import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL_AUTH = import.meta.env.VITE_BACK_API_URL_AUTH;

const getToken = () => Cookies.get('jwt');

const apiClient = axios.create({
  baseURL: API_URL_AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login Function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/login', { login: email, password });
    const  inFifteenMinutes = new Date(new Date().getTime() + 60 * 60 * 1000);
    const { token } = response.data;
    Cookies.set('jwt', token, { expires:inFifteenMinutes, path: '/' });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Fetch user error:', error);
    return null;
  }
};

export const passwordChange = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await apiClient.post('/change-password', { currentPassword, newPassword });
    return response;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('jwt');
  window.location.href = '/login';
};
