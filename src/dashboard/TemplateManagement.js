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
import Header from './components/Header';

import ModalConfirmDelete from './template-components/ModalConfirmDelete';
import { getAllTemplates, deleteTemplateById } from '../service/templateService';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const fetchTemplates = async () => {
    try {
      const response = await getAllTemplates(1, 12);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setNotification({
        open: true,
        severity: 'error',
        message: 'Failed to fetch templates!',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOpenModal = (id) => {
    setTemplateToDelete(id);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTemplateById(templateToDelete);
      setTemplates(templates.filter((template) => template.id !== templateToDelete));
      setNotification({
        open: true,
        severity: 'success',
        message: 'Template deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      setNotification({
        open: true,
        severity: 'error',
        message: 'Failed to delete template!',
      });
    } finally {
      setOpenModal(false);
      setTemplateToDelete(null);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit template with ID: ${id}`);
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    { field: 'accessType', headerName: 'Access Type', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleOpenModal(params.id)}
        />,
      ],
    },
  ];

  return (
    <>
      <Header />
      <Box>
        <Typography variant="h4" gutterBottom>
          Template Management
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Add template modal here')}
        >
          Add Template
        </Button>
      </Box>
      <Box sx={{ height: 500 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="text" width="30%" height={40} />
              <Skeleton variant="text" width="40%" height={40} sx={{ ml: 2 }} />
            </Box>
          ))
        ) : (
          <DataGrid rows={templates} columns={columns} pageSize={5} />
        )}
      </Box>
      <ModalConfirmDelete
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={handleDelete}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </>
  );
};

export default TemplateManagement;
