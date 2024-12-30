import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forgotPassword } from "../../service/authService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForgotPassword({ open, handleClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await forgotPassword(email);
      if (response) {
        setNotification({
          open: true,
          severity: "success",
          message: response.message || "Email đặt lại mật khẩu đã được gửi!",
        });
        setTimeout(() => {
          onSuccess(email); // Gọi callback và truyền email
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          sx: { backgroundImage: "none" },
        }}
      >
        <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nhập địa chỉ email của tài khoản, chúng tôi sẽ gửi cho bạn một liên
            kết để đặt lại mật khẩu.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            id="email"
            name="email"
            placeholder="Địa chỉ Email..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ForgotPassword;
