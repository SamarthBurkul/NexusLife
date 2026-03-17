import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexuslife_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('nexuslife_token', jwtToken);
    setToken(jwtToken);
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      setUser(payload);
    } catch {
      console.error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem('nexuslife_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
