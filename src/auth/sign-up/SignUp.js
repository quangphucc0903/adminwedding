import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../shared-theme/AppTheme";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { register } from "../../service/authService";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SignUp = (props) => {
  const navigate = useNavigate();
  const [notification, setNotification] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [errors, setErrors] = React.useState({});

  const validateInputs = (userData) => {
    const newErrors = {};
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }
    if (!userData.password || userData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (!userData.name || userData.name.length < 1) {
      newErrors.name = "Tên là bắt buộc.";
    }
    if (!userData.phone || !/^\d{10,15}$/.test(userData.phone)) {
      newErrors.phone = "Vui lòng nhập số điện thoại hợp lệ.";
    }
    if (!userData.address || userData.address.length < 5) {
      newErrors.address = "Vui lòng nhập địa chỉ hợp lệ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      password: document.getElementById("password").value,
    };

    if (!validateInputs(userData)) return;

    try {
      await register(userData);
      setNotification({
        open: true,
        severity: "success",
        message:
          "Đăng ký thành công! Vui lòng kiểm tra email của bạn để kích hoạt tài khoản.",
      });
      setTimeout(() => navigate("/"), 2000); // Điều hướng sau khi đăng ký thành công
    } catch (error) {
      const errorMessage =
        error.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setNotification({ open: true, severity: "error", message: errorMessage });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Card sx={{ width: "100%", maxWidth: 450, p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Đăng ký
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Tên đầy đủ</FormLabel>
              <TextField
                id="name"
                error={!!errors.name}
                helperText={errors.name || ""}
                placeholder="Nguyen Minh Tu"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Email</FormLabel>
              <TextField
                id="email"
                error={!!errors.email}
                helperText={errors.email || ""}
                placeholder="tu123@email.com"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Số điện thoại</FormLabel>
              <TextField
                id="phone"
                error={!!errors.phone}
                helperText={errors.phone || ""}
                placeholder="0123456789"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Địa chỉ</FormLabel>
              <TextField
                id="address"
                error={!!errors.address}
                helperText={errors.address || ""}
                placeholder="123 Main Street"
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Mật khẩu</FormLabel>
              <TextField
                id="password"
                type="password"
                error={!!errors.password}
                helperText={errors.password || ""}
                placeholder="••••••"
              />
            </FormControl>
            <Button type="submit" variant="contained" fullWidth>
              Đăng ký
            </Button>
          </Box>
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Bạn đã có tài khoản?{" "}
            <Link
              onClick={() => navigate("/sign-in")}
              sx={{ cursor: "pointer" }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Card>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
        >
          <MuiAlert
            onClose={handleNotificationClose}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </MuiAlert>
        </Snackbar>
      </Stack>
    </AppTheme>
  );
};

export default SignUp;
