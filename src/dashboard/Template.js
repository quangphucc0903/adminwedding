import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  getAllTemplates,
  deleteTemplateById,
  duplicateTemplate,
  getSectionsByTemplateId,
  createSectionDuplicate,
  deleteInvitation,
} from "../service/templateService";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "./components/Header";



const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplates(1);
        const processedData = response.data.map((template) => ({
          ...template,
          subscriptionPlan: template.subscriptionPlan || {
            name: "No Plan",
            description: "",
            price: "0.00",
            duration: 0,
          },
        }));
        setTemplates(processedData);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-template/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplateById(id);
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleView = (id) => {
    navigate(`/view-template/${id}`);
  };

  const handleAddTemplate = () => {
    navigate("/create-template");
  };

  const handleDuplicate = async (id) => {
    try {
      const originalTemplate = templates.find((template) => template.id === id);

      if (!originalTemplate) {
        console.error("Template not found!");
        return;
      }

      const duplicatedTemplate = {
        ...originalTemplate,
        id: null,
        name: `${originalTemplate.name} (Copy)`,
      };

      const response = await duplicateTemplate(
        duplicatedTemplate,
        duplicatedTemplate.thumbnailUrl
      );
      const newTemplate = response.data;

      const sectionsResponse = await getSectionsByTemplateId(originalTemplate.id);
      const sections = sectionsResponse.data;

      if (sections.length > 0) {
        const duplicateSectionsPromises = sections.map((section) =>
          createSectionDuplicate({
            ...section,
            id: uuidv4(),
            templateId: newTemplate.id,
          })
        );

        await Promise.all(duplicateSectionsPromises);
      }
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    } catch (error) {
      console.error("Error duplicating template and sections:", error);
    }
  };

  const handleCreateLetter = (id) => {
    navigate(`/create-letter/${id}`);
  };


  const handleDeleteInvitation = async (id) => {
    try {
      // Xác nhận trước khi xóa
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa lời mời này không?"
      );
      if (!confirmDelete) return;

      // Gọi API xóa
      await deleteInvitation(id);

      // Xử lý sau khi xóa thành công
      alert("Lời mời đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa lời mời:", error);
      alert(error.message || "Xóa lời mời thất bại!");
    }
  };


  const handlePreviewInvitation = (id) => {
    navigate(`/preview-invitation/${id}`);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "subscriptionPlan",
      headerName: "Subscription Plan",
      flex: 2,
      renderCell: (params) => {
        const plan = params.row.subscriptionPlan;
        if (!plan) return "No Plan";
        return (
          <Box>
            <Typography variant="body1">
              <strong>{plan.name}</strong>
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
          {/* Template Actions */}
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            borderRight: '1px solid #e0e0e0',
            pr: 1,
            alignItems: 'center'
          }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
              Template:
            </Typography>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleView(params.id)}>
                <RemoveRedEyeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(params.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicate">
              <IconButton size="small" onClick={() => handleDuplicate(params.id)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Template">
              <IconButton size="small" onClick={() => handleDelete(params.id)}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Letter Actions */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
              Letter:
            </Typography>
            <Tooltip title="Create Letter">
              <IconButton size="small" onClick={() => handleCreateLetter(params.id)}>
                <AddIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Preview Invitation">
              <IconButton size="small" onClick={() => handlePreviewInvitation(params.id)}>
                <PreviewIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Invitation">
              <IconButton size="small" onClick={() => handleDeleteInvitation(params.id)}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ padding: 2 }}>
        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 2,
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTemplate}
          >
            Create Template
          </Button>
        </Box>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={templates || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </>
  );
};

export default TemplateManagement;
