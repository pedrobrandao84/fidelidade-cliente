import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <Stack spacing={2} alignItems="flex-start" sx={{ bgcolor: '#fff', border: '1px solid #eceff3', borderRadius: 2, p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <ReportProblemOutlinedIcon color="error" />
      <Typography variant="h6">Ops, ocorreu um erro</Typography>
    </Stack>
    <Alert severity="error">{message ?? 'Não foi possível carregar os dados.'}</Alert>
    {onRetry ? (
      <Button variant="contained" onClick={onRetry}>
        Tentar novamente
      </Button>
    ) : null}
  </Stack>
);
