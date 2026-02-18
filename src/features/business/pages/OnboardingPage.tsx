import { Button, Stack, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { useTenants, useUpdateTenantStatus } from '../../../services/hooks/useTenants';

export const OnboardingPage = () => {
  const user = useAuthStore((s) => s.user);
  const tenants = useTenants();
  const update = useUpdateTenantStatus();
  const tenant = tenants.data?.find((t) => t.id === user?.tenantId);
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Onboarding</Typography>
      <Typography>Status atual: {tenant?.status}</Typography>
      <Button variant="contained" onClick={() => void update.mutate({ id: tenant?.id ?? '', status: 'ACTIVE' })}>Simular pagamento aprovado</Button>
    </Stack>
  );
};
