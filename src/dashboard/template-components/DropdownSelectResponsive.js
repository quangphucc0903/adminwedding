import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const DropdownSelectResponsive = ({
  selectedItemSectionId,
  onChangeSection,
}) => {
  const menuItems = [{ label: "Responsive", value: "responsive_section" }];

  const handleChange = (e) => {
    const value = e.target.value;
    onChangeSection(value); // Trigger the parent
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Select
        value={selectedItemSectionId}
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

export default DropdownSelectResponsive;
