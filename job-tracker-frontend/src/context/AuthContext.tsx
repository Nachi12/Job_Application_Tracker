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

  // 🔥 FIX: Proper session restore
  useEffect(() => {
    const existingToken = storage.getToken();

    if (existingToken) {
      setToken(existingToken);
      setUser({} as User); // temporary until you build /me
    }

    setLoading(false);
  }, []);

  // 🔥 Central auth success handler
  const handleAuthSuccess = (data: AuthResponse) => {
  storage.setToken(data.token);
  localStorage.setItem('user', JSON.stringify(data.user)); // ✅ ADD
  setToken(data.token);
  setUser(data.user);
};

  // 🔥 FIXED LOGIN
  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    handleAuthSuccess(res);

    // 🔥 IMPORTANT: force React sync (fix redirect issue)
    await new Promise((resolve) => setTimeout(resolve, 50));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register({ name, email, password });
    handleAuthSuccess(res);
  };

  const logout = () => {
    storage.clearToken();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    return;
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