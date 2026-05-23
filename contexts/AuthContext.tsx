import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  isAdmin: boolean;
  user: User | null;
  login: (emailOrUsername: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'celestial-capture-admin-session';
const USER_SESSION_KEY = 'celestial-capture-user-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch (error) {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  // Hardcoded credentials as per the user request
  const ADMIN_USERNAME = 'AfonsoAdmin';
  const ADMIN_PASSWORD = '12345678';

  const login = async (emailOrUsername: string, password?: string): Promise<boolean> => {
    if (emailOrUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      } catch (error) {
        setIsAdmin(true);
        return true;
      }
    }

    // Regular user login
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUsername }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error", err);
      return false;
    }
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Registration error", err);
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
      console.error(error);
    }
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, user, login, register, logout }}>
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