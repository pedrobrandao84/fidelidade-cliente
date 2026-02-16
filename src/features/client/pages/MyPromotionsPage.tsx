import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { participationsApi } from '../../../services/api/participations';
import { useQuery } from '@tanstack/react-query';

export const MyPromotionsPage = () => {
  const [tab, setTab] = useState(0);
  const user = useAuthStore((s) => s.user);
  const query = useQuery({ queryKey: ['participations', user?.id], queryFn: () => participationsApi.list({ clientId: user?.id }) });
  const rows = (query.data ?? []).filter((p) => (tab === 0 ? p.status !== 'EXPIRED_BLOCKED' : p.status === 'EXPIRED_BLOCKED'));
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Minhas promoções</Typography>
      <Tabs value={tab} onChange={(_, next) => setTab(next)}><Tab label="Ativas" /><Tab label="Expiradas" /></Tabs>
      {rows.map((row) => <Typography key={row.id} component={Link} to={`/app/promotion/${row.promotionId}`}>{row.promotion?.name} - {row.status}</Typography>)}
    </Stack>
  );
};
