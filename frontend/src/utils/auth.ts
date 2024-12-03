import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('API_URL environment variable is not defined');
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, 
    { email, password },
    { withCredentials: true }  // Important for handling cookies
  );
  return response.data;
};