export interface Contexto {
  id: number;
  citacao: string;
  fonte: string;
  link: string;
}

export interface ContextoCreate {
  citacao: string;
  fonte?: string;
  link?: string;
}

export interface Neologismo {
  id: number;
  titulo: string;
  pronuncia: string;
  classe_gramatical: string;
  definicao: string;
  contexto_uso: string;
  contextos: Contexto[];
  tags: string[];
  status: "pendente" | "aprovado" | "rejeitado";
  data_criacao: string;
  autor: number;
  autor_nome: string;
  likes: number[];
  deslikes: number[];
  total_likes: number;
  total_deslikes: number;
}

export interface NeologismoCreate {
  titulo: string;
  pronuncia: string;
  classe_gramatical: string;
  definicao: string;
  contexto_uso: string;
  contextos?: ContextoCreate[];
  tags: string[];
}

export interface LikeResponse {
  status: string;
  likes?: number;
  deslikes?: number;
}

export type NeologismoStatus = "pendente" | "aprovado" | "rejeitado";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegistroPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegistroResponse {
  token: string;
  user_id: number;
  username: string;
}
