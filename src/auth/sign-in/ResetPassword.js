import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Alert,
  FormLabel,
  FormControl,
} from "@mui/material";

import { resetPassword } from "../../service/authService";

export default function ResetPassword({ open, handleClose }) {
  const [token, setToken] = useState(""); // Thêm state cho token
  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await resetPassword(token, newPassword); // Gửi token và mật khẩu mới
      if (response) {
        setNotification({
          open: true,
          severity: "success",
          message: response.message || "Đặt lại mật khẩu thành công",
        });
        setTimeout(() => {
          handleClose(); // Đóng modal sau khi thành công
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại";
      setNotification({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Đặt lại mật khẩu của bạn</DialogTitle>

          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Token đặt lại mật khẩu</FormLabel>
              <TextField
                autoFocus
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Nhập mã token đã gửi đến email của bạn"
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Mật khẩu mới</FormLabel>
              <TextField
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained">
              Gửi
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
