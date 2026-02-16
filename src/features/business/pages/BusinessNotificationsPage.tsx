import { Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useSendReminder } from '../../../services/hooks/useNotifications';

export const BusinessNotificationsPage = () => {
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? '';
  const [whatsapp, setWhatsapp] = useState(false);
  const reminder = useSendReminder();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Notificações empresa</Typography>
      <FormControlLabel control={<Switch checked={whatsapp} onChange={(_, checked) => setWhatsapp(checked)} />} label="Incluir WhatsApp (custo extra)" />
      <Button onClick={() => void reminder.mutate({ tenantId, includeWhatsapp: whatsapp })}>Enviar lembrete</Button>
      {reminder.data?.whatsappCostMessage ? <Typography color="warning.main">{reminder.data.whatsappCostMessage}</Typography> : null}
    </Stack>
  );
};
