import { Skeleton, Stack } from '@mui/material';

export const PageSkeleton = () => (
  <Stack spacing={1}>
    <Skeleton variant="text" width="40%" height={42} />
    <Skeleton variant="rectangular" height={120} />
    <Skeleton variant="rectangular" height={120} />
  </Stack>
);
