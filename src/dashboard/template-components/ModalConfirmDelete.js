import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

const ModalConfirmDelete = ({ open, onClose, onDelete, userToDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='confirm-delete-dialog'
    >
      <DialogTitle id='confirm-delete-dialog'>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Hủy
        </Button>
        <Button onClick={() => onDelete(userToDelete)} color='secondary'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirmDelete;
