import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Headerv2 from "./template-components/Headerv2";
import { getTemplateById } from "../service/templateService";
import { useParams } from "react-router-dom";

const ViewTemplate = () => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
  });

  const fetchTemplateData = async () => {
    try {
      const template = await getTemplateById(id);
      setTemplateData(template.data);
      setSections(
        template.data.sections
          .map((section) => ({
            ...section,
            components: section.metadata?.components || [],
            style: section.metadata?.style || {},
          }))
          .sort((a, b) => parseInt(a.position) - parseInt(b.position))
      );
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  };

  const updateScale = () => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      const { offsetWidth, offsetHeight } = canvas;
      const scaleWidth = window.innerWidth / offsetWidth;
      const scaleHeight = window.innerHeight / offsetHeight;
      setScale(Math.min(scaleWidth, scaleHeight));
    }
  };

  useEffect(() => {
    fetchTemplateData();
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [id]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
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
        {isLoading && (
          <CircularProgress
            sx={{ position: "absolute", top: "50%", left: "50%" }}
          />
        )}
        <Snackbar open={false} autoHideDuration={3000} onClose={() => {}}>
          <Alert severity="error">Error loading template!</Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

export default ViewTemplate;
