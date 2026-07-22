import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { setAuthTokenGetter, useGetMe, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Synchronous init ──────────────────────────────────────────────────────
// Register the token getter BEFORE any component renders so the very first
// useGetMe() call always carries the correct Authorization header.
// This removes the useEffect waterfall: mount → effect → re-render cycle.
setAuthTokenGetter(() => localStorage.getItem("tayyibat_token"));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("tayyibat_token")
  );

  const { data: user, isLoading: isUserLoading, error } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
      // Auth validation is critical — keep it fresh for 10 min, not 5.
      staleTime: 1000 * 60 * 10,
    } as any,
  });

  const [, setLocation] = useLocation();

  // Logout on token invalidity (expired / revoked)
  if (error && token) {
    localStorage.removeItem("tayyibat_token");
    // Don't call setToken here — render-phase state updates are deferred by React
  }

  const login = (newToken: string) => {
    localStorage.setItem("tayyibat_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("tayyibat_token");
    setToken(null);
    setLocation("/login");
  };

  // Only show loading when we HAVE a token and are waiting for the user object.
  // No token = not authenticated, no loading needed.
  const isLoading = !!token && isUserLoading;

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
