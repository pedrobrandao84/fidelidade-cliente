import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { useToast } from '../../../app/providers';
import { useAuthStore } from '../../auth/store/authStore';
import { useCreateJoinRequest } from '../../../services/hooks/useJoinRequests';
import { usePromotionsList } from '../../../services/hooks/usePromotions';

export const TenantDetailsPage = () => {
  const { tenantId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const promotions = usePromotionsList(tenantId);
  const join = useCreateJoinRequest();
  const { showToast } = useToast();

  if (promotions.isLoading) return <PageSkeleton />;
  if (promotions.isError) return <ErrorState onRetry={() => void promotions.refetch()} />;

  const rows = promotions.data ?? [];
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" fontWeight={700}>
        Promoções da empresa
      </Typography>
      {!rows.length ? (
        <EmptyState title="Sem promoções no momento" description="Quando houver campanhas, elas aparecerão aqui." />
      ) : (
        rows.map((promotion) => {
          const blocked = promotion.status !== 'ACTIVE';
          return (
            <Card key={promotion.id}>
              <CardContent>
                <Stack spacing={1.2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{promotion.name}</Typography>
                    <StatusBadge value={promotion.status} />
                  </Stack>
                  <Typography color="text.secondary">{promotion.description}</Typography>
                  <Typography fontSize={14}>Meta: {promotion.goal.target} {promotion.goal.type}</Typography>
                  <Typography fontSize={14}>Bônus: {promotion.bonus.value}</Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  disabled={blocked || join.isPending}
                  onClick={async () => {
                    await join.mutateAsync({ tenantId, promotionId: promotion.id, clientId: user?.id ?? '' });
                    showToast('Solicitação enviada com sucesso');
                  }}
                >
                  Solicitar acesso
                </Button>
              </CardActions>
            </Card>
          );
        })
      )}
    </Stack>
  );
};
