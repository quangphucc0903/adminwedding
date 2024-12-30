import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Header from "./components/Header";
import {
  fetchAllPlans,
  deletePlanById,
  updatePlanById,
  createSubscriptionPlans,
} from "../service/planSevrvice";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  const openAddDialog = () => {
    setEditForm({
      name: "",
      description: "",
      price: "",
      duration: "",
    });
    setDialogMode("add");
    setEditDialogOpen(true);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchAllPlans();
      setPlans(
        data.data.map((plan) => ({
          ...plan,
          id: plan.id,
        }))
      );
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (plan) => {
    setEditForm(plan);
    setDialogMode("edit");
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const { id, name, description, price, duration } = editForm;

      const payload = {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
      };
      if (dialogMode === "add") {
        console.log(payload);

        await createSubscriptionPlans(payload);
      } else if (dialogMode === "edit") {
        await updatePlanById(id, payload);
      }
      // Tải lại danh sách gói
      await fetchPlans();
      setEditDialogOpen(false);
    } catch (error) {
      alert(
        `Error: ${
          error.response?.data?.message ||
          `Failed to ${dialogMode === "add" ? "add" : "update"} plan.`
        }`
      );
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await deletePlanById(selectedPlan.id);
      await fetchPlans();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "duration", headerName: "Duration (months)", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setSelectedPlan(params.row);
            setDeleteDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => openEditDialog(params.row)}
        />,
      ],
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
      <Box style={{ padding: "0 30px" }}>
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
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add New Plan
            </Button>
          </Box>
          <Box sx={{ height: 500 }}>
            <DataGrid
              rows={plans}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </Box>
        </Box>
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Are you sure you want to delete this subscription plan?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>
            {dialogMode === "add"
              ? "Add New Subscription Plan"
              : "Edit Subscription Plan"}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              value={editForm.price}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Duration (months)"
              name="duration"
              type="number"
              value={editForm.duration}
              onChange={handleEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SubscriptionPlans;
