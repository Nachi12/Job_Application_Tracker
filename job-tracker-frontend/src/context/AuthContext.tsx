import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { User } from '../types/models';
import { authService, AuthResponse } from '../services/authService';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [loading, setLoading] = useState<boolean>(true);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Proper session restore
  useEffect(() => {
    const initAuth = async () => {
      const existingToken = storage.getToken();
      const storedUserStr = localStorage.getItem('user');

      if (existingToken) {
        setToken(existingToken);
        if (storedUserStr) {
          try {
            setUser(JSON.parse(storedUserStr));
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
        try {
          const me = await authService.me();
          setUser(me);
          localStorage.setItem('user', JSON.stringify(me));
        } catch (err: any) {
          console.error('Session restoration failed:', err);
          // Only wipe session if token is truly invalid or expired (401 / 403)
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            storage.clearToken();
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Central auth success handler
  const handleAuthSuccess = (data: AuthResponse) => {
    storage.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await authService.login({
      email: email.trim().toLowerCase(),
      password
    });
    handleAuthSuccess(res);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });
    handleAuthSuccess(res);
  };

  const logout = () => {
    storage.clearToken();
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const me = await authService.me();
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
  value={{
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    refreshUser,
    updateUser // ✅ ADD THIS
  }}
>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}