import { Snackbar, Alert } from "@mui/material"

const CustomSnackbar = ({ open, message, severity, onClose, autoHideDuration = 6000 }) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar

