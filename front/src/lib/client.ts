import { ApiError, extractMessage } from "./api-error";
import type { User } from "./types";

/** Fetch del navegador. Todo pasa por el BFF de Next (/api/...), nunca directo a la API. */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, extractMessage(body));
  return body as T;
}

const json = (data?: unknown) => (data === undefined ? undefined : JSON.stringify(data));

/** Llamadas autenticadas a la API a través de /api/proxy. */
export const api = {
  get: <T>(path: string) => request<T>(`/api/proxy${path}`),
  post: <T>(path: string, data?: unknown) => request<T>(`/api/proxy${path}`, { method: "POST", body: json(data) }),
  put: <T>(path: string, data?: unknown) => request<T>(`/api/proxy${path}`, { method: "PUT", body: json(data) }),
  patch: <T>(path: string, data?: unknown) => request<T>(`/api/proxy${path}`, { method: "PATCH", body: json(data) }),
  delete: <T>(path: string) => request<T>(`/api/proxy${path}`, { method: "DELETE" }),
};

export const authApi = {
  session: () => request<{ user: User | null }>("/api/auth/session"),
  login: (data: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", { method: "POST", body: json(data) }),
  register: (data: Record<string, string>) =>
    request<{ user: User }>("/api/auth/register", { method: "POST", body: json(data) }),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
};

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrió un error inesperado";
