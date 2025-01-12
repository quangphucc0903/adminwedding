import React, { useState } from "react";
import Draggable from "react-draggable";
import {
  Box,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { uploadImages } from "../../service/templateService.js";

const ComponentItem = ({
  component,
  handleDelete,
  setActiveItem,
  setActiveStyles,
  active,
  onDrag,
  setGuides,
  isViewMode,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageSrc, setImageSrc] = useState(component.src || ""); // Đường dẫn ảnh
  const [openTextEdit, setOpenTextEdit] = useState(false);

  const [newText, setNewText] = useState(component.text || "");

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveItem();
    setActiveStyles();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleTextEditOpen = () => {
    setOpenTextEdit(true);
    handleCloseMenu();
  };

  const handleTextEditClose = () => {
    setOpenTextEdit(false);
  };

  const handleSaveTextEdit = () => {
    component.text = newText;
    setOpenTextEdit(false);
  };

  const handleDragStop = (e, data) => {
    component.style = {
      ...component.style,
      left: data.x,
      top: data.y,
      width: component.style.width,
      height: component.style.height,
    };
    onDrag({
      left: data.x,
      top: data.y,
      width: component.style.width,
      height: component.style.height,
    });

    // Reset guides
    setTimeout(() => {
      setGuides({ vertical: null, horizontal: null, snapLines: [] });
    }, 500);
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImage = await uploadImages(file);
        setImageSrc(uploadedImage.data.url);
        component.src = uploadedImage.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={{
        x: component.style.left,
        y: component.style.top,
        width: component.style.width,
        height: component.style.height,
      }}
      onStop={handleDragStop}
      disabled={isViewMode}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: component.style.width,
          height: component.type === "line" ? "3px" : component.style.height,
          fontSize: component.style.fontSize,
          fontFamily: component.style.fontFamily,
          color: component.style.color,
          border: isHovered || active ? "1px solid #f50057" : "1px solid #ddd",
          backgroundColor:
            component.type === "line"
              ? component.style.fillColor
              : component.style.fillColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isViewMode ? "default" : "move",
          padding: 0,
          transition: component.type === "diamond" ? "" : "border 0.3s ease",
          borderRadius:
            component.type === "circle" ? "50%" : component.style.borderRadius,
          borderWidth: component.style.borderWidth,
          borderColor: component.style.borderColor,
          borderStyle: component.style.borderStyle,
          transform:
            component.type === "diamond"
              ? "rotate(45deg)"
              : component.style.transform,
          opacity: component.style.opacity / 100,
        }}
        onDoubleClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleOpenMenu(e);
        }}
      >
        {component.type === "text" && <span>{component.text || "Text"}</span>}

        {(component.type === "image" || component.type === "circle") && (
          <img
            src={imageSrc}
            style={{
              width: component.style.width,
              height: component.style.height,
              objectFit: "cover",
              borderRadius:
                component.type === "circle"
                  ? "50%"
                  : component.style.borderRadius,
            }}
          />
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: 200,
              width: "15ch",
            },
          }}
        >
          <MenuItem onClick={handleTextEditOpen}>Edit Text</MenuItem>
          <MenuItem>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              id={`upload-image-${component.id}`}
            />
            <label htmlFor={`upload-image-${component.id}`}>Chèn ảnh</label>
          </MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>

        <Dialog open={openTextEdit} onClose={handleTextEditClose}>
          <DialogTitle>Edit Text</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              variant="outlined"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTextEditClose}>Cancel</Button>
            <Button onClick={handleSaveTextEdit}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Draggable>
  );
};

export default ComponentItem;
