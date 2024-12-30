import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplateById } from "../service/templateService"; // Your service function

const ViewTemplate = () => {
  const { templateId } = useParams(); // Get templateId from URL
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplateById(templateId);
        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleBack = () => {
    navigate("/template"); // Navigate back to the template management page
  };

  // Function to render components dynamically based on metadata
  const renderComponent = (component) => {
    switch (component.type) {
      case "text":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              fontSize: component.style.fontSize,
              fontFamily: component.style.fontFamily,
              width: component.style.width,
              height: component.style.height,
              color: component.style.color,
              backgroundColor: component.style.fillColor,
              "@media (max-width: 700px)": {
                fontSize: "14px",
                width: "90%",
                left: "5%",
              },
            }}
          >
            <Typography variant={component.style.fontSize}>
              {component.text || "No text provided"}
            </Typography>
          </Box>
        );
      case "circle":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              borderRadius: "50%",
              backgroundColor: component.style.fillColor,
              opacity: component.style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                width: "60%",
                height: "auto",
                left: "20%",
              },
            }}
          >
            <img
              src={component.src}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
        );
      case "rect":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              backgroundColor: component.style.fillColor || "#ccc",
              borderRadius: component.style.borderRadius || "0%",
              opacity: component.style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                width: "90%",
                left: "5%",
              },
            }}
          />
        );
      case "image":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              overflow: "hidden",
              borderRadius: component.style.borderRadius || "0%",
              opacity: component.style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                width: "100%",
                height: "auto",
              },
            }}
          >
            <img
              src={component.src}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        );
      case "line":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height || 5,
              backgroundColor: component.style.lineColor,
              opacity: component.style.opacity / 100 || 1,
              "@media (max-width: 700px)": {
                width: "90%",
                left: "5%",
              },
            }}
          />
        );
      default:
        return null;
    }
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
        <Typography variant="h6">Loading template...</Typography>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Template not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 2,
        "@media (max-width: 700px)": {
          padding: 1,
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          "@media (max-width: 700px)": {
            fontSize: "20px",
          },
        }}
      >
        View Template: {template.name || "Untitled"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            {template.description || "No description provided."}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Sections</Typography>
          {template.sections && template.sections.length > 0 ? (
            [...template.sections]
              .sort((a, b) => parseInt(a.position) - parseInt(b.position))
              .map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    position: section.metadata?.style.position,
                    border: section.metadata?.style.border,
                    padding: section.metadata?.style.padding,
                    minHeight: section.metadata?.style.minHeight,
                    marginBottom: section.metadata?.style.marginBottom,
                    width: section.metadata?.style.minWidth,
                    backgroundColor: section.metadata?.style.backgroundColor,
                    "@media (max-width: 700px)": {
                      padding: "10px",
                      width: "100%",
                      height: "auto",
                      marginBottom: "10px",
                    },
                  }}
                >
                  {/* Render the components inside the section */}
                  {section.metadata?.components?.map(renderComponent)}
                </Box>
              ))
          ) : (
            <Typography>No sections available.</Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{
            "@media (max-width: 700px)": {
              width: "100%",
            },
          }}
        >
          Back to Template Management
        </Button>
      </Box>
    </Box>
  );
};

export default ViewTemplate;
