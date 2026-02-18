import { Card, CardContent, Chip, Grid2 as Grid, Stack, TextField, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState/ErrorState';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { useTenants } from '../../../services/hooks/useTenants';
import { CLIENT_LOCATION } from '../../../utils/constants';
import { distance } from '../../../utils/geo';

export const DiscoverPage = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const query = useTenants();
  const rows = useMemo(
    () =>
      (query.data ?? [])
        .filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
        .filter((t) => (!category ? true : t.category.toLowerCase().includes(category.toLowerCase())))
        .sort((a, b) => distance(a.location, CLIENT_LOCATION) - distance(b.location, CLIENT_LOCATION)),
    [query.data, filter, category],
  );
  if (query.isLoading) return <PageSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" fontWeight={700}>
        Empresas próximas
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <TextField fullWidth label="Buscar por nome" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField fullWidth label="Filtrar por categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
        </Grid>
      </Grid>
      {!rows.length ? (
        <EmptyState title="Nenhuma empresa encontrada" description="Ajuste os filtros para explorar mais opções." />
      ) : (
        <Grid container spacing={2}>
          {rows.map((tenant) => (
            <Grid size={{ xs: 12, md: 6 }} key={tenant.id}>
              <Card component={Link} to={`/app/tenant/${tenant.id}`} sx={{ textDecoration: 'none', height: '100%' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{tenant.name}</Typography>
                      <StatusBadge value={tenant.status} />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label={tenant.category} />
                      <Typography color="text.secondary" fontSize={14}>
                        <PlaceOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Distância aprox: {distance(tenant.location, CLIENT_LOCATION).toFixed(2)} km
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};
