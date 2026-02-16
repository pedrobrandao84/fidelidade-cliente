import { Stack, Typography } from '@mui/material';
import { DataTable } from '../../../components/DataTable/DataTable';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { useAdminMetrics } from '../../../services/hooks/useAdmin';
import { useTenants } from '../../../services/hooks/useTenants';

export const TenantsPage = () => {
  const tenants = useTenants();
  const metrics = useAdminMetrics();
  const rows = (tenants.data ?? []).map((t) => ({ ...t, metrics: metrics.data?.find((m) => m.tenantId === t.id) }));
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Empresas</Typography>
      <DataTable rows={rows} columns={[
        { key: 'name', title: 'Nome', render: (row) => row.name },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'promotionsCount', title: 'Promoções (contagem)', render: (row) => row.metrics?.promotionsCount ?? 0 },
        { key: 'clientsCount', title: 'Clientes (contagem)', render: (row) => row.metrics?.clientsCount ?? 0 },
      ]} />
    </Stack>
  );
};
