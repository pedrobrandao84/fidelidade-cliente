import { Stack, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { useNotifications } from '../../../services/hooks/useNotifications';
import { formatDate } from '../../../utils/date';

export const NotificationsPage = () => {
  const user = useAuthStore((s) => s.user);
  const query = useNotifications({ clientId: user?.id, audience: 'CLIENT' });
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Notificações</Typography>
      {query.data?.map((n) => <Typography key={n.id}>{n.title} - {n.message} ({formatDate(n.createdAt)})</Typography>)}
    </Stack>
  );
};
