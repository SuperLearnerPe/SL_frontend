import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"

const ConfirmDialog = ({ open, onClose, onConfirm, title, content }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

