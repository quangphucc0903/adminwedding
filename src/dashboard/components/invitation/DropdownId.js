import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const DropdownMenu = ({ selectedItem, onChange }) => {
  const menuItems = [
    { label: "FIXED", value: "fixed" },
    { label: "Header (section)", value: "header_section" },
    { label: "Tên cô dâu", value: "ten_co_dau" },
    { label: "Tên chú rể", value: "ten_chu_re" },
    { label: "Tên Khách", value: "ten_khach" },
    { label: "Quan hệ", value: "quan_he" },
    { label: "Cuộc hành trình (section)", value: "cuoc_hanh_trinh" },
    { label: "Số ngày yêu nhau", value: "so_ngay_yeu_nhau" },
    { label: "Xác nhận tham gia", value: "xac_nhan_tham_gia" },
    { label: "Mừng cưới", value: "mung_cuoi" },
    { label: "Gửi lời chúc", value: "gui_loi_chuc" },
    { label: "About (section)", value: "about_section" },
    { label: "Về cô dâu", value: "ve_co_dau" },
    { label: "Về chú rể", value: "ve_chu_re" },
    { label: "Chuyện tình yêu (section)", value: "chuyen_tinh_yeu" },
    { label: "Story 1", value: "story_1" },
    { label: "Story 2", value: "story_2" },
    { label: "Story 3", value: "story_3" },
    { label: "Album (section)", value: "album_section" },
    { label: "Image 1", value: "image_1" },
    { label: "Image 2", value: "image_2" },
    { label: "Image 3", value: "image_3" },
    { label: "Image 4", value: "image_4" },
    { label: "Image 5", value: "image_5" },
    { label: "Image 6", value: "image_6" },
    { label: "Image 7", value: "image_7" },
    { label: "Image 8", value: "image_8" },
    { label: "Image 9", value: "image_9" },
    { label: "Image 10", value: "image_10" },
    { label: "Địa chỉ tiệc (section)", value: "dia_chi_tiec" },
    { label: "Mừng cưới (section)", value: "mung_cuoi_section" },
    { label: "Gửi lời chúc (section)", value: "gui_loi_chuc_section" },
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
