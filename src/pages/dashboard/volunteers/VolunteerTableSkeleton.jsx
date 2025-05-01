import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton } from '@mui/material';

const VolunteerTableSkeleton = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Foto</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Nacionalidad</TableCell>
          <TableCell>Género</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(6)].map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
            <TableCell><Skeleton variant="text" width={150} /></TableCell>
            <TableCell><Skeleton variant="text" width={200} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={80} height={32} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={80} height={32} /></TableCell>
            <TableCell>
              <Skeleton variant="circular" width={40} height={40} style={{ display: 'inline-block', marginRight: '8px' }} />
              <Skeleton variant="circular" width={40} height={40} style={{ display: 'inline-block' }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VolunteerTableSkeleton;