import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WidgetGenerator from "./WidgetGenerator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WidgetGenerator />
  </StrictMode>
);
