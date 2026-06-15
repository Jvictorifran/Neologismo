"use client";

import { useState, useEffect, useCallback } from "react";
import type { Neologismo } from "@/types";
import { fetchNeologismos, darLike, darDeslike } from "@/lib/api";

export function useNeologismos() {
  const [data, setData] = useState<Neologismo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const neologismos = await fetchNeologismos();
      setData(neologismos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLike = useCallback(async (id: number) => {
    try {
      const result = await darLike(id);
      setData((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, total_likes: result.likes ?? n.total_likes, total_deslikes: result.deslikes ?? n.total_deslikes }
            : n
        )
      );
    } catch {
      // silently fail — optimistic update could be added
    }
  }, []);

  const handleDeslike = useCallback(async (id: number) => {
    try {
      const result = await darDeslike(id);
      setData((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, total_likes: result.likes ?? n.total_likes, total_deslikes: result.deslikes ?? n.total_deslikes }
            : n
        )
      );
    } catch {
      // silently fail
    }
  }, []);

  return { data, loading, error, refetch: load, onLike: handleLike, onDeslike: handleDeslike };
}
