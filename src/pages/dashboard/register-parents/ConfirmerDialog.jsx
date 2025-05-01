import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const ConfirmerDialog = ({ open, onClose, onConfirm, title, message, confirmButtonText, confirmButtonColor }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color={confirmButtonColor || "primary"} autoFocus>
          {confirmButtonText || "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmerDialog

