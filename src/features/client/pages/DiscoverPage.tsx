import { Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { useTenants } from '../../../services/hooks/useTenants';
import { CLIENT_LOCATION } from '../../../utils/constants';
import { distance } from '../../../utils/geo';

export const DiscoverPage = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const query = useTenants();
  const rows = useMemo(() =>
    (query.data ?? [])
      .filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
      .filter((t) => (!category ? true : t.category === category))
      .sort((a, b) => distance(a.location, CLIENT_LOCATION) - distance(b.location, CLIENT_LOCATION)),
  [query.data, filter, category]);
  if (query.isLoading) return <PageSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Descobrir empresas</Typography>
      <TextField label="Buscar por nome" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <TextField label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
      {!rows.length ? <Typography>Nenhuma empresa encontrada.</Typography> : rows.map((tenant) => (
        <Card key={tenant.id} component={Link} to={`/app/tenant/${tenant.id}`} sx={{ textDecoration: 'none' }}>
          <CardContent>
            <Typography>{tenant.name}</Typography>
            <Chip size="small" label={tenant.category} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
