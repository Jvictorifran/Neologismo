"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken, getUsername, getIsAdmin, logout as apiLogout } from "@/lib/api";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    const token = getToken();
    setUsername(token ? getUsername() : null);
    setIsAdmin(token ? getIsAdmin() : false);
    setReady(true);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const logout = useCallback(() => {
    apiLogout();
  }, []);

  return { username, isAuthenticated: !!username, isAdmin, ready, logout };
}
