import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Skeleton,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Header from '../dashboard/components/Header';
import { AdminAPI } from '../service/admin';
import ModalConfirmDelete from '../clients/components/modal-clients/DeleteUser';
import ModalAddUser from '../clients/components/modal-clients/CreateUser';

const ClientManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await AdminAPI.getAllUser(1);

      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (id) => {
    setUserToDelete(id);
    setOpenModal(true);
  };

  const handleDelete = async (userId) => {
    if (userId) {
      try {
        await AdminAPI.deleteUserbyId(userId);
        setUsers(users.filter((user) => user.id !== userId));
        setNotification({
          open: true,
          severity: 'success',
          message: 'Người dùng đã được xóa thành công!',
        });
        setOpenModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        setNotification({
          open: true,
          severity: 'error',
          message: 'Đã có lỗi xảy ra khi xóa người dùng!',
        });
      }
    }
  };

  const handleEdit = (id) => {
    alert(`Sửa người dùng có ID: ${id}`);
  };

  const columns = [
    { field: 'name', headerName: 'Tên', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Số điện thoại', flex: 1 },
    {
      field: 'role',
      headerName: 'Vai trò',

      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Sửa'
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Xóa'
          onClick={() => handleOpenModal(params.id)}
        />,
      ],
    },
  ];

  return (
    <>
      <Header />
      <Box sx={{ alignItems: 'center' }}>
        <Typography variant='h4' gutterBottom>
          Quản lý người dùng
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 2,
          alignItems: 'center',
        }}
      >
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm người dùng
        </Button>
      </Box>
      <Box sx={{ height: 500 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Box
              sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}
              key={index}
            >
              <Skeleton
                variant='text'
                width='20%'
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant='text'
                width='30%'
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant='text'
                width='20%'
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant='text'
                width='20%'
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton variant='circular' width={40} height={40} />
            </Box>
          ))
        ) : (
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        )}
      </Box>

      <ModalConfirmDelete
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={handleDelete}
        userToDelete={userToDelete}
      />
      <ModalAddUser
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fetchUsers={fetchUsers}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClientManagement;
