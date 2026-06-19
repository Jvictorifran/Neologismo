"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchNeologismos, aprovarNeologismo, rejeitarNeologismo } from "@/lib/api";
import type { Neologismo } from "@/types";
import { Loader2, Check, X, Search } from "lucide-react";

export default function AdminPainel() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, ready } = useAuth();
  const [pendentes, setPendentes] = useState<Neologismo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acaoId, setAcaoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [rejeitarId, setRejeitarId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNeologismos("pendente");
      setPendentes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/");
      } else {
        carregar();
      }
    }
  }, [ready, isAuthenticated, isAdmin, router, carregar]);

  async function handleAprovar(id: number) {
    setAcaoId(id);
    try {
      await aprovarNeologismo(id);
      setPendentes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao aprovar");
    } finally {
      setAcaoId(null);
    }
  }

  async function handleRejeitar(id: number) {
    if (!motivo.trim()) return;
    setAcaoId(id);
    try {
      await rejeitarNeologismo(id, motivo.trim());
      setPendentes((prev) => prev.filter((n) => n.id !== id));
      setRejeitarId(null);
      setMotivo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao rejeitar");
    } finally {
      setAcaoId(null);
    }
  }

  if (!ready || !isAuthenticated || !isAdmin) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-purple-dark animate-spin" />
        </div>
      </>
    );
  }

  const filtrados = pendentes.filter((n) =>
    searchQuery === "" ||
    n.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.definicao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.autor_nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-dark border border-purple-light rounded-full px-4 py-1.5 mb-3">
              Administração
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Neologismos Pendentes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pendentes.length} aguardando revisão
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por título, definição ou autor..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-semibold hover:underline">Fechar</button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-dark animate-spin" />
          </div>
        )}

        {!loading && filtrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              {searchQuery ? "Nenhum resultado para a busca." : "Nenhum neologismo pendente. Parabéns!"}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filtrados.map((n) => (
            <div key={n.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{n.titulo}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    por <span className="font-medium text-gray-500">{n.autor_nome}</span>
                    {" — "}
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-purple-dark bg-purple-light px-2 py-0.5 rounded-full">
                      {n.classe_gramatical}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">{n.definicao}</p>

              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-500 italic leading-relaxed">
                  &ldquo;{n.contexto_uso}&rdquo;
                </p>
              </div>

              {n.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {n.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {rejeitarId === n.id ? (
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Motivo da rejeição (obrigatório)..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejeitar(n.id)}
                      disabled={acaoId === n.id || !motivo.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {acaoId === n.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      Confirmar rejeição
                    </button>
                    <button
                      onClick={() => { setRejeitarId(null); setMotivo(""); }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => handleAprovar(n.id)}
                    disabled={acaoId === n.id}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {acaoId === n.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Aprovar
                  </button>
                  <button
                    onClick={() => setRejeitarId(n.id)}
                    disabled={acaoId === n.id}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Desaprovar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
