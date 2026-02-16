import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { JoinRequest, RequestStatus } from '../types';

export const joinRequestsApi = {
  list: (params: { tenantId?: string; clientId?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return httpClient.get<JoinRequest[]>(`${endpoints.joinRequests}?${query}`);
  },
  create: (payload: Omit<JoinRequest, 'id' | 'createdAt' | 'status'>) => httpClient.post<JoinRequest>(endpoints.joinRequests, payload),
  review: (id: string, status: RequestStatus, reviewedBy: string) => httpClient.put<JoinRequest>(`${endpoints.joinRequests}/${id}`, { status, reviewedBy }),
};
