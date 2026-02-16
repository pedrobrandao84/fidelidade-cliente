import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useCreatePointRequest } from '../../../services/hooks/usePointRequests';
import { usePromotionsList } from '../../../services/hooks/usePromotions';

export const CustomersPage = () => {
  const [clientId, setClientId] = useState('c1');
  const [promotionId, setPromotionId] = useState('');
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? '';
  const promotions = usePromotionsList(tenantId);
  const create = useCreatePointRequest();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Clientes</Typography>
      <TextField label="Cliente ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
      <TextField select label="Promoção" value={promotionId} onChange={(e) => setPromotionId(e.target.value)}>
        {promotions.data?.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
      </TextField>
      <Button onClick={() => void create.mutate({ tenantId, promotionId, clientId, origin: 'COUNTER', note: 'Pontuação balcão' })}>Pontuar balcão</Button>
    </Stack>
  );
};
