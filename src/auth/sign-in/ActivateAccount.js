import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { EmailOutlined, KeyOutlined, SendOutlined } from '@mui/icons-material';
import axios from 'axios';

export default function ActivateAccount({ open, handleClose }) {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleActivate = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/activate?token=${token}`
      );
      if (response?.status === 200) {
        setNotification({
          open: true,
          severity: 'success',
          message:
            response.data.data.message || 'Account activated successfully!',
        });
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      setNotification({
        open: true,
        severity: 'error',
        message: errorMessage,
      });
    }
  };

  const handleResendToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/resend-activation-token`,
        { email }
      );
      if (response.status === 201) {
        setNotification({
          open: true,
          severity: 'success',
          message:
            response.data.data.message ||
            'A new activation token has been sent to your email!',
        });
        setResendCooldown(60);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to resend the activation token. Please try again.';
      setNotification({
        open: true,
        severity: 'error',
        message: errorMessage,
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
        <form onSubmit={handleActivate}>
          <DialogTitle>
            <Typography variant='h6' fontWeight='bold' textAlign='center'>
              Activate Your Account
            </Typography>
          </DialogTitle>
          <DialogContent>
            {/* Email và nút Resend Token */}
            <Box mb={3}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Enter your email to resend the activation token
              </Typography>
              <Box display='flex' alignItems='center' gap={1}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  InputProps={{
                    startAdornment: (
                      <EmailOutlined color='action' sx={{ mr: 1 }} />
                    ),
                  }}
                  required
                />
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={handleResendToken}
                  disabled={resendCooldown > 0}
                  sx={{ height: '56px' }}
                >
                  {resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <SendOutlined />
                  )}
                </Button>
              </Box>
            </Box>

            {/* Token và nút Activate */}
            <Box>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Enter the token to activate your account
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Activation Token'
                  type='text'
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder='Enter activation token'
                  InputProps={{
                    startAdornment: (
                      <KeyOutlined color='action' sx={{ mr: 1 }} />
                    ),
                  }}
                  required
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                >
                  Activate Account
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
