import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth?action=login' : 'http://localhost:3001/api/auth?action=login';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        const { user: userData, token: authToken } = result.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error logging in. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth?action=register' : 'http://localhost:3001/api/auth?action=register';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        const { user: newUser, token: authToken } = result.data;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Error creating account. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth?action=logout' : 'http://localhost:3001/api/auth?action=logout';
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth?action=forgot-password' : 'http://localhost:3001/api/auth?action=forgot-password';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Error processing password reset request. Please try again.' };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth?action=reset-password' : 'http://localhost:3001/api/auth?action=reset-password';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Error resetting password. Please try again.' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
