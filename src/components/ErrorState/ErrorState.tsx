import { Alert, Button, Stack } from '@mui/material';

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <Stack spacing={2}>
    <Alert severity="error">{message ?? 'Não foi possível carregar os dados.'}</Alert>
    {onRetry ? <Button onClick={onRetry}>Tentar novamente</Button> : null}
  </Stack>
);
