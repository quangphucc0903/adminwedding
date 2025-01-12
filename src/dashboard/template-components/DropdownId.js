import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const DropdownMenu = ({ selectedItem, onChange }) => {
  const menuItems = [
    { label: "Default", value: "default" },
    { label: "Tên cô dâu", value: "ten_co_dau" },
    { label: "Tên chú rể", value: "ten_chu_re" },
    { label: "Thời gian", value: "thoi_gian" },
    { label: "Địa điểm", value: "dia_diem" },
    { label: "Tên khách", value: "ten_khach" },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(value); // Trigger the parent
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Select
        value={selectedItem}
        onChange={handleChange}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="" disabled>
          -- Chọn mục --
        </MenuItem>
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DropdownMenu;
