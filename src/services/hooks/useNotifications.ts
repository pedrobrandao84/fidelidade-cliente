import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';

export const useNotifications = (params: { clientId?: string; audience?: string; tenantId?: string }) => useQuery({ queryKey: ['notifications', params], queryFn: () => notificationsApi.list(params) });
export const usePreferences = (clientId: string) => useQuery({ queryKey: ['preferences', clientId], queryFn: () => notificationsApi.preferences(clientId) });
export const useUpdatePreferences = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: notificationsApi.updatePreference, onSuccess: () => void qc.invalidateQueries({ queryKey: ['preferences'] }) });
};
export const useSendReminder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ tenantId, includeWhatsapp }: { tenantId: string; includeWhatsapp: boolean }) => notificationsApi.sendReminder(tenantId, includeWhatsapp), onSuccess: () => void qc.invalidateQueries({ queryKey: ['notifications'] }) });
};
