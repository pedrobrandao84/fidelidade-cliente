import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';

export const useAdminMetrics = () => useQuery({ queryKey: ['adminMetrics'], queryFn: adminApi.metrics });
