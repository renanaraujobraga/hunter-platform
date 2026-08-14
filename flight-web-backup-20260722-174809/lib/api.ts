import type { Dashboard, CreateHunterInput, Hunter } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body?.message.join(', ') : body?.message;
    throw new Error(message || `Erro ${response.status} ao acessar a API.`);
  }

  return response.json() as Promise<T>;
}

export function getDashboard(): Promise<Dashboard> {
  return request<Dashboard>('/dashboard');
}

export function createHunter(input: CreateHunterInput): Promise<Hunter> {
  return request<Hunter>('/hunters', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}
