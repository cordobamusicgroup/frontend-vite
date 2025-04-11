import { Box, Skeleton } from '@mui/material';

export default function SkeletonLoader() {
  return (
    <Box p={3}>
      <Skeleton animation="wave" width="100%" height={60} />
      <Skeleton animation="wave" variant="rounded" width="100%" height={300} sx={{ marginY: 2 }} />
    </Box>
  );
}
