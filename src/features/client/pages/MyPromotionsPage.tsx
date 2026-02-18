import { Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { participationsApi } from '../../../services/api/participations';
import { useQuery } from '@tanstack/react-query';

export const MyPromotionsPage = () => {
  const [tab, setTab] = useState(0);
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['participations', user?.id], queryFn: () => participationsApi.list({ clientId: user?.id }) });

  if (query.isLoading) return <PageSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;

  const rows = (query.data ?? []).filter((p) => (tab === 0 ? p.status !== 'EXPIRED_BLOCKED' : p.status === 'EXPIRED_BLOCKED'));
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>Minhas promoções</Typography>
      <Tabs value={tab} onChange={(_, next) => setTab(next)}>
        <Tab label="Ativas" />
        <Tab label="Expiradas" />
      </Tabs>
      {!rows.length ? (
        <EmptyState title="Sem promoções nesta aba" description="Participe de campanhas para acompanhar seu progresso." />
      ) : (
        rows.map((row) => (
          <Card key={row.id} component={Link} to={`/app/promotion/${row.promotionId}`} sx={{ textDecoration: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>{row.promotion?.name}</Typography>
                <StatusBadge value={row.status} />
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};
