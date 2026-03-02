import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types/domain';
import { fetchMe, login as loginRequest, logout as logoutRequest } from '../api/endpoints';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  loggingIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    void bootstrap();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoggingIn(true);
    // #region agent log
    const log = (message: string, data: Record<string, unknown>) => {
      fetch('http://127.0.0.1:7560/ingest/82f2bf8a-9ac4-4883-ada6-a8bf4ed2a875', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '02097f' },
        body: JSON.stringify({ sessionId: '02097f', location: 'AuthContext:login', message, data, timestamp: Date.now(), hypothesisId: 'C' }),
      }).catch(() => {});
    };
    log('login_start', { hasEmail: !!email });
    // #endregion
    try {
      await loginRequest({ email, password });
      log('login_request_ok', {});
      const me = await fetchMe();
      log('fetchMe_ok', { userId: (me as { id?: unknown }).id });
      setUser(me);
    } catch (error) {
      const err = error as { status?: number; message?: string };
      log('login_error', { status: err.status, message: err.message });
      throw error;
    } finally {
      setLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    initializing,
    loggingIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
};

