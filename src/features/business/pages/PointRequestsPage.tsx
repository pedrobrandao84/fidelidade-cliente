import { Button, Link, Stack, Typography } from '@mui/material';
import { useAuthStore } from '../../auth/store/authStore';
import { useApprovePointRequest, usePointRequests } from '../../../services/hooks/usePointRequests';

export const PointRequestsPage = () => {
  const user = useAuthStore((s) => s.user);
  const query = usePointRequests({ tenantId: user?.tenantId });
  const review = useApprovePointRequest();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Solicitações de pontuação</Typography>
      {query.data?.map((item) => (
        <Stack key={item.id} direction="row" spacing={1}><Typography>{item.clientId} - {item.status} - {item.origin}</Typography>
          {item.receiptUrl ? <Link href={item.receiptUrl}>Comprovante</Link> : null}
          <Button onClick={() => void review.mutate({ id: item.id, status: 'APPROVED', reviewedBy: user?.id ?? '' })}>Aprovar</Button>
          <Button onClick={() => void review.mutate({ id: item.id, status: 'REJECTED', reviewedBy: user?.id ?? '' })}>Rejeitar</Button>
        </Stack>
      ))}
    </Stack>
  );
};
