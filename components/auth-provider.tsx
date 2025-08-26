"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-states";

// ... (interface definitions remain the same)

interface UserInfo {
  full_name: string;
  email: string;
  avatar_initial: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async (currentToken: string) => {
    console.log("[AuthProvider] Fetching user info...");
    try {
      const userInfo = await api.get<UserInfo>("/auth/me", { token: currentToken });
      // Explicitly check if userInfo is valid
      if (userInfo && userInfo.full_name && userInfo.email) { // Assuming full_name and email are essential for a valid user
        console.log("[AuthProvider] User info fetched successfully:", userInfo);
        setUser(userInfo);
      } else {
        console.error("[AuthProvider] Received invalid user info:", userInfo);
        setUser(null);
        setToken(null);
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      console.error("[AuthProvider] Failed to fetch user:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("access_token");
    }
  }, []);

  useEffect(() => {
    console.log("[AuthProvider] Initializing...");
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      console.log("[AuthProvider] Token found in storage:", storedToken);
      setToken(storedToken);
      fetchUser(storedToken).finally(() => {
        console.log("[AuthProvider] Initial loading finished.");
        setLoading(false);
      });
    } else {
      console.log("[AuthProvider] No token found in storage. Finished loading.");
      setLoading(false);
    }
  }, [fetchUser]);

  const login = (accessToken: string) => {
    console.log("[AuthProvider] Login process started.");
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
    setLoading(true);
    fetchUser(accessToken).finally(() => {
      console.log("[AuthProvider] Login loading finished.");
      setLoading(false);
    });
  };

  const logout = () => {
    console.log("[AuthProvider] Logout process started.");
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
    router.push("/admin/login");
  };

  const value = {
    isAuthenticated: !!token && !!user,
    user,
    token,
    login,
    logout,
    loading,
  };

  console.log("[AuthProvider] Rendering with state:", { loading, isAuthenticated: value.isAuthenticated });

  if (loading) {
    console.log("[AuthProvider] Displaying loading spinner.");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  console.log("[AuthProvider] Rendering children.");
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
