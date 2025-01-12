import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, TextField, MenuItem, Input } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
} from "../../utils/draggableComponents";
import { getAllSubscription } from "../../service/templateService"; // Import hàm getAllSubscription

const Toolbar = ({
  activeStyles,
  handleStyleChange,
  templateData,
  setTemplateData,
  selectedItem,
  onDropdownChange,
  subscriptionPlan,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    if (activeStyles) {
      setTabIndex(1);
    } else if (!activeStyles && tabIndex === 1) {
      setTabIndex(0);
    }
  }, [activeStyles]);
  useEffect(() => {
    // Gọi API khi component được mount
    const fetchSubscriptions = async () => {
      try {
        const data = await getAllSubscription();
        setSubscriptions(data); // Lưu trữ kết quả API trong state
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !activeStyles) return;
    setTabIndex(newValue);
  };

  const handleInputChange = (field, value) => {
    setTemplateData((prevData) => ({
      ...prevData,
      [field]: field === "subscriptionPlanId" ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTemplateData((prevData) => ({
      ...prevData,
      thumbnailUrl: file,
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

        {activeStyles && tabIndex === 1 && (
          <Box>
            <StyleEditor
              activeStyles={activeStyles}
              handleStyleChange={handleStyleChange}
              selectedItem={selectedItem}
              onChange={onDropdownChange}
            />
          </Box>
        )}

        {tabIndex === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={templateData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={templateData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              margin="normal"
            />
            {/* Dropdown hiển thị kết quả API */}
            <TextField
              fullWidth
              select
              label="Subscription Plan"
              value={templateData.subscriptionPlanId || ""} // Sử dụng subscriptionPlanId
              onChange={
                (e) => handleInputChange("subscriptionPlanId", e.target.value) // Lưu subscriptionPlanId
              }
              margin="normal"
            >
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <MenuItem key={subscription.id} value={subscription.id}>
                    {subscription.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No subscriptions available</MenuItem>
              )}
            </TextField>

            {/* Trường upload ảnh thumbnail */}
            <Box sx={{ marginTop: "16px" }}>
              <Input
                type="file"
                onChange={handleFileChange}
                fullWidth
                inputProps={{ accept: "image/*" }}
              />
              {templateData.thumbnailUrl && (
                <Box sx={{ marginTop: "8px" }}>
                  {typeof templateData.thumbnailUrl === "string" ? (
                    <img
                      src={templateData.thumbnailUrl}
                      alt="Thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(templateData.thumbnailUrl)}
                      alt="Thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
