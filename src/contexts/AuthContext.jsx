import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, checkAuth } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      // Only try to verify if we have a token
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await checkAuth();
        setUser(userData);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
        // Clear tokens if auth check fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await apiLogin(username, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if logout API fails
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};