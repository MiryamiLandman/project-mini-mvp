// ייבוא הכלים הנדרשים מ-React ו-axios לקריאות API
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface IUser {
  _id: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

interface IAuthContext {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      const payload = JSON.parse(atob(savedToken.split('.')[1]));
      axios
        .get(`http://localhost:5000/api/users/${payload.id}`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (user: IUser, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
