import { Skeleton, Stack } from '@mui/material';

export const PageSkeleton = () => (
  <Stack spacing={1.5}>
    <Skeleton variant="text" width="45%" height={48} />
    <Skeleton variant="rectangular" height={84} sx={{ borderRadius: 2 }} />
    <Skeleton variant="rectangular" height={84} sx={{ borderRadius: 2 }} />
    <Skeleton variant="rectangular" height={84} sx={{ borderRadius: 2 }} />
  </Stack>
);
