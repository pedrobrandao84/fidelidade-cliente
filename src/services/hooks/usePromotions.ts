import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promotionsApi } from '../api/promotions';

export const usePromotionsList = (tenantId?: string) => useQuery({ queryKey: ['promotions', tenantId], queryFn: () => promotionsApi.list(tenantId) });
export const useCreatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: promotionsApi.create, onSuccess: () => void qc.invalidateQueries({ queryKey: ['promotions'] }) });
};
export const useExtendPromotion = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, expiresAt }: { id: string; expiresAt: string }) => promotionsApi.extend(id, expiresAt), onSuccess: () => void qc.invalidateQueries({ queryKey: ['promotions'] }) });
};
export const useDuplicatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: promotionsApi.duplicate, onSuccess: () => void qc.invalidateQueries({ queryKey: ['promotions'] }) });
};
