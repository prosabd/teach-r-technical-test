import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined. Set it in .env.production (or pass as a Docker build-arg) before building.');
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

export const authenticatedRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true
});