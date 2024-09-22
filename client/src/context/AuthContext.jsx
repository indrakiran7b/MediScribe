import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',  // Make sure this matches your backend URL
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log(response.data.data);
      setUser(response.data.data.user);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      setLoading(false);
      throw err;
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signup', userData);
      setUser(response.data.data.user);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
      setLoading(false);
      throw err;
    }
  };
  const googleSignIn = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/google-signin', { credential });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during Google Sign-In');
      setLoading(false);
      throw err;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await api.get('/auth/me'); // Assuming you have a /me endpoint to get user data
        setUser(response.data.data.user);
      } catch (err) {
        console.error('Error checking auth status:', err);
        logout(); // If token is invalid or expired, log out the user
      }
    }
  };

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, googleSignIn, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


