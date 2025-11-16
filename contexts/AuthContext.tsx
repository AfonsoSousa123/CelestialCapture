import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'celestial-capture-admin-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch (error) {
      console.error("Could not access localStorage to check admin session", error);
      return false;
    }
  });

  // Hardcoded credentials as per the user request
  const ADMIN_USERNAME = 'AfonsoAdmin';
  const ADMIN_PASSWORD = '12345678';

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      } catch (error) {
        console.error("Could not save admin session to localStorage", error);
        // Still allow login for the current session even if localStorage fails
        setIsAdmin(true);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error) {
      console.error("Could not remove admin session from localStorage", error);
    }
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};