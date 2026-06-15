import type {
  Neologismo,
  NeologismoCreate,
  LikeResponse,
  LoginPayload,
  LoginResponse,
  RegistroPayload,
  RegistroResponse,
  NeologismoStatus,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function parseError(res: Response, fallback: string): Promise<never> {
  let detail = fallback;
  try {
    const body = await res.json();
    // DRF devolve {campo: ["msg"]} ou {detail: "msg"}
    const first = Object.values(body)[0];
    detail = Array.isArray(first) ? String(first[0]) : String(body.detail ?? fallback);
  } catch {
    // mantém fallback
  }
  throw new Error(detail);
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Token ${token}`;
    }
  }

  return headers;
}

export async function fetchNeologismos(
  status?: NeologismoStatus
): Promise<Neologismo[]> {
  const query = status ? `?status=${status}` : "";
  const res = await fetch(`${API_URL}/neologismos/${query}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) await parseError(res, "Falha ao carregar neologismos");

  return res.json();
}

export async function fetchNeologismoById(id: number): Promise<Neologismo> {
  const res = await fetch(`${API_URL}/neologismos/${id}/`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Failed to fetch neologismo ${id}`);

  return res.json();
}

export async function createNeologismo(
  data: NeologismoCreate
): Promise<Neologismo> {
  const res = await fetch(`${API_URL}/neologismos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) await parseError(res, "Falha ao enviar neologismo");

  return res.json();
}

export async function darLike(id: number): Promise<LikeResponse> {
  const res = await fetch(`${API_URL}/neologismos/${id}/dar_like/`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to toggle like");

  return res.json();
}

export async function darDeslike(id: number): Promise<LikeResponse> {
  const res = await fetch(`${API_URL}/neologismos/${id}/dar_deslike/`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to toggle deslike");

  return res.json();
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) await parseError(res, "Usuário ou senha inválidos");

  const data = await res.json();
  saveSession(data.token, payload.username);
  return data;
}

export async function register(
  payload: RegistroPayload
): Promise<RegistroResponse> {
  const res = await fetch(`${API_URL}/cadastro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) await parseError(res, "Falha ao cadastrar");

  const data = await res.json();
  saveSession(data.token, data.username);
  return data;
}

export async function aprovarNeologismo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/neologismos/${id}/aprovar/`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) await parseError(res, "Falha ao aprovar");
}

export async function rejeitarNeologismo(
  id: number,
  motivo: string
): Promise<void> {
  const res = await fetch(`${API_URL}/neologismos/${id}/rejeitar/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ motivo_rejeicao: motivo }),
  });
  if (!res.ok) await parseError(res, "Falha ao rejeitar");
}

export async function reativarNeologismo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/neologismos/${id}/reativar/`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) await parseError(res, "Falha ao reativar");
}

function saveSession(token: string, username?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
  if (username) localStorage.setItem("auth_username", username);
  window.dispatchEvent(new Event("auth-change"));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_username");
  window.dispatchEvent(new Event("auth-change"));
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function getUsername(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_username");
  }
  return null;
}
