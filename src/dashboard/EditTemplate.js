import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";
import {
  getTemplateById,
  updateTemplate,
  updateSection,
  createSection,
} from "../service/templateService";
import Headerv2 from "./template-components/Headerv2";
import LayerList from "./template-components/LayerList";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { v4 as uuidv4 } from "uuid";

const EditTemplate = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false); // State loading
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    subscriptionPlanId: "",
    thumbnailUrl: "",
    metaData: {},
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const fetchTemplateData = async () => {
    try {
      const template = await getTemplateById(id);
      console.log("Template", template);

      setTemplateData({
        ...template.data,
        subscriptionPlanId: template.data.subscriptionPlan?.id || "",
      });

      setSections(
        template.data.sections
          .map((section) => ({
            ...section,
            components: section.metadata?.components || [],
            style: section.metadata?.style || {},
          }))
          .sort((a, b) => parseInt(a.position) - parseInt(b.position)) // Sắp xếp theo position
      );
    } catch (error) {
      console.error("Error fetching template data:", error);
      showSnackbar("Failed to load template data!", "error");
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, [id]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveTemplate = async () => {
    setIsLoading(true); // Bật trạng thái loading

    try {
      // Lấy subscriptionPlanId và kiểm tra
      const subscriptionPlanId = parseInt(templateData.subscriptionPlanId, 10);
      if (isNaN(subscriptionPlanId)) {
        showSnackbar("Please select a valid subscription plan.", "error");
        setIsLoading(false);
        return;
      }

      // Gửi API
      const saveTemplate = await updateTemplate(
        id,
        {
          name: templateData.name,
          description: templateData.description,
          subscriptionPlanId,
          metaData: JSON.stringify(templateData.metaData), // Nếu metaData là object
        },
        templateData.thumbnailUrl instanceof File
          ? templateData.thumbnailUrl
          : null // Chỉ gửi file nếu có
      );

      console.log("Save Template", saveTemplate);

      // Gửi từng section để cập nhật
      for (const section of sections) {
        await updateSection({
          id: section.id,
          metadata: {
            components: section.components,
            style: section.style,
          },
        });
      }

      showSnackbar("Template updated successfully!", "success");
      setTimeout(() => navigate("/template"), 1000); // Chuyển hướng sau 1s
    } catch (error) {
      console.error("Error saving template:", error);
      showSnackbar(error.message || "Failed to save template!", "error");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  const handleStyleChange = (key, value) => {
    if (!activeItem) return;
    setActiveStyles((prev) => ({ ...prev, [key]: value }));
    setSections((prev) =>
      prev.map((section) =>
        section.id === activeItem.sectionId
          ? {
              ...section,
              components: section.components.map((component) =>
                component.id === activeItem.componentId
                  ? {
                      ...component,
                      style: { ...component.style, [key]: value },
                    }
                  : component
              ),
              style: { ...section.style, [key]: value },
            }
          : section
      )
    );
  };
  const [selectedItem, setSelectedItem] = useState(""); // State để lưu giá trị của dropdown

  const handleDropdownChange = (value) => {
    setSelectedItem(value); // Cập nhật giá trị khi dropdown thay đổi
    if (activeItem) {
      // Cập nhật ID của component hiện tại khi chọn một item
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === activeItem.sectionId
            ? {
                ...section,
                components: section.components.map((component) =>
                  component.id === activeItem.componentId
                    ? {
                        ...component,
                        id: `${component.id}-${value}`, // Thêm selectedItem vào ID của component
                      }
                    : component
                ),
              }
            : section
        )
      );
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    setScale((prevScale) => {
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(prevScale + delta, 0.5), 3);
    });
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = useCallback((event) => {
    if (!isPanning.current) return;
    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startPoint.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // const addSection = async () => {
  //   const newSection = {
  //     id: uuidv4(),
  //     position: String(sections.length + 1),
  //     components: [],
  //     style: {
  //       width: "100%",
  //       minWidth: "800px",
  //       height: "100%",
  //       padding: 2,
  //       position: "relative",
  //       marginBottom: 2,
  //       minHeight: "500px",
  //       backgroundColor: "#f9f9f9",
  //       transition: "border 0.3s ease",
  //     },
  //   };

  //   setSections((prevSections) => [...prevSections, newSection]);
  //   showSnackbar("New section added", "success");
  // };

  const handleComponentClick = (component) => {
    setActiveItem(component);
    setActiveStyles(component.style || {});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
        }}
      >
        <Headerv2
          sx={{
            position: "absolute !important",
            top: 0,
            zIndex: 1000,
          }}
        />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            overflow: "hidden",
            flexDirection: "row",
          }}
        >
          <LayerList sections={sections} onUpdateSections={setSections} />
          <Box
            id="canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              flex: 1,
              position: "relative",
              cursor: isPanning.current ? "grabbing" : "grab",
              backgroundColor: "#FCFCFC",
            }}
          >
            <Box
              sx={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isPanning.current
                  ? "none"
                  : "transform 0.2s ease-out",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{ width: "500px", height: "800px", position: "relative" }}
              >
                <Canvas
                  sections={sections}
                  setSections={setSections}
                  setActiveItem={handleComponentClick}
                  activeItem={activeItem}
                  setActiveStyles={setActiveStyles}
                />
              </Box>
            </Box>
          </Box>
          <Toolbar
            activeStyles={activeStyles}
            handleStyleChange={handleStyleChange}
            templateData={templateData}
            setTemplateData={setTemplateData}
            selectedItem={selectedItem}
            onDropdownChange={handleDropdownChange}
            subscriptionPlan={templateData.subscriptionPlan}
          />
        </Box>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            gap: "10px",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            Add Section
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleSaveTemplate}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="white" />
            ) : (
              "Save Template"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default EditTemplate;
