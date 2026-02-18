import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const ConfirmDialog = ({ open, title, onClose, onConfirm }: { open: boolean; title: string; onClose: () => void; onConfirm: () => void }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>Confirma a ação?</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} variant="contained">Confirmar</Button>
    </DialogActions>
  </Dialog>
);
