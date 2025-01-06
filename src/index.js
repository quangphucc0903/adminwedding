import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadFonts } from "./utils/fonts";

// loadFonts();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();
