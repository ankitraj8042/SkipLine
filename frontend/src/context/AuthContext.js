import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const data = role === 'admin' 
        ? await authAPI.adminLogin(email, password)
        : await authAPI.userLogin(email, password);
      
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      let message = 'Login failed';
      if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.errors && errorData.errors.length > 0) {
        message = errorData.errors[0].message;
      }
      return { success: false, message };
    }
  };

  const register = async (userData, role) => {
    try {
      const data = role === 'admin'
        ? await authAPI.adminRegister(userData)
        : await authAPI.userRegister(userData);
      
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      let message = 'Registration failed';
      if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.errors && errorData.errors.length > 0) {
        message = errorData.errors[0].message;
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currentQueueEntry');
    setUser(null);
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'organizer');
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
