import { Card, CardContent, Grid2 as Grid, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { useJoinRequests } from '../../../services/hooks/useJoinRequests';
import { usePointRequests } from '../../../services/hooks/usePointRequests';
import { participationsApi } from '../../../services/api/participations';
import { useQuery } from '@tanstack/react-query';

export const DashboardPage = () => {
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? '';
  const joins = useJoinRequests({ tenantId });
  const points = usePointRequests({ tenantId });
  const parts = useQuery({ queryKey: ['participations', tenantId], queryFn: () => participationsApi.list({ tenantId }) });
  const almost = (parts.data ?? []).filter((p) => (p.promotion?.goal.target ?? 0) - p.progress <= 2 && p.status === 'ACTIVE').length;
  return (
    <Grid container spacing={2}>
      {[['Pendências de acesso', joins.data?.filter((x) => x.status === 'PENDING').length ?? 0], ['Pendências de pontuação', points.data?.filter((x) => x.status === 'PENDING').length ?? 0], ['Quase completos', almost]].map(([title, value]) => (
        <Grid key={title} size={{ xs: 12, md: 4 }}><Card><CardContent><Typography>{title}</Typography><Typography variant="h4">{value}</Typography></CardContent></Card></Grid>
      ))}
    </Grid>
  );
};
