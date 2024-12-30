import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "./components/Header";
import { getAllOrders } from "../service/planSevrvice";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(page, limit);
      setOrders(response?.data?.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const columns = [
    {
      field: "NameUser",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const { user } = params?.row;
        return user?.name || "N/A";
      },
    },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "subscriptionPlanName",
      headerName: "Subscription Plan Name",
      flex: 1,
      renderCell: (params) => {
        const { subscriptionPlan } = params?.row;
        return subscriptionPlan?.name || "N/A";
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      renderCell: (params) => {
        const { subscriptionPlan } = params?.row;
        return subscriptionPlan?.duration || "N/A";
      },
    },
  ];

  return (
    <Box style={{ padding: "0 30px" }}>
      <Header />
      <Paper style={{ marginTop: "20px" }}></Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 2,
        }}
      ></Box>
      <Box style={{ height: 400 }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={limit}
          disableSelectionOnClick
          getRowId={(row) => row?.id}
          loading={loading}
          onPageChange={(newPage) => setPage(newPage + 1)}
          pagination
          page={page - 1}
          rowCount={total}
        />
      </Box>
    </Box>
  );
};

export default Order;
