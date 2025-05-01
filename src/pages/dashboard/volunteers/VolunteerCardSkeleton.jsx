import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const VolunteerCardSkeleton = () => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <Skeleton variant="circular" width={100} height={100} />
        </Box>
        <Skeleton variant="text" width="80%" height={32} style={{ margin: '0 auto' }} />
        <Skeleton variant="text" width="60%" height={24} style={{ margin: '0 auto' }} />
        <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      </CardContent>
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={36} style={{ marginBottom: '8px' }} />
        <Skeleton variant="rectangular" width="100%" height={36} />
      </CardContent>
    </Card>
  );
};

export default VolunteerCardSkeleton;