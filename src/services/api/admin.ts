import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { AdminTenantMetrics } from '../types';

export const adminApi = {
  metrics: () => httpClient.get<AdminTenantMetrics[]>(endpoints.adminMetrics),
};
