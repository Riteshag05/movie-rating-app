import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            logout();
            toast.warn('Your session has expired. Please login again.');
          } else {
            // Set current user from token
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUserData();
          }
        } catch (error) {
          console.error('Invalid token', error);
          logout();
        }
      } else {
        setIsLoading(false);
      }
    };
    
    checkToken();
  }, []);

  const fetchUserData = async () => {
    try {
      // In a real app, you might want to fetch the current user data
      // For now, we'll just use the token's data
      const token = localStorage.getItem('token');
      const decoded = jwt_decode(token);
      setCurrentUser(decoded);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data', error);
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/users/login', { email, password });
      
      const { token, data: { user } } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/users/signup', { name, email, password });
      
      const { token, data: { user } } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove token from axios headers
    delete api.defaults.headers.common['Authorization'];
    
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 