import React from "react";
import { Box } from "@mui/material";
import Section from "./Section";

const Canvas = ({
  sections,
  setSections,
  setActiveItem,
  setActiveStyles,
  activeItem,
  selectedItem,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 20px 60px 20px",
        minHeight: "100vh",
        backgroundColor: "#FCFCFC",
        overflow: "auto"
      }}
    >
      <Box
        sx={{
          width: "800px",
          height: "500px",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            setSections={setSections}
            sections={sections}
            setActiveItem={setActiveItem}
            activeItem={activeItem}
            setActiveStyles={setActiveStyles}
            selectedItem={selectedItem}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Canvas;