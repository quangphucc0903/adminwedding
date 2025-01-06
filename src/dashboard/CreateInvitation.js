import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "../dashboard/components/invitation/Canvas";
import Toolbar from "./components/invitation/ToolBar";
import Headerv2 from "../dashboard/components/invitation/Headerv2";
import { useNavigate, useParams } from "react-router-dom";
import LayerList from "../dashboard/components/invitation/LayerList";
import {
  createInvitation,
  getTemplateById,
  updateInvitation,
  uploadImages,
} from "../service/templateService";

const CreateInvitation = () => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState("");
  const navigate = useNavigate();
  const [invitationData, setInvitationData] = useState({
    title: "",
    templateId: id,
    metadata: {},
  });
  const [existingInvitation, setExistingInvitation] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

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

  const handleWheel = (event) => {
    event.preventDefault();
    setScale((prevScale) => {
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(prevScale + delta, 0.5), 3);
    });
  };
  const handleDropdownChange = (value) => {
    setSelectedItem(value);
    if (activeItem) {
      // Cập nhật ID của component hiện tại khi chọn một item
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === activeItem.sectionId
            ? {
                ...section,
                components: section.components.map((component) => {
                  if (component.id === activeItem.componentId) {
                    // Lấy ID hiện tại
                    let currentId = component.id;

                    // Xóa ký tự cuối cho đến khi gặp số
                    while (currentId && isNaN(Number(currentId.slice(-1)))) {
                      currentId = currentId.slice(0, -1);
                    }

                    // Thêm giá trị mới vào đuôi ID
                    const updatedId = `${currentId}-${value}`;

                    return { ...component, id: updatedId };
                  }
                  return component;
                }),
              }
            : section
        )
      );
    }
  };

  const fetchInvitationData = async () => {
    try {
      const response = await getTemplateById(id);
      console.log("Template data:", response?.data.invitation);
      if (response?.data) {
        const data = response.data;

        if (data.invitation) {
          setInvitationData({
            id: data.invitation.id, // Ensure ID is added here
            ...data.invitation,
            metadata: data.invitation.metadata || {},
          });

          const processedSections = processMetadataToSections(
            data.invitation.metadata
          );
          setSections(
            processedSections.length > 0
              ? processedSections
              : [createDefaultSection()]
          );
          setExistingInvitation(true);
        } else {
          initializeDefaultInvitation();
          showSnackbar(
            "No existing invitation found. Default section created.",
            "info"
          );
        }
      } else {
        initializeDefaultInvitation();
        showSnackbar(
          "No template data found. Default section created.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error fetching invitation data:", error);
      initializeDefaultInvitation();
      showSnackbar(
        "Error loading invitation data. Default section created.",
        "error"
      );
    }
  };

  // Function to initialize default invitation and section
  const initializeDefaultInvitation = () => {
    setInvitationData({
      id: "",
      title: "",
      templateId: id,
      metadata: {},
    });
    setSections([createDefaultSection()]);
    setExistingInvitation(false);
  };

  // Function to create a default section
  const createDefaultSection = () => ({
    id: `section-${Date.now()}`,
    position: "1",
    components: [],
    style: {
      minWidth: "500px",
      minHeight: "800px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      position: "relative",
    },
  });

  useEffect(() => {
    fetchInvitationData();
  }, [id]);

  const processMetadataToSections = (metadata) => {
    const styles = metadata?.style || [];
    const components = metadata?.components || [];
    return styles.map((styleItem, index) => ({
      id: `section-${index}`,
      style: {
        ...styleItem, // Ghi đè style từ metadata
      },
      components: components[index] || [],
    }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveInvitation = async () => {
    try {
      const metadata = {
        components: sections.map((section) => section.components),
        style: sections.map((section) => section.style),
      };

      // Loại bỏ các trường không cần thiết
      const { id, createdAt, updatedAt, ...filteredInvitationData } =
        invitationData;

      const dataToSave = { ...filteredInvitationData, metadata };

      console.log("Saving invitation data:", dataToSave);

      if (existingInvitation) {
        // Update existing invitation
        const updatedInvitation = await updateInvitation({ ...dataToSave, id });
        console.log("Invitation updated successfully:", updatedInvitation);
        showSnackbar("Invitation updated successfully!", "success");
      } else {
        // Create new invitation
        const savedInvitation = await createInvitation(dataToSave);
        console.log("Invitation created successfully:", savedInvitation);
        showSnackbar("Invitation created successfully!", "success");
        setExistingInvitation(true);
        navigate(`/template`);
      }
    } catch (error) {
      console.error("Error saving invitation:", error);
      showSnackbar("Failed to save invitation!", "error");
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Gọi API để tải ảnh lên
        const response = await uploadImages(file);

        // Kiểm tra phản hồi từ API
        if (response?.data?.url) {
          const uploadedImageUrl = response.data.url;

          // Cập nhật src cho activeItem
          setActiveItem((prev) => {
            if (!prev) {
              console.error("No active item to update!");
              return prev;
            }

            // Cập nhật `src` trong activeItem
            const updatedItem = { ...prev, src: uploadedImageUrl };

            // Cập nhật lại sections với item đã sửa đổi
            setSections((prevSections) =>
              prevSections.map((section) =>
                section.id === updatedItem.sectionId
                  ? {
                      ...section,
                      components: section.components.map((comp) =>
                        comp.id === updatedItem.id ? updatedItem : comp
                      ),
                    }
                  : section
              )
            );

            console.log(
              "Image uploaded and active item updated:",
              uploadedImageUrl
            );
            return updatedItem;
          });

          // Hiển thị thông báo thành công
          showSnackbar("Image uploaded successfully!", "success");
        } else {
          console.error("Image upload failed: No URL in response");
          showSnackbar("Image upload failed: No URL in response", "error");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        showSnackbar("Error uploading image", "error");
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",   
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
            overflow: "hidden",
            flexDirection: "row",
          }}
        >
          <LayerList sections={sections} onUpdateSections={setSections} />
          <Box
            id="canvas"
            sx={{
              flex: 1,
              backgroundColor: "#FCFCFC",
              cursor: isPanning.current ? "grabbing" : "grab",
              position: "relative",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Box
              sx={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isPanning.current
                  ? "none"
                  : "transform 0.2s ease-out",
              }}
            >
              <Canvas
                sections={sections}
                setSections={setSections}
                setActiveItem={setActiveItem}
                activeItem={activeItem}
                setActiveStyles={setActiveStyles}
              />
            </Box>
          </Box>

          <Toolbar
            activeStyles={activeStyles}
            handleStyleChange={handleStyleChange}
            invitationData={invitationData}
            setInvitationData={setInvitationData}
            updateSections={setSections}
            selectedComponent={activeItem}
            handleTextChange={(value) => {
              setActiveItem((prev) => ({ ...prev, text: value }));
            }}
            handleFileUpload={handleFileUpload}
            onDropdownChange={handleDropdownChange}
          />
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveInvitation}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            Save Invitation
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
export default CreateInvitation;
