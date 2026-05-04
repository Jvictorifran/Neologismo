import type { Neologism } from "@/types";

export const mockNeologisms: Neologism[] = [
  {
    id: "1",
    word: "Biscoitar",
    phonetic: "/bis.coi.tar/",
    grammaticalClass: "VERBO INTRANSITIVO",
    definition:
      "Buscar elogios ou validação pública nas redes sociais de forma evidente, geralmente através de fotos ou comentários provocativos.",
    context: {
      quote: "Ela passou a tarde biscoitando no Instagram e nem percebeu.",
      speaker: "Marina Santos",
      source: "REDES SOCIAIS",
    },
    tags: [{ id: "t1", label: "Internetês" }, { id: "t2", label: "Comportamento" }],
    createdAt: "2024-05-15",
    likes: 342,
    comments: 28,
  },
  {
    id: "2",
    word: "Cringe",
    phonetic: "/crín.gi/",
    grammaticalClass: "ADJETIVO UNIFORME",
    definition:
      "Que provoca vergonha alheia; constrangedor, cafona. Adaptado do inglês, tornou-se popular entre jovens brasileiros nas redes sociais.",
    context: {
      quote: "Foi muito cringe quando ele tentou usar gíria adolescente e errou todas.",
      speaker: "Prof. Ana Beatriz Costa",
      source: "PESQUISA LEXICAL",
    },
    tags: [{ id: "t3", label: "Anglicismo" }, { id: "t1", label: "Internetês" }],
    createdAt: "2024-03-22",
    likes: 891,
    comments: 67,
  },
  {
    id: "3",
    word: "Goat",
    phonetic: "/gót/",
    grammaticalClass: "SUBSTANTIVO UNIFORME",
    definition:
      "Greatest of All Time — o melhor de todos os tempos. Usado para se referir a alguém considerado imbatível em sua área de atuação.",
    context: {
      quote: "Messi é goat, não tem discussão.",
      speaker: "Lucas Ferreira",
      source: "FÓRUM ESPORTIVO",
    },
    tags: [{ id: "t3", label: "Anglicismo" }, { id: "t2", label: "Comportamento" }],
    createdAt: "2024-07-10",
    likes: 1205,
    comments: 143,
  },
  {
    id: "4",
    word: "Printar",
    phonetic: "/prin.tar/",
    grammaticalClass: "VERBO TRANSITIVO DIRETO",
    definition:
      "Capturar uma imagem da tela do dispositivo (screenshot); adaptar o verbo em inglês 'to print' para o contexto digital brasileiro.",
    context: {
      quote: "Printa essa conversa antes que ele apague, por favor.",
      speaker: "João Victor",
      source: "GRUPO DE WHATSAPP",
    },
    tags: [{ id: "t3", label: "Anglicismo" }, { id: "t4", label: "Verbalização" }],
    createdAt: "2024-02-18",
    likes: 567,
    comments: 41,
  },
  {
    id: "5",
    word: "Tankar",
    phonetic: "/tan.car/",
    grammaticalClass: "VERBO TRANSITIVO DIRETO",
    definition:
      "Suportar, aguentar ou resistir a uma situação difícil ou desagradável. Originado do gaming, popularizou-se no cotidiano.",
    context: {
      quote: "Não sei como você tanka aquele chefe todo dia.",
      speaker: "Camila Ribeiro",
      source: "REDES SOCIAIS",
    },
    tags: [{ id: "t3", label: "Anglicismo" }, { id: "t1", label: "Internetês" }],
    createdAt: "2024-06-05",
    likes: 723,
    comments: 55,
  },
  {
    id: "6",
    word: "Lacração",
    phonetic: "/la.cra.ção/",
    grammaticalClass: "SUBSTANTIVO FEMININO",
    definition:
      "Ato de se expressar de forma contundente e assertiva, especialmente em debates sobre identidade e direitos sociais.",
    context: {
      quote: "A fala dela foi uma lacração — ninguém conseguiu rebater nada.",
      speaker: "Dra. Camila Ribeiro",
      source: "ARTIGO ACADÊMICO",
    },
    tags: [{ id: "t2", label: "Comportamento" }, { id: "t1", label: "Internetês" }],
    createdAt: "2024-04-30",
    likes: 456,
    comments: 89,
  },
];
