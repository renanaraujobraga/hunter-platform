export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

export type Recommendation = "COMPRAR AGORA" | "AGUARDAR" | "ACOMPANHAR";
export type HunterStatus = "ACTIVE" | "PAUSED" | string;

export interface Hunter {
  id: string; name: string; origin: string; destination: string;
  departureFrom: string; departureTo?: string | null; returnFrom?: string | null; returnTo?: string | null;
  maxPrice: number; currentPrice?: number | null; previousPrice?: number | null;
  score?: number | null; confidence?: number | null; status: HunterStatus; createdAt?: string; updatedAt?: string;
}
export interface PriceHistory { id?: string; price?: number; currentPrice?: number; score?: number; confidence?: number; createdAt?: string; capturedAt?: string; recommendation?: Recommendation | string; }
export interface Alert { id: string; title: string; message: string; severity: string; isRead: boolean; hunterId?: string; createdAt: string; hunter?: Hunter; }
export interface AuthUser { id?: string; name?: string; email?: string; plan?: string; }
export interface AuthResponse { accessToken?: string; token?: string; user?: AuthUser; }

function token() { return typeof window === "undefined" ? null : localStorage.getItem("hunter_token"); }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const auth = token();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(auth ? { Authorization: `Bearer ${auth}` } : {}), ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    let message = `API ${response.status}`;
    try { const data = await response.json(); message = data.message ?? message; } catch {}
    throw new Error(Array.isArray(message) ? message.join(", ") : String(message));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => request<AuthUser>("/auth/me"),
  hunters: () => request<Hunter[]>("/hunters"),
  hunter: (id: string) => request<Hunter>(`/hunters/${id}`),
  history: (id: string) => request<PriceHistory[]>(`/hunters/${id}/history`),
  createHunter: (data: Partial<Hunter>) => request<Hunter>("/hunters", { method: "POST", body: JSON.stringify(data) }),
  updateHunter: (id: string, data: Partial<Hunter>) => request<Hunter>(`/hunters/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  setStatus: (id: string, status: "ACTIVE" | "PAUSED") => request<Hunter>(`/hunters/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  runHunter: (id: string) => request<unknown>(`/hunters/${id}/run`, { method: "POST" }),
  deleteHunter: (id: string) => request<void>(`/hunters/${id}`, { method: "DELETE" }),
  alerts: () => request<Alert[]>("/alerts"),
  readAlert: (id: string) => request<Alert>(`/alerts/${id}/read`, { method: "PATCH" }),
  readAllAlerts: () => request<unknown>("/alerts/read-all", { method: "PATCH" }),
  runAll: () => request<unknown>("/monitoring/run-all", { method: "POST" }),
};

export function saveAuth(result: AuthResponse) {
  const accessToken = result.accessToken ?? result.token;
  if (accessToken) localStorage.setItem("hunter_token", accessToken);
  if (result.user) localStorage.setItem("hunter_user", JSON.stringify(result.user));
}
export function logout() { localStorage.removeItem("hunter_token"); localStorage.removeItem("hunter_user"); }
