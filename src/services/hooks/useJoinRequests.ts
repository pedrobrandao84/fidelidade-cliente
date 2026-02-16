import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { joinRequestsApi } from '../api/joinRequests';

export const useJoinRequests = (params: { tenantId?: string; clientId?: string }) =>
  useQuery({ queryKey: ['joinRequests', params], queryFn: () => joinRequestsApi.list(params) });
export const useCreateJoinRequest = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: joinRequestsApi.create, onSuccess: () => void qc.invalidateQueries({ queryKey: ['joinRequests'] }) });
};
export const useApproveJoinRequest = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, status, reviewedBy }: { id: string; status: 'APPROVED' | 'REJECTED'; reviewedBy: string }) => joinRequestsApi.review(id, status, reviewedBy), onSuccess: () => void qc.invalidateQueries({ queryKey: ['joinRequests'] }) });
};
