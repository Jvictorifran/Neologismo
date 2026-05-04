"use client";

import { useState } from "react";
import { Search, Heart, MessageCircle } from "lucide-react";

export default function Header() {
  const [activeNav, setActiveNav] = useState("Explorar");
  const navLinks = ["Explorar", "Enviar Neologismo", "Admin"];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-purple-900 tracking-tight">
              Neo scópio
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(link);
                }}
                className={`relative text-sm font-medium transition-colors ${
                  activeNav === link
                    ? "text-purple-900"
                    : "text-gray-500 hover:text-purple-900"
                }`}
              >
                {link}
                {activeNav === link && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-900 rounded-full" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              Entrar
            </button>
            <button className="hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors">
              Cadastrar
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2 text-xs">
            <span className="text-gray-500 font-medium">Telas:</span>
            {["Home", "Detalhe", "Enviar Neologismo", "Login", "Cadastro", "Painel Admin"].map(
              (screen) => (
                <button
                  key={screen}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                    screen === "Home"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {screen}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
