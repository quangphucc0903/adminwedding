import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, TextField, Input, Button } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
} from "../../../utils/draggableComponents";

const Toolbar = ({
  activeStyles,
  handleStyleChange,
  invitationData,
  setInvitationData,
  updateSections,
  selectedComponent, // Current selected component
  handleTextChange, // Function to update text content
  handleFileUpload,
  onDropdownChange, // Function to handle image uploads
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (activeStyles) {
      setTabIndex(1);
    } else if (!activeStyles && tabIndex === 1) {
      setTabIndex(0);
    }
  }, [activeStyles]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !activeStyles) return;
    setTabIndex(newValue);
  };

  const handleInputChange = (field, value) => {
    setInvitationData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box
      sx={{
        width: "250px",
        padding: 1,
        borderRight: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #ddd",
        zIndex: 1,
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="General" />
        {activeStyles && <Tab label="Style" />}
        <Tab label="Shape" />
      </Tabs>

      <Box sx={{ flexGrow: 1, width: "100%", mt: 2 }}>
        {/* General Tab */}
        {tabIndex === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={invitationData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              margin="normal"
            />
          </Box>
        )}

        {/* Style Tab */}
        {activeStyles && tabIndex === 1 && (
          <Box>
            <StyleEditor
              activeStyles={activeStyles}
              handleStyleChange={handleStyleChange}
              selectedItem={selectedComponent?.id || ""}
              onChange={onDropdownChange}
            />
          </Box>
        )}

        {/* Shape Tab */}
        {tabIndex === 2 && (
          <Box>
            <TextBox />
            <ImageBox />
            <Rectangle />
            <Circle />
            <Diamond />
            <Line />
          </Box>
        )}

        {/* Additional Editing Tools */}
        {selectedComponent && (
          <Box sx={{ mt: 3 }}>
            {/* Text Editing */}
            {selectedComponent.type === "text" && (
              <TextField
                fullWidth
                label="Text Content"
                variant="outlined"
                value={selectedComponent.text || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                margin="normal"
              />
            )}

            {/* Image Upload */}
            {selectedComponent.type === "image" && (
              <Box>
                <Button variant="contained" component="label">
                  Upload Image
                  <Input type="file" onChange={handleFileUpload} hidden />
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
