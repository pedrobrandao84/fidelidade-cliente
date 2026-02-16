import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { Tenant } from '../types';

export const tenantsApi = {
  list: () => httpClient.get<Tenant[]>(endpoints.tenants),
  updateStatus: (id: string, status: Tenant['status']) => httpClient.put<Tenant>(`${endpoints.tenants}/${id}/status`, { status }),
};
