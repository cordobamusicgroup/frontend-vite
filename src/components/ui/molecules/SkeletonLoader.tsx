import { Box, Skeleton } from '@mui/material';

export default function SkeletonLoader() {
  return (
    <Box p={3}>
      <Skeleton animation="wave" width="100%" height={80} />
      <Skeleton animation="wave" variant="rounded" width="100%" height={500} sx={{ marginY: 2 }} />
    </Box>
  );
}
