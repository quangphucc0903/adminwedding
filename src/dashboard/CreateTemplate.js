import React, { useState, useRef, useCallback } from "react";
import { Box, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";
import { createTemplate, createSection } from "../service/templateService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Headerv2 from "./template-components/Headerv2";
import LayerList from "./template-components/LayerList";
import "../css/font.css";

const CreateTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [sectionCount, setSectionCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // State loading
  const navigate = useNavigate(); // Initialize useNavigate
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
              components: section.components.map((component) => {
                // Kiểm tra ID và xử lý
                let updatedId = component.id;

                // Đảm bảo updatedId là chuỗi
                if (typeof updatedId !== 'string') {
                  updatedId = String(updatedId); // Nếu không phải chuỗi, chuyển thành chuỗi
                }

                // Kiểm tra nếu ID không bắt đầu bằng số, xóa các ký tự trước số
                if (isNaN(parseInt(updatedId[0]))) {
                  updatedId = updatedId.replace(/^[^\d]*/, ''); // Xóa tất cả ký tự không phải số phía trước
                }

                // Thêm selectedItem vào ID của component
                updatedId = `${updatedId}-${value}`;

                return component.id === activeItem.componentId
                  ? {
                    ...component,
                    id: updatedId,
                  }
                  : component;
              }),
            }
            : section
        )
      );
    }
  };

  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSaveSections = async () => {
    setIsLoading(true); // Bật loading
    try {
      // Đánh lại vị trí (position) dưới dạng chuỗi
      const updatedSections = sections.map((section, index) => ({
        ...section,
        position: String(index + 1), // Chuyển đổi position thành chuỗi
      }));

      setSections(updatedSections);

      // Tạo template
      const savedTemplate = await createTemplate(
        templateData,
        templateData.thumbnailUrl
      );
      const templateID = savedTemplate.data?.id;

      if (!templateID) {
        throw new Error("Không thể lấy được templateId!");
      }

      // Chuẩn bị dữ liệu sections với `position` dưới dạng chuỗi
      const sectionsWithMetadata = updatedSections.map((section) => ({
        templateId: templateID,
        responsive: section.responsive,
        position: section.position, // Sử dụng chuỗi cho position
        metadata: {
          components: section.components,
          style: section.style,
        },
      }));

      console.log("Sections sẽ được lưu:", sectionsWithMetadata);

      // Lưu từng section
      for (const section of sectionsWithMetadata) {
        await createSection(section);
      }

      showSnackbar("Lưu template và sections thành công!", "success");
      setTimeout(() => navigate("/template"), 1000); // Chuyển hướng sau 1s
    } catch (error) {
      showSnackbar(error.message || "Lưu thất bại!", "error");
    } finally {
      setIsLoading(false); // Tắt loading
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
            }
          : section
      )
    );
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

  const addSection = () => {
    const newSection = {
      id: `${Date.now()}`,
      position: String(sections.length + 1), // Gán position dưới dạng chuỗi
      components: [],
      style: {
        width: "100%",
        minWidth: "500px",
        height: "100%",
        padding: 0,
        position: "relative",
        marginBottom: 2,
        minHeight: "800px",
        backgroundColor: "#f9f9f9",
        transition: "border 0.3s ease",
      },
      responsive: "", // Thêm field responsive
    };

    setSections((prevSections) => [...prevSections, newSection]);

    showSnackbar("New section added", "success");
  };

  const handleCanvasClick = (event) => {
    if (event.target.id === "canvas") {
      setActiveItem(null);
      setActiveStyles({});
    }
  };

  const handleComponentClick = (component) => {
    setActiveItem(component);
    setActiveStyles(component.style || {});
  };

  const handleSelectLayer = (layerId) => {
    const selectedSection = sections.find((section) => section.id === layerId);
    if (selectedSection) {
      setActiveItem(null); // Hoặc cập nhật activeItem nếu cần
      setActiveStyles(selectedSection.style || {});
    }
  };
  const handleReorderSections = (newSections) => {
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      position: String(index + 1), // Đánh lại position dưới dạng chuỗi
    }));

    setSections(updatedSections); // Cập nhật danh sách sections
  };

  const handleUpdateSections = (updatedSections) => {
    setSections(updatedSections);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
        }}
        onClick={handleCanvasClick}
      >
        {/* <Box
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "#FCFCFC",
            boxSizing: "border-box",
          }}
        >
          <Headerv2 />
        </Box> */}
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
          <LayerList
            sections={sections}
            onSelectLayer={handleSelectLayer}
            onReorderSections={handleReorderSections}
            onUpdateSections={handleUpdateSections}
          />

          {/* Main Canvas */}
          <Box
            id="canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              flex: 1,
              backgroundColor: "#FCFCFC",
              cursor: isPanning.current ? "grabbing" : "grab",
              position: "relative",
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
                  selectedItem={selectedItem}
                />
              </Box>
            </Box>
          </Box>

          {/* Toolbar nằm bên phải */}
          <Toolbar
            activeStyles={activeStyles}
            handleStyleChange={handleStyleChange}
            templateData={templateData}
            setTemplateData={setTemplateData}
            selectedItem={selectedItem}
            onDropdownChange={handleDropdownChange}
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
          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSections}
            disabled={isLoading}
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

export default CreateTemplate;
