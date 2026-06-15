"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken, getUsername, logout as apiLogout } from "@/lib/api";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    setUsername(getToken() ? getUsername() : null);
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

  return { username, isAuthenticated: !!username, ready, logout };
}
