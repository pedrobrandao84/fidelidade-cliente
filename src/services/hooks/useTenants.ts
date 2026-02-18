import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '../api/tenants';

export const useTenants = () => useQuery({ queryKey: ['tenants'], queryFn: tenantsApi.list });
export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'PENDING_PAYMENT' | 'SUSPENDED' }) => tenantsApi.updateStatus(id, status), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['tenants'] }) });
};
