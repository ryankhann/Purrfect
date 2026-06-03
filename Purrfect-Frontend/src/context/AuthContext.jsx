import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('purrfect_token'));

  // On mount / token change, fetch current user
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || 'https://purrfect-backend-f78x.onrender.com'}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('purrfect_token');
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('purrfect_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('purrfect_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};