import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WeatherWidget from "./WeatherApp";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";
addWebSpatialClassFlagOnHtml();

// parse query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const city = urlParams.get("city") ?? "beijing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WeatherWidget city={city} />
  </StrictMode>
);
