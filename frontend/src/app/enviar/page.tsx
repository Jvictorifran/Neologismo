"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { createNeologismo } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";

export default function EnviarPage() {
  const { isAuthenticated, ready } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [pronuncia, setPronuncia] = useState("");
  const [classe, setClasse] = useState("");
  const [definicao, setDefinicao] = useState("");
  const [contextoUso, setContextoUso] = useState("");
  const [tags, setTags] = useState("");
  const [citacao, setCitacao] = useState("");
  const [fonte, setFonte] = useState("");
  const [link, setLink] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !definicao.trim() || !classe.trim()) {
      setError("Preencha ao menos título, classe gramatical e definição.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const contextos = citacao.trim()
      ? [{ citacao: citacao.trim(), fonte: fonte.trim(), link: link.trim() }]
      : [];

    setLoading(true);
    try {
      await createNeologismo({
        titulo: titulo.trim(),
        pronuncia: pronuncia.trim(),
        classe_gramatical: classe.trim(),
        definicao: definicao.trim(),
        contexto_uso: contextoUso.trim(),
        tags: tagList,
        contextos,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-purple-900 animate-spin" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <section className="max-w-md mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Entre para enviar
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Você precisa estar logado para sugerir um neologismo.
          </p>
          <Link
            href="/login"
            className="inline-flex px-6 py-2.5 text-sm font-semibold text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors"
          >
            Entrar
          </Link>
        </section>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <section className="max-w-md mx-auto px-4 py-24 text-center">
          <CheckCircle2 className="w-12 h-12 text-purple-900 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Neologismo enviado!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Ele entrará em moderação e aparecerá na página assim que for aprovado.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-2.5 text-sm font-semibold text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors"
          >
            Voltar à Home
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-800 border border-purple-200 rounded-full px-4 py-1.5 mb-4">
          Enviar Neologismo
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Registre uma nova palavra
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Sua sugestão passará por moderação antes de ser publicada.
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} placeholder="Ex: Biscoitar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pronúncia
              </label>
              <input value={pronuncia} onChange={(e) => setPronuncia(e.target.value)} className={inputClass} placeholder="/bis.coi.tar/" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe gramatical *
            </label>
            <input value={classe} onChange={(e) => setClasse(e.target.value)} className={inputClass} placeholder="Verbo, Substantivo, Adjetivo..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Definição *
            </label>
            <textarea value={definicao} onChange={(e) => setDefinicao(e.target.value)} rows={3} className={inputClass} placeholder="O que a palavra significa?" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frase de exemplo
            </label>
            <textarea value={contextoUso} onChange={(e) => setContextoUso(e.target.value)} rows={2} className={inputClass} placeholder="Uma frase curta demonstrando o uso." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 font-normal">(separadas por vírgula)</span>
            </label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="Internetês, Anglicismo" />
          </div>

          <div className="rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">
              Citação com fonte <span className="text-gray-400 font-normal">(opcional)</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citação</label>
              <textarea value={citacao} onChange={(e) => setCitacao(e.target.value)} rows={2} className={inputClass} placeholder="Trecho real onde a palavra aparece." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
                <input value={fonte} onChange={(e) => setFonte(e.target.value)} className={inputClass} placeholder="@usuario no X" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-semibold text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Enviar neologismo
          </button>
        </form>
      </section>
    </>
  );
}
