import React from 'react';
import { Grid, Pagination } from '@mui/material';
import VolunteerCard from './VolunteerCard';
import VolunteerTable from './VolunteerTable';
import VolunteerCardSkeleton from './VolunteerCardSkeleton';
import VolunteerTableSkeleton from './VolunteerTableSkeleton';

const VolunteerList = ({ volunteers, loading, viewMode, onEdit, onToggleStatus, page, totalPages, onPageChange }) => {
  if (loading) {
    return viewMode === 'card' ? (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <VolunteerCardSkeleton />
          </Grid>
        ))}
      </Grid>
    ) : (
      <VolunteerTableSkeleton />
    );
  }

  return (
    <>
      {viewMode === 'card' ? (
        <Grid container spacing={3}>
          {volunteers.map((volunteer) => (
            <Grid item xs={12} sm={6} md={4} key={volunteer.id}>
              <VolunteerCard
                volunteer={volunteer}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <VolunteerTable
          volunteers={volunteers}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </>
  );
};

export default VolunteerList;