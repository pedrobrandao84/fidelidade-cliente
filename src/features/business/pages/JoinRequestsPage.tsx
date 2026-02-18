import { Button, Stack, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { useApproveJoinRequest, useJoinRequests } from '../../../services/hooks/useJoinRequests';

export const JoinRequestsPage = () => {
  const user = useAuthStore((s) => s.user);
  const query = useJoinRequests({ tenantId: user?.tenantId });
  const review = useApproveJoinRequest();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Solicitações de acesso</Typography>
      {query.data?.map((item) => (
        <Stack key={item.id} direction="row" spacing={1}><Typography>{item.clientId} - {item.status}</Typography>
          <Button onClick={() => void review.mutate({ id: item.id, status: 'APPROVED', reviewedBy: user?.id ?? '' })}>Aprovar</Button>
          <Button onClick={() => void review.mutate({ id: item.id, status: 'REJECTED', reviewedBy: user?.id ?? '' })}>Rejeitar</Button>
        </Stack>
      ))}
    </Stack>
  );
};
