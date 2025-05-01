"use client"

import React from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Box,
  IconButton,
  TableContainer,
  Skeleton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Public as PublicIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
} from "@mui/icons-material"

const ParentsList = ({ parents, loading, viewMode, onEdit, onToggleStatus, page, totalPages, onPageChange }) => {
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [parentToToggle, setParentToToggle] = React.useState(null)

  const formatGender = (gender) => {
    if (gender === "male") return "M"
    if (gender === "female") return "F"
    return gender
  }

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : ""
  }

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
                <Skeleton variant="text" height={30} width="80%" sx={{ mx: "auto" }} />
                <Skeleton variant="text" height={20} width="60%" sx={{ mx: "auto" }} />
                <Skeleton variant="text" height={20} width="40%" sx={{ mx: "auto" }} />
              </CardContent>
              <CardContent>
                <Skeleton variant="rectangular" height={36} width="100%" sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={36} width="100%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  if (parents.length === 0) {
    return (
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">No se encontraron padres/madres</Typography>
      </Paper>
    )
  }

  const handleToggleStatusClick = (parent) => {
    setParentToToggle(parent)
    setOpenConfirm(true)
  }

  const handleConfirmToggleStatus = () => {
    setOpenConfirm(false)
    if (parentToToggle) {
      onToggleStatus(parentToToggle.id)
    }
  }

  const renderPagination = () => (
    <Box mt={2} display="flex" justifyContent="center">
      <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" />
    </Box>
  )

  return (
    <>
      {viewMode === "table" ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DNI</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Nacionalidad</TableCell>
                  <TableCell>Fecha de Nacimiento</TableCell>
                  <TableCell>Género</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.document_id}</TableCell>
                    <TableCell>{parent.name}</TableCell>
                    <TableCell>{parent.last_name}</TableCell>
                    <TableCell>{parent.email || "-"}</TableCell>
                    <TableCell>{parent.phone || "-"}</TableCell>
                    <TableCell>{parent.address || "-"}</TableCell>
                    <TableCell>{parent.nationality || "-"}</TableCell>
                    <TableCell>{parent.birthdate || "-"}</TableCell>
                    <TableCell>{formatGender(parent.gender) || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={parent.status ? "Activo" : "Inactivo"}
                        color={parent.status ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" color="primary" onClick={() => onEdit(parent)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color={parent.status ? "error" : "success"}
                          onClick={() => handleToggleStatusClick(parent)}
                        >
                          {parent.status ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {renderPagination()}
        </>
      ) : (
        <>
          <Grid container spacing={3}>
            {parents.map((parent) => (
              <Grid item xs={12} sm={6} md={4} key={parent.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
                        {getInitial(parent.name)}
                      </Avatar>
                    </Box>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      {parent.name} {parent.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                      DNI: {parent.document_id}
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="center">
                      <Chip label={parent.status ? "Activo" : "Inactivo"} color={parent.status ? "success" : "error"} />
                    </Box>
                    <Box mt={2}>
                      {parent.email && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2">{parent.email}</Typography>
                        </Box>
                      )}
                      {parent.phone && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2">{parent.phone}</Typography>
                        </Box>
                      )}
                      {parent.address && (
                        <Box display="flex" alignItems="center">
                          <HomeIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" noWrap title={parent.address}>
                            {parent.address}
                          </Typography>
                        </Box>
                      )}
                      {parent.nationality && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <PublicIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Nacionalidad: {parent.nationality}
                          </Typography>
                        </Box>
                      )}
                      {parent.birthdate && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <CakeIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Fecha de Nacimiento: {parent.birthdate}
                          </Typography>
                        </Box>
                      )}
                      {parent.gender && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <WcIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Género: {formatGender(parent.gender)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardContent>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(parent)}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      startIcon={parent.status ? <BlockIcon /> : <CheckCircleIcon />}
                      color={parent.status ? "error" : "success"}
                      onClick={() => handleToggleStatusClick(parent)}
                      fullWidth
                      variant="outlined"
                    >
                      {parent.status ? "Desactivar" : "Activar"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {renderPagination()}
        </>
      )}

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirmar ${parentToToggle?.status ? "desactivación" : "activación"}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Estás seguro de que quieres ${parentToToggle?.status ? "desactivar" : "activar"} a ${
              parentToToggle?.name
            } ${parentToToggle?.last_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmToggleStatus} color={parentToToggle?.status ? "error" : "success"} autoFocus>
            {parentToToggle?.status ? "Desactivar" : "Activar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ParentsList