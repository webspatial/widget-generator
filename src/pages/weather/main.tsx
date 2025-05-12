import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WeatherWidget from "./WeatherApp";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";

addWebSpatialClassFlagOnHtml();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WeatherWidget />
  </StrictMode>
);
