// AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import socketService from '../socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          socketService.connect();
          if (userData?.id) socketService.joinUser(userData.id);
        }
      } catch (err) {
        console.error('Failed to load stored auth:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // Giống app: gửi emailOrUsername + password
      const response = await api.post('/auth/login', {
        emailOrUsername: username.trim(),
        password: password.trim()
      });

      console.log('Login response:', response);

      // App parse: response.data.data || response.data
      // Nhưng api.js đã unwrap thành response = data rồi
      const { token: newToken, user: userData } = response.data || response;

      if (!newToken || !userData) throw new Error('Dữ liệu đăng nhập không hợp lệ');

      const normalizedUser = {
        ...userData,
        id: String(userData.id || userData._id || ''),
        _id: String(userData.id || userData._id || ''),
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setToken(newToken);
      setUser(normalizedUser);

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      socketService.connect();
      if (userData?.id) socketService.joinUser(userData.id);

      return { success: true };
    } catch (err) {
      console.error('Login failed:', err?.response?.data);
      const message = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      // Giống app: gửi username + password + fullName (KHÔNG phải email)
      const response = await api.post('/auth/register', {
      email: username.trim(),
      password: password.trim(),
      fullName: fullName.trim()
    });

      console.log('Register response:', response);

      const { token: newToken, user: userData } = response.data || response;

      if (!newToken || !userData) throw new Error('Dữ liệu đăng ký không hợp lệ');

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      socketService.connect();
      if (userData?.id) socketService.joinUser(userData.id);

      return { success: true };
    } catch (err) {
      console.error('Register failed:', err?.response?.data);
      const message = err?.response?.data?.message || err?.message || 'Đăng ký thất bại';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      socketService.disconnect();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};