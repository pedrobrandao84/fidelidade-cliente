import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { participationsApi } from '../../../services/api/participations';
import { useQuery } from '@tanstack/react-query';

export const PromotionDetailsPage = () => {
  const { promotionId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['participations', user?.id], queryFn: () => participationsApi.list({ clientId: user?.id }) });

  if (query.isLoading) return <PageSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;

  const row = query.data?.find((p) => p.promotionId === promotionId);
  if (!row) return <Typography>Promoção não encontrada</Typography>;
  const blocked = row.status === 'EXPIRED_BLOCKED';
  const percent = ((row.progress / (row.promotion?.goal.target ?? 1)) * 100).toFixed(1);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={700}>{row.promotion?.name}</Typography>
        <StatusBadge value={row.status} />
      </Stack>
      <Typography color="text.secondary">{row.promotion?.description}</Typography>
      <Typography>Meta: {row.promotion?.goal.target} {row.promotion?.goal.type}</Typography>
      <Typography>Bônus: {row.promotion?.bonus.value}</Typography>
      <LinearProgress variant="determinate" value={Math.min(Number(percent), 100)} sx={{ height: 10, borderRadius: 6 }} />
      <Typography>Progresso: {row.progress}/{row.promotion?.goal.target} ({percent}%)</Typography>
      <Button disabled={blocked} variant="contained" component={Link} to={`/app/promotion/${promotionId}/tenant/${row.tenantId}/request`}>
        Solicitar pontuação
      </Button>
      {blocked ? <Typography color="error">Promoção expirada: novas solicitações foram bloqueadas.</Typography> : null}
    </Stack>
  );
};
