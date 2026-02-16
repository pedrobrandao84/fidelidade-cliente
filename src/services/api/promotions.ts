import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { Promotion } from '../types';

export const promotionsApi = {
  list: (tenantId?: string) => httpClient.get<Promotion[]>(`${endpoints.promotions}${tenantId ? `?tenantId=${tenantId}` : ''}`),
  create: (payload: Omit<Promotion, 'id' | 'createdAt' | 'status'>) => httpClient.post<Promotion>(endpoints.promotions, payload),
  update: (id: string, payload: Partial<Promotion>) => httpClient.put<Promotion>(`${endpoints.promotions}/${id}`, payload),
  extend: (id: string, expiresAt: string) => httpClient.post<{ ok: boolean }>(`${endpoints.promotions}/${id}/extend`, { expiresAt }),
  duplicate: (id: string) => httpClient.post<Promotion>(`${endpoints.promotions}/${id}/duplicate`, {}),
};
