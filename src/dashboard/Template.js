import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
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
  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-template/${id}`);
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id); // Kiểm tra ID
    try {
      await deleteTemplateById(id); // Gọi API xóa
      setTemplates((prev) => prev.filter((template) => template.id !== id)); // Cập nhật danh sách
      console.log("Delete successful!");
    } catch (error) {
      console.error("Error deleting template:", error);
      alert(error.message || "Failed to delete the template.");
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

      const sectionsResponse = await getSectionsByTemplateId(
        originalTemplate.id
      );
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
    } finally {
      fetchTemplates();
    }
  };

  const handleCreateLetter = (id) => {
    navigate(`/create-letter/${id}`);
  };

  const handlePreviewInvitation = (id) => {
    navigate(`/preview-invitation/${id}`);
  };

  const columns = [
    {
      field: "thumbnailUrl",
      headerName: "Thumbnail",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Thumbnail"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "50px",
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "subscriptionPlan",
      headerName: "Subscription Plan",
      flex: 1,
      renderCell: (params) => {
        const plan = params.row.subscriptionPlan;
        if (!plan) return "No Plan";
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {plan.name}
          </Box>
        );
      },
    },
    {
      field: "templateActions",
      headerName: "Template Actions",
      flex: 1,

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Template Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            {/* <Typography
              variant="caption"
              sx={{ color: "text.secondary", mr: 1 }}
            >
              Template:
            </Typography> */}
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
              <IconButton
                size="small"
                onClick={() => handleDuplicate(params.id)}
              >
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
          {/* <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", mr: 1 }}
            >
              Letter:
            </Typography>
            <Tooltip title="Create Letter">
              <IconButton
                size="small"
                onClick={() => handleCreateLetter(params.id)}
              >
                <AddIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Preview Invitation">
              <IconButton
                size="small"
                onClick={() => handlePreviewInvitation(params.id)}
              >
                <PreviewIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </Box> */}
        </Box>
      ),
    },
    {
      field: "letterActions",
      headerName: "Letter Actions",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          {/* <Typography variant="caption" sx={{ color: "text.secondary", mr: 1 }}>
            Letter:
          </Typography> */}
          <Tooltip title="Create Letter">
            <IconButton
              size="small"
              onClick={() => handleCreateLetter(params.id)}
            >
              <AddIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Preview Invitation">
            <IconButton
              size="small"
              onClick={() => handlePreviewInvitation(params.id)}
            >
              <PreviewIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 2,
          }}
        >
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
