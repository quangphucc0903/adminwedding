import React, { useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Slider,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import DropdownMenu from "./DropdownId";
import fonts from "../../utils/fonts";

const StyleInput = ({
  label,
  value,
  onChange,
  type,
  unit,
  min,
  max,
  options,
  step = 1,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
    <Box sx={{ width: "100%" }}>
      {type === "select" ? (
        <TextField
          select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      ) : type === "number" ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            fullWidth
            type="number"
            InputProps={{
              endAdornment: unit ? (
                <InputAdornment position="end">{unit}</InputAdornment>
              ) : null,
            }}
          />
          <Slider
            value={Number(value) || min}
            onChange={(e, newValue) => onChange(newValue)}
            min={min}
            max={max}
            step={step}
            sx={{ ml: 2, flexGrow: 1 }}
          />
        </Box>
      ) : (
        <TextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          type={type}
        />
      )}
    </Box>
  </Box>
);

const StyleEditor = ({
  activeStyles,
  handleStyleChange,
  selectedItem,
  onChange,
}) => {
  const loadFont = (url) => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  };

  // Load the font if a font family is selected
  useEffect(() => {
    if (activeStyles?.fontFamily) {
      const selectedFont = fontNames.find(
        (font) => font.family === activeStyles.fontFamily
      );
      if (selectedFont) {
        loadFont(selectedFont.url);
      }
    }
  }, [activeStyles?.fontFamily]);

  if (!activeStyles || Object.keys(activeStyles).length === 0) return null;

  const fontNames = [
    { family: "Montserrat", label: "Montserrat" },
    { family: "DancingScript", label: "Dancing Script" },
    { family: "GreatVibes", label: "Great Vibes" },
    { family: "AlexBrush", label: "Alex Brush" },
    { family: "PlayfairDisplay", label: "Playfair Display" },
    { family: "CormorantGaramond", label: "Cormorant Garamond" },
    { family: "Quicksand", label: "Quicksand" },
    { family: "PinyonScript", label: "Pinyon Script" },
    { family: "Charm", label: "Charm" },
    { family: "JosefinSans", label: "Josefin Sans" },
    { family: "Raleway", label: "Raleway" },
    { family: "Nunito", label: "Nunito" },
    { family: "Roboto", label: "Roboto" },
    { family: "Lora", label: "Lora" },
    { family: "SourceSerifPro", label: "Source Serif Pro" },
    { family: "Bellota", label: "Bellota" },
    { family: "Philosopher", label: "Philosopher" },
    { family: "AmaticSC", label: "Amatic SC" },
    { family: "CormorantInfant", label: "Cormorant Infant" },
    { family: "Bungee", label: "Bungee" },
    { family: "Pacifico", label: "Pacifico" },
  ];  

  return (
    <Box
      sx={{
        padding: 0.5,
        backgroundColor: "#f9f9f9",
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!activeStyles.fill}
              onChange={(e) => handleStyleChange("fill", e.target.checked)}
            />
          }
          label="Fill"
          sx={{ mb: 1 }}
        />
        {activeStyles.fill && (
          <StyleInput
            label="Fill Color"
            value={activeStyles.fillColor}
            onChange={(value) => handleStyleChange("fillColor", value)}
            type="color"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={!!activeStyles.gradient}
              onChange={(e) => handleStyleChange("gradient", e.target.checked)}
            />
          }
          label="Gradient"
          sx={{ mb: 1 }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Select Component ID
        </Typography>
        <DropdownMenu selectedItem={selectedItem} onChange={onChange} />

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Font Size
        </Typography>
        <StyleInput
          label="Font Size"
          value={activeStyles.fontSize}
          onChange={(value) => handleStyleChange("fontSize", value)}
          type="number"
          unit="px"
          min={0}
          max={100}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Font Family
        </Typography>
        <StyleInput
          label="Font Family"
          value={activeStyles.fontFamily}
          onChange={(value) => handleStyleChange("fontFamily", value)}
          type="select"
          options={fontNames?.map((font) => font?.family)}
        />

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Color
        </Typography>
        <StyleInput
          label="Color"
          value={activeStyles.color}
          onChange={(value) => handleStyleChange("color", value)}
          type="color"
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Width
        </Typography>
        <StyleInput
          label="Width"
          value={activeStyles.width}
          onChange={(value) => handleStyleChange("width", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Height
        </Typography>
        <StyleInput
          label="Height"
          value={activeStyles.height}
          onChange={(value) => handleStyleChange("height", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Line color
        </Typography>
        <StyleInput
          label="Line Color"
          value={activeStyles.lineColor}
          onChange={(value) => handleStyleChange("lineColor", value)}
          type="color"
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Line width
        </Typography>
        <StyleInput
          label="Line Width"
          value={activeStyles.lineWidth}
          onChange={(value) => handleStyleChange("lineWidth", value)}
          type="number"
          unit="pt"
          min={0}
          max={10}
        />

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Opacity
        </Typography>
        <StyleInput
          label="Opacity"
          value={activeStyles.opacity}
          onChange={(value) => handleStyleChange("opacity", value)}
          type="number"
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Border width
        </Typography>
        <StyleInput
          label="Border Width"
          value={activeStyles.borderWidth}
          onChange={(value) => handleStyleChange("borderWidth", value)}
          type="number"
          unit="px"
          min={0}
          max={20}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Border style
        </Typography>
        <StyleInput
          label="Border Style"
          value={activeStyles.borderStyle}
          onChange={(value) => handleStyleChange("borderStyle", value)}
          type="select"
          options={[
            "none",
            "solid",
            "dashed",
            "dotted",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
          ]}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Border color
        </Typography>
        <StyleInput
          label="Border Color"
          value={activeStyles.borderColor}
          onChange={(value) => handleStyleChange("borderColor", value)}
          type="color"
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 2 }}>
          Border radius
        </Typography>
        <StyleInput
          label="Border Radius"
          value={activeStyles.borderRadius}
          onChange={(value) => handleStyleChange("borderRadius", value)}
          type="number"
          unit="px"
          min={0}
          max={100}
        />
      </Box>
    </Box>
  );
};

export default StyleEditor;
