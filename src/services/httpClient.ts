export const httpClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json() as Promise<T>;
  },
  async post<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json() as Promise<T>;
  },
  async put<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json() as Promise<T>;
  },
};
