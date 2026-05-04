"use client";

import { useState } from "react";
import Header from "@/components/Header";
import NeologismCard from "@/components/NeologismCard";
import { mockNeologisms } from "@/data/mockNeologisms";
import { Search } from "lucide-react";

const filterCategories = [
  { id: "all", label: "Todos" },
  { id: "internet", label: "Internetês" },
  { id: "anglicism", label: "Anglicismo" },
  { id: "behavior", label: "Comportamento" },
  { id: "verbalization", label: "Verbalização" },
  { id: "slang", label: "Gíria" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNeologisms = mockNeologisms.filter((n) => {
    const matchesCategory =
      activeCategory === "all" ||
      n.tags.some((t) => {
        const categoryMap: Record<string, string> = {
          internet: "Internetês",
          anglicism: "Anglicismo",
          behavior: "Comportamento",
          verbalization: "Verbalização",
          slang: "Gíria",
        };
        return t.label === categoryMap[activeCategory];
      });

    const matchesSearch =
      searchQuery === "" ||
      n.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.definition.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />

      <section className="bg-gradient-to-br from-white to-purple-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-800 border border-purple-200 rounded-full px-4 py-1.5 mb-6">
            Dicionário Colaborativo
          </span>

          <h1 className="font-sans text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            O brasileiro deve ser estudado.
            <br />
            As palavras que ele cria também.
          </h1>

          <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
            Registre, explore e discuta os neologismos que moldam o português do nosso tempo.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors">
              Enviar uma palavra
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-purple-900 border border-purple-900 rounded-full hover:bg-purple-50 transition-colors">
              Como funciona
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar neologismos, ex: «biscoitar», «cringe»..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === cat.id
                  ? "bg-purple-100 text-purple-900"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredNeologisms.map((neologism) => (
            <NeologismCard key={neologism.id} neologism={neologism} />
          ))}
        </div>

        {filteredNeologisms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              Nenhum neologismo encontrado para os filtros selecionados.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
