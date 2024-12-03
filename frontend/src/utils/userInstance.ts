import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
// Set the base URL for API from the environment variable
const API_URL = import.meta.env.VITE_API_URL;

/// Set the user Token from cookies
let lastTokenCheck = { token: '', isValid: false, checkedAt: 0 };
// Function to verify the token
export const verifyToken = () => {
  const currentToken = Cookies.get('token');
  const currentTime = Date.now() / 1000;

  // If the token hasn't changed and it was checked within the last minute, return the cached result
  if (lastTokenCheck.token === currentToken && currentTime - lastTokenCheck.checkedAt < 60) {
    return lastTokenCheck.isValid;
  }

  if (!currentToken || currentToken === '') {
    lastTokenCheck = { token: currentToken || '', isValid: false, checkedAt: currentTime };
    return false;
  }

  try {
    const decodedToken = jwtDecode(currentToken);
    const isTokenValid = decodedToken.exp > currentTime;

    if (!isTokenValid) {
      Cookies.remove('token');
    }
    
    lastTokenCheck = { token: currentToken, isValid: isTokenValid, checkedAt: currentTime };
    return isTokenValid;
  } catch (error) {
    return false;
  }
};


// Create an Axios instance with a base URL 
const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
});

// Add JWT token to requests
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${lastTokenCheck.token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses
instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            useNavigate()('/login');
        }
        return Promise.reject(error);
    }
);

export default instance;