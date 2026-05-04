import type { Neologism } from "@/types";
import { Heart, MessageCircle } from "lucide-react";

interface NeologismCardProps {
  neologism: Neologism;
}

export default function NeologismCard({ neologism }: NeologismCardProps) {
  const formattedDate = new Date(neologism.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
            {neologism.grammaticalClass}
          </span>
          <time className="text-xs text-gray-400 font-medium">{formattedDate}</time>
        </div>

        <h2 className="font-sans text-2xl font-bold text-gray-900 mb-1">
          {neologism.word}
        </h2>

        <p className="text-sm text-purple-400 font-medium mb-3 tracking-wide italic">
          {neologism.phonetic}
        </p>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {neologism.definition}
        </p>

        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors group">
            <Heart className="w-4 h-4 group-hover:fill-red-400" />
            <span className="text-xs font-medium">{neologism.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-purple-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{neologism.comments}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
