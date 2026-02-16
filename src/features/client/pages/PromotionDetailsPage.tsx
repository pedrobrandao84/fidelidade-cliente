import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { participationsApi } from '../../../services/api/participations';
import { useQuery } from '@tanstack/react-query';

export const PromotionDetailsPage = () => {
  const { promotionId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['participations', user?.id], queryFn: () => participationsApi.list({ clientId: user?.id }) });
  const row = query.data?.find((p) => p.promotionId === promotionId);
  if (!row) return <Typography>Promoção não encontrada</Typography>;
  const blocked = row.status === 'EXPIRED_BLOCKED';
  return (
    <Stack spacing={2}>
      <Typography variant="h4">{row.promotion?.name}</Typography>
      <Typography>{row.promotion?.description}</Typography>
      <LinearProgress variant="determinate" value={(row.progress / (row.promotion?.goal.target ?? 1)) * 100} />
      <Typography>Progresso: {row.progress}/{row.promotion?.goal.target}</Typography>
      <Button disabled={blocked} component={Link} to={`/app/promotion/${promotionId}/tenant/${row.tenantId}/request`}>Solicitar pontuação</Button>
      {blocked ? <Typography color="error">EXPIRADA</Typography> : null}
    </Stack>
  );
};
