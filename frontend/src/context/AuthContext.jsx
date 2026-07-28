import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
      // Simple parse JWT claims
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdmin({ username: payload.username });
      } catch (e) {
        logout();
      }
    } else {
      localStorage.removeItem('admin_token');
      setAdmin(null);
    }
  }, [token]);

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: isAuthenticated() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
