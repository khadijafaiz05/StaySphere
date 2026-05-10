import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_user')); } catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem('ss_user', JSON.stringify(userData));
    localStorage.setItem('ss_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ss_user');
    localStorage.removeItem('ss_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
