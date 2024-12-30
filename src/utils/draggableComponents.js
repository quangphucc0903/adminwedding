import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDrag } from "react-dnd";

// Common style for all draggable shapes
const commonStyle = {
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "10px",
  border: "2px solid black",
};

// Text Box
export const TextBox = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "text" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        border: "2px dashed black", // Dashed border
      }}
    >
      <Typography variant="caption">Text</Typography>
    </Box>
  );
};

// Image Box
export const ImageBox = ({ imageUrl }) => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "image" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        backgroundImage: `url(${imageUrl})`, // Placeholder image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f0f0",
      }}
    />
  );
};

// Shapes
export const Rectangle = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "rect" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        height: "25px", // Adjust height for rectangle
      }}
    />
  );
};

export const Circle = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "circle" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        borderRadius: "50%",
      }}
    />
  );
};

export const Diamond = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "diamond" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        transform: "rotate(45deg)", // Rotated square for diamond
      }}
    />
  );
};

export const Line = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "line" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        height: "5px", // Thin line
        border: "none",
        backgroundColor: "black",
      }}
    />
  );
};

export const Arrow = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "arrow" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        position: "relative",
        width: "50px",
        height: "10px",
        backgroundColor: "black",
        marginBottom: "10px",
        "&::after": {
          content: '""',
          position: "absolute",
          top: "0",
          right: "-10px",
          width: "0",
          height: "0",
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "10px solid black",
        },
      }}
    />
  );
};

// Additional Shapes
export const Triangle = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "triangle" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        width: "0",
        height: "0",
        borderLeft: "25px solid transparent",
        borderRight: "25px solid transparent",
        borderBottom: "50px solid black",
        border: "none",
      }}
    />
  );
};

export const Hexagon = () => {
  const [, dragRef] = useDrag(() => ({
    type: "component",
    item: { type: "hexagon" },
  }));

  return (
    <Box
      ref={dragRef}
      sx={{
        ...commonStyle,
        width: "auto",
        height: "auto",
        clipPath:
          "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        backgroundColor: "white",
      }}
    />
  );
};

// You can define 13 more shapes similarly with unique properties for your use case.
