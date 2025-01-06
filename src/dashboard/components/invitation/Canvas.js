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
        // padding: 2,
        width: "fit-content",
        height: "fit-content",
        backgroundColor: "#fff",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          width: "500px",
          height: "800px",
          backgroundColor: "#fff",
          margin: "auto",
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
