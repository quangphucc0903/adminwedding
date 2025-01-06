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
  isViewMode,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        // padding: 2,
        minHeight: "80vh",
        backgroundColor: "#fff",
      }}
    >
      {sections.map((section, index) => (
        <Section
          key={section.id}
          section={section}
          index={index}
          setSections={setSections}
          sections={sections} // Thêm dòng này
          setActiveItem={setActiveItem}
          activeItem={activeItem}
          setActiveStyles={setActiveStyles}
          selectedItem={selectedItem}
          isViewMode={isViewMode}
        />
      ))}
    </Box>
  );
};

export default Canvas;
