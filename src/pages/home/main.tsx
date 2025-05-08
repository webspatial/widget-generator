import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WidgetGenerator from "./WidgetGenerator";
import "./main.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WidgetGenerator />
  </StrictMode>
);
