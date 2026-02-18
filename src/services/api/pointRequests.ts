import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { PointRequest, RequestStatus } from '../types';

export const pointRequestsApi = {
  list: (params: { tenantId?: string; clientId?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return httpClient.get<PointRequest[]>(`${endpoints.pointRequests}?${query}`);
  },
  create: (payload: Omit<PointRequest, 'id' | 'createdAt' | 'status'>) => httpClient.post<PointRequest>(endpoints.pointRequests, payload),
  review: (id: string, status: RequestStatus, reviewedBy: string) => httpClient.put<PointRequest>(`${endpoints.pointRequests}/${id}`, { status, reviewedBy }),
};
