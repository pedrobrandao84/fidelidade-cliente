import { Stack, Typography } from '@mui/material';
import { DataTable } from '../../../components/DataTable/DataTable';
import { useAdminMetrics } from '../../../services/hooks/useAdmin';

export const FinancePage = () => {
  const metrics = useAdminMetrics();
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Financeiro</Typography>
      <DataTable rows={metrics.data ?? []} columns={[
        { key: 'tenantId', title: 'Tenant', render: (row) => row.tenantId },
        { key: 'paymentMethod', title: 'Pagamento', render: (row) => row.paymentMethod },
        { key: 'billingStatus', title: 'Status', render: (row) => row.billingStatus },
      ]} />
    </Stack>
  );
};
