import axios from 'axios';
import Cookies from 'js-cookie';  
const API_URL = 'http://localhost:3000/auth';

// Function to handle login
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      login: email,
      password,
    });

    const { token } = response.data;
    Cookies.set('jwt', token, { expires: 7, path: '' });  
    return response.data;
  } catch (error) {
    throw new Error('Login failed!');
  }
};

export const fetchUserProfile = async () => {
  const token = Cookies.get('jwt');  
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
