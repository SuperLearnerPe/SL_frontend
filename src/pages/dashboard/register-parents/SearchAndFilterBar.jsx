import {
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
  } from "@mui/material"
  import SearchIcon from "@mui/icons-material/Search"
  import ViewListIcon from "@mui/icons-material/ViewList"
  import ViewModuleIcon from "@mui/icons-material/ViewModule"
  import AddIcon from "@mui/icons-material/Add"
  
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
    entityName = "Estudiante",
  }) => {
    const handleViewModeChange = (event, newViewMode) => {
      if (newViewMode !== null) {
        setViewMode(newViewMode)
      }
    }
  
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus}
              label="Estado"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="1">Activo</MenuItem>
              <MenuItem value="0">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {filterGender && (
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="gender-filter-label">Género</InputLabel>
              <Select
                labelId="gender-filter-label"
                value={filterGender}
                label="Género"
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={2}>
          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange}>
            <ToggleButton value="card" aria-label="card">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={2} style={{ textAlign: "right" }}>
          <IconButton color="primary" aria-label="add new" onClick={onAddNew} title={`Añadir ${entityName}`}>
            <AddIcon />
          </IconButton>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Añadir {entityName}
          </Typography>
        </Grid>
      </Grid>
    )
  }
  
  export default SearchAndFilterBar
  
  