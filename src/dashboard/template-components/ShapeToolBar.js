import React from "react";
import { ButtonGroup, IconButton } from "@mui/material";
import {
  Rectangle,
  Circle,
  ChangeHistory, // Tam giác
  TextFields,
  ArrowForward,
} from "@mui/icons-material";

function ShapeToolbar({ onAddShape }) {
  // Function to handle adding a new shape
  const handleAddShape = (shapeType) => {
    const newShape = {
      id: Date.now().toString(), // Unique ID
      type: shapeType,
      style: {
        position: "absolute",
        top: Math.random() * 200 + 50, // Random y position
        left: Math.random() * 300 + 50, // Random x position
        width: 100,
        height: 100,
        backgroundColor: "#ccc",
        borderRadius: shapeType === "circle" ? "50%" : "0",
        clipPath:
          shapeType === "triangle"
            ? "polygon(50% 0%, 0% 100%, 100% 100%)"
            : "none",
      },
    };
    onAddShape(newShape); // Call the parent function to add the shape
  };

  return (
    <div style={{ padding: "10px" }}>
      <ButtonGroup orientation="vertical" variant="contained" color="primary">
        <IconButton
          aria-label="Rectangle"
          style={{ fontSize: 30 }}
          onClick={() => handleAddShape("rectangle")}
        >
          <Rectangle />
        </IconButton>
        <IconButton
          aria-label="Circle"
          style={{ fontSize: 30 }}
          onClick={() => handleAddShape("circle")}
        >
          <Circle />
        </IconButton>
        <IconButton
          aria-label="Triangle"
          style={{ fontSize: 30 }}
          onClick={() => handleAddShape("triangle")}
        >
          <ChangeHistory />
        </IconButton>
        <IconButton
          aria-label="Text"
          style={{ fontSize: 30 }}
          onClick={() => handleAddShape("text")}
        >
          <TextFields />
        </IconButton>
        <IconButton
          aria-label="Arrow"
          style={{ fontSize: 30 }}
          onClick={() => handleAddShape("arrow")}
        >
          <ArrowForward />
        </IconButton>
      </ButtonGroup>
    </div>
  );
}

export default ShapeToolbar;
