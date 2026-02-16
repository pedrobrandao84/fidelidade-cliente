import { Stack, TextField, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';

export const BusinessSettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Configurações</Typography>
      <TextField label="Nome" value={user?.name ?? ''} />
      <TextField label="E-mail" value={user?.email ?? ''} />
    </Stack>
  );
};
