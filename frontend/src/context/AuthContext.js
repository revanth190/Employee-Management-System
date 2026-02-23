import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() => localStorage.getItem('emsa_token'));

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('emsa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (authData) => {
    console.log('AuthContext.login received:', authData);
    const token = authData.token || authData.accessToken;
    const user = authData.user || {
      id: authData.accountId,
      username: authData.username,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role
    };

    console.log('Storing token and user in localStorage, role=', user.role);
    console.log('Token length:', token ? token.length : 'null');
    console.log('User object:', JSON.stringify(user));

    setToken(token);
    setUser(user);

    localStorage.setItem('emsa_token', token);
    localStorage.setItem('emsa_user', JSON.stringify(user));
    
    console.log('Stored in localStorage. Check:', {
      token_stored: !!localStorage.getItem('emsa_token'),
      user_stored: !!localStorage.getItem('emsa_user'),
      user_role: localStorage.getItem('emsa_user') ? JSON.parse(localStorage.getItem('emsa_user')).role : 'N/A'
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('emsa_token');
    localStorage.removeItem('emsa_user');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isManager = () => user?.role === 'MANAGER';
  const isEmployee = () => user?.role === 'EMPLOYEE';
  const isUser = () => user?.role === 'USER';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isManager, isEmployee, isUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
