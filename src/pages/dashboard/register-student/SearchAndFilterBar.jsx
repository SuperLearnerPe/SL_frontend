import { Grid, TextField, Select, MenuItem, Button, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { ViewModule, ViewList } from "@mui/icons-material"

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterGender,
  setFilterGender,
  viewMode,
  setViewMode,
  onAddNew,
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Select fullWidth value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} variant="outlined">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="1">Activo</MenuItem>
          <MenuItem value="0">Inactivo</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={2}>
        <Select fullWidth value={filterGender} onChange={(e) => setFilterGender(e.target.value)} variant="outlined">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="male">Masculino</MenuItem>
          <MenuItem value="female">Femenino</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={2}>
        <ToggleButtonGroup value={viewMode} exclusive onChange={(e, newMode) => setViewMode(newMode)}>
          <ToggleButton value="card">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="table">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button variant="contained" color="primary" onClick={onAddNew}>
          Añadir Estudiante
        </Button>
      </Grid>
    </Grid>
  )
}

export default SearchAndFilterBar

