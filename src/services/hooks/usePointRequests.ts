import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pointRequestsApi } from '../api/pointRequests';

export const usePointRequests = (params: { tenantId?: string; clientId?: string }) => useQuery({ queryKey: ['pointRequests', params], queryFn: () => pointRequestsApi.list(params) });
export const useCreatePointRequest = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: pointRequestsApi.create, onSuccess: () => void qc.invalidateQueries({ queryKey: ['pointRequests'] }) });
};
export const useApprovePointRequest = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, status, reviewedBy }: { id: string; status: 'APPROVED' | 'REJECTED'; reviewedBy: string }) => pointRequestsApi.review(id, status, reviewedBy), onSuccess: () => void qc.invalidateQueries({ queryKey: ['pointRequests'] }) });
};
