import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, RadioGroup, FormControlLabel, Avatar, Chip, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Cake, Event } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 16,
}));

const StyledTableRow = styled(motion.tr)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledRadio = styled(FormControlLabel)(({ theme }) => ({
  marginRight: theme.spacing(1),
  '& .MuiRadio-root': {
    padding: 4,
  },
}));

const AttendanceChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  backgroundColor: 
    status === 'A' ? theme.palette.success.light :
    status === 'T' ? theme.palette.warning.light :
    status === 'F' ? theme.palette.error.light :
    theme.palette.grey[300],
  color: 
    status === 'A' ? theme.palette.success.contrastText :
    status === 'T' ? theme.palette.warning.contrastText :
    status === 'F' ? theme.palette.error.contrastText :
    theme.palette.text.primary,
}));

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const MobileStudentCard = ({ student, courseInfo, selectedOption, handleOptionChange, isInitiallyMarked }) => (
  <Card component={motion.div} 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={student.avatar} alt={student.name} sx={{ width: 60, height: 60, mr: 2 }} />
        <Box>
          <Typography variant="h6">{`${student.name} ${student.last_name}`}</Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <School sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="body1">
          {courseInfo ? courseInfo.name : 'Cargando...'}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Event sx={{ mr: 1, color: 'secondary.main' }} />
        <Typography variant="body1">
          Sesión: <Chip label="S1" color="secondary" size="small" sx={{ ml: 1 }} />
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Cake sx={{ mr: 1, color: 'error.main' }} />
        <Typography variant="body1">
          {formatDate(student.birthdate)}
        </Typography>
      </Box>
      <RadioGroup
        row
        value={selectedOption[student.id] || ''}
        onChange={(e) => handleOptionChange(student.id, e.target.value)}
      >
        <StyledRadio 
          value="A" 
          control={<Radio color="success" />} 
          label={<Typography color="success.main" fontWeight="bold">A</Typography>}
          disabled={isInitiallyMarked}
        />
        <StyledRadio 
          value="T" 
          control={<Radio color="warning" />} 
          label={<Typography color="warning.main" fontWeight="bold">T</Typography>}
          disabled={isInitiallyMarked}
        />
        <StyledRadio 
          value="F" 
          control={<Radio color="error" />} 
          label={<Typography color="error.main" fontWeight="bold">F</Typography>}
          disabled={isInitiallyMarked}
        />
      </RadioGroup>
    </CardContent>
  </Card>
);

const StudentsTable = ({
  students,
  courseInfo,
  selectedOption,
  handleOptionChange,
  isInitiallyMarked,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <AnimatePresence>
          {students.map((student) => (
            <MobileStudentCard
              key={student.id}
              student={student}
              courseInfo={courseInfo}
              selectedOption={selectedOption}
              handleOptionChange={handleOptionChange}
              isInitiallyMarked={isInitiallyMarked}
            />
          ))}
        </AnimatePresence>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>N°</StyledTableCell>
            <StyledTableCell>NOMBRE COMPLETO</StyledTableCell>
            <StyledTableCell>CURSO</StyledTableCell>
            <StyledTableCell>SESION</StyledTableCell>
            <StyledTableCell>NACIMIENTO</StyledTableCell>
            <StyledTableCell>ASISTENCIA</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {students.map((student, index) => (
              <StyledTableRow
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={student.avatar} alt={student.name} sx={{ width: 40, height: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">{`${student.name} ${student.last_name}`}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{courseInfo ? courseInfo.name : 'Cargando...'}</TableCell>
                <TableCell>
                  <Chip label="S1" color="secondary" size="small" />
                </TableCell>
                <TableCell>{formatDate(student.birthdate)}</TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={selectedOption[student.id] || ''}
                    onChange={(e) => handleOptionChange(student.id, e.target.value)}
                  >
                    <StyledRadio 
                      value="A" 
                      control={<Radio color="success" />} 
                      label={<Typography color="success.main" fontWeight="bold">A</Typography>}
                      disabled={isInitiallyMarked}
                    />
                    <StyledRadio 
                      value="T" 
                      control={<Radio color="warning" />} 
                      label={<Typography color="warning.main" fontWeight="bold">T</Typography>}
                      disabled={isInitiallyMarked}
                    />
                    <StyledRadio 
                      value="F" 
                      control={<Radio color="error" />} 
                      label={<Typography color="error.main" fontWeight="bold">F</Typography>}
                      disabled={isInitiallyMarked}
                    />
                  </RadioGroup>
                </TableCell>
              </StyledTableRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsTable;