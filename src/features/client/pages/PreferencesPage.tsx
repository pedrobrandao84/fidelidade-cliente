import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { usePreferences, useUpdatePreferences } from '../../../services/hooks/useNotifications';

export const PreferencesPage = () => {
  const user = useAuthStore((s) => s.user);
  const prefsQuery = usePreferences(user?.id ?? '');
  const update = useUpdatePreferences();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Preferências de notificação</Typography>
      {prefsQuery.data?.map((pref) => (
        <Stack key={`${pref.tenantId}-${pref.clientId}`} border={1} p={2}>
          <Typography>Empresa: {pref.tenantId}</Typography>
          {(['pushEnabled', 'emailEnabled', 'whatsappEnabled'] as const).map((key) => (
            <FormControlLabel key={key} control={<Switch checked={pref[key]} onChange={(_, checked) => void update.mutate({ ...pref, [key]: checked })} />} label={key} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};
