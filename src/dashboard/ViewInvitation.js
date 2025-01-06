import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import { getTemplateById } from "../service/templateService";
import Headerv2 from "./template-components/Headerv2";

const ViewInvitation = () => {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [sections, setSections] = useState([]);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await getTemplateById(id);
        const data = response.data;
        if (data.invitation) {
          setInvitation(data.invitation);
          const processedSections = processMetadataToSections(
            data.invitation.metadata
          );
          setSections(processedSections);
        } else if (data.section_user && data.section_user.length > 0) {
          const processedSections = processSectionUserToSections(
            data.section_user
          );
          setSections(processedSections);
        } else {
          showSnackbar("Không tìm thấy lời mời hoặc dữ liệu!", "info");
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
        showSnackbar("Lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [id]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
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

  const handleMouseMove = (event) => {
    if (!isPanning.current) return;
    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#FCFCFC",
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 700px)": {
            marginTop: "60px",
            height: "auto",
            flexDirection: "column",
          },
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
            "@media (max-width: 700px)": {
              flexDirection: "column",
              overflow: "auto",
            },
          }}
        >
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
              "@media (max-width: 700px)": {
                overflow: "auto",
              },
            }}
          >
            <Box
              sx={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "top left",
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
                sx={{
                  width: "var(--canvas-width, 500px)",
                  height: "800px",
                  position: "relative",
                  "@media (max-width: 700px)": {
                    width: "100%",
                    height: "auto",
                  },
                }}
              >
                <Canvas sections={sections} isViewMode={true} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

const processMetadataToSections = (metadata) => {
  const styles = metadata?.style || [];
  const components = metadata?.components || [];

  return styles.map((styleItem, index) => ({
    id: `section-${index}`,
    style: styleItem,
    components: components[index] || [],
  }));
};

const processSectionUserToSections = (sectionUsers) => {
  return sectionUsers.map((sectionUser, index) => ({
    id: sectionUser.id || `section-${index}`,
    style: sectionUser.metadata?.style || {},
    components: sectionUser.metadata?.components || [],
  }));
};

export default ViewInvitation;
