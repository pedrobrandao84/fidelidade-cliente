import { Button, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { useCreateJoinRequest } from '../../../services/hooks/useJoinRequests';
import { usePromotionsList } from '../../../services/hooks/usePromotions';
import { useToast } from '../../../app/providers';

export const TenantDetailsPage = () => {
  const { tenantId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const promotions = usePromotionsList(tenantId);
  const join = useCreateJoinRequest();
  const { showToast } = useToast();

  if (promotions.isLoading) return <PageSkeleton />;
  if (promotions.isError) return <ErrorState onRetry={() => void promotions.refetch()} />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Promoções da empresa</Typography>
      {promotions.data?.map((promotion) => (
        <Stack key={promotion.id} spacing={1} border={1} p={2} borderRadius={2}>
          <Typography>{promotion.name}</Typography>
          <Typography>{promotion.description}</Typography>
          <Button onClick={async () => {
            await join.mutateAsync({ tenantId, promotionId: promotion.id, clientId: user?.id ?? '' });
            showToast('Solicitação enviada com sucesso');
          }}>Solicitar acesso</Button>
        </Stack>
      ))}
    </Stack>
  );
};
