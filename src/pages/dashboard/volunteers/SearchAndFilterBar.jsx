import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchAndFilterBar = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, filterGender, setFilterGender, viewMode, setViewMode, onAddNew }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar voluntarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Estado</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Estado"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="1">Activo</MenuItem>
            <MenuItem value="0">Inactivo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Género</InputLabel>
          <Select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            label="Género"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Male">Masculino</MenuItem>
            <MenuItem value="Female">Femenino</MenuItem>
            
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControlLabel
          control={
            <Switch
              checked={viewMode === 'card'}
              onChange={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              color="primary"
            />
          }
          label={viewMode === 'card' ? 'Tarjetas' : 'Tabla'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          fullWidth
        >
          Añadir
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchAndFilterBar;