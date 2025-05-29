import React from 'react';
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import TableViewIcon from '@mui/icons-material/TableView';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';

export default function AttendanceHeader({ courseInfo, searchTerm, setSearchTerm, students, selectedOption, onMarkAllPresent, isModifying }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencia');

    // Definir estilos
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} }
    };

    const cellStyle = {
      alignment: { horizontal: 'left', vertical: 'middle' },
      border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} }
    };

    // Configurar columnas
    worksheet.columns = [
      { header: 'N°', key: 'number', width: 5 },
      { header: 'FULLNAME', key: 'fullname', width: 30 },
      { header: 'COURSE', key: 'course', width: 20 },
      { header: 'SESSION', key: 'session', width: 10 },
      { header: 'BIRTHDATE', key: 'birthdate', width: 15 },
      { header: 'ATTENDANCE', key: 'attendance', width: 15 }
    ];

    // Aplicar estilos a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });

    // Añadir datos de estudiantes
    students.forEach((student, index) => {
      const row = worksheet.addRow({
        number: index + 1,
        fullname: `${student.name} ${student.last_name}`,
        course: courseInfo ? courseInfo.name : 'Cargando...',
        session: 'S1',
        birthdate: student.birthdate ? new Date(student.birthdate).toLocaleDateString() : 'Fecha no disponible',
        attendance: selectedOption[student.id] || ''
      });

      // Aplicar estilos a las celdas
      row.eachCell((cell) => {
        cell.style = cellStyle;
      });

      // Aplicar color de fondo a la celda de asistencia según el valor
      const attendanceCell = row.getCell('attendance');
      switch (selectedOption[student.id]) {
        case 'P':
          attendanceCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } }; // Verde
          break;
        case 'T':
          attendanceCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // Amarillo
          break;
        case 'A':
          attendanceCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000' } }; // Rojo
          break;
        case 'J':
          attendanceCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } }; // Azul
          break;
      }
    });

    // Añadir una fila de totales
    const totalRow = worksheet.addRow({
      number: '',
      fullname: 'Total de Estudiantes',
      course: '',
      session: '',
      birthdate: '',
      attendance: students.length
    });
    totalRow.eachCell((cell) => {
      cell.style = {...cellStyle, font: { bold: true }};
    });

    // Añadir título del curso
    worksheet.spliceRows(1, 0, []);
    worksheet.spliceRows(1, 0, [`Asistencia - ${courseInfo ? courseInfo.name : 'Curso'}`]);
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center' }
    };
    worksheet.mergeCells('A1:F1');

    // Añadir una fila de leyenda
    const legendRow = worksheet.addRow(['Leyenda:', '', '', '', '', '']);
    worksheet.mergeCells(`A${legendRow.number}:F${legendRow.number}`);
    legendRow.getCell('A').value = 'Leyenda de Asistencia:';
    legendRow.getCell('A').font = { bold: true };

    // Añadir elementos de la leyenda
    worksheet.addRow(['P - PRESENT (Presente)', '', '', '', '', '']);
    worksheet.addRow(['T - TARDY (Tarde)', '', '', '', '', '']);
    worksheet.addRow(['A - ABSENT (Ausente)', '', '', '', '', '']);
    worksheet.addRow(['J - JUSTIFIED (Justificado)', '', '', '', '', '']);

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Asistencia_${courseInfo ? courseInfo.name : 'Curso'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <Box mb={4}>
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        justifyContent="space-between" 
        alignItems={isMobile ? 'stretch' : 'center'} 
        gap={3}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar Alumno"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
        <Box 
          display="flex" 
          flexDirection={isMobile ? 'column' : 'row'} 
          gap={2}
          width={isMobile ? '100%' : 'auto'}
        >
          <Button
            fullWidth={isMobile}
            variant="contained"
            color="primary"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={onMarkAllPresent}
            sx={{ 
              py: 1.5,
              px: 3,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
            disabled={!isModifying && students.some(student => selectedOption[student.id])}
          >
            Marcar Todos Presentes
          </Button>
          <Button
            fullWidth={isMobile}
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={exportToExcel}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: '0.9rem',
              backgroundColor: '#1D6F42',
              '&:hover': {
                backgroundColor: '#15532F',
              },
            }}
          >
            Exportar
          </Button>
        </Box>
      </Box>
      
      {isModifying && (
        <Box mt={2} bgcolor="info.lighter" p={2} borderRadius={1}>
          <Typography variant="body2" color="info.main" fontWeight="medium">
            <InfoIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
            Modo de modificación activado. Realice los cambios necesarios y guarde las modificaciones.
          </Typography>
        </Box>
      )}
    </Box>
  );
}