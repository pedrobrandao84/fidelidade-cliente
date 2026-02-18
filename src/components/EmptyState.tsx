import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Button, Stack, Typography } from '@mui/material';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Stack spacing={1} alignItems="center" sx={{ py: 6, px: 2, bgcolor: '#fff', border: '1px dashed #d7dce2', borderRadius: 3 }}>
    <InboxOutlinedIcon color="disabled" />
    <Typography variant="h6">{title}</Typography>
    <Typography color="text.secondary">{description}</Typography>
    {actionLabel && onAction ? (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);
