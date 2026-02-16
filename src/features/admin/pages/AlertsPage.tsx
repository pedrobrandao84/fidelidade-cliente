import { Alert, Stack, Typography } from '@mui/material';
import { useTenants } from '../../../services/hooks/useTenants';

export const AlertsPage = () => {
  const tenants = useTenants();
  const pending = tenants.data?.filter((t) => t.status === 'PENDING_PAYMENT') ?? [];
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Alertas</Typography>
      {pending.length ? pending.map((item) => <Alert key={item.id} severity="warning">{item.name} cadastrou e não pagou.</Alert>) : <Typography>Sem alertas.</Typography>}
    </Stack>
  );
};
