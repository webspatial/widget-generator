import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WeatherWidget from "./WeatherApp";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";
addWebSpatialClassFlagOnHtml();

// ignore ts lint error
(window as any).xrCurrentSceneDefaults = async () => {
  return {
    defaultSize: {
      width: 456,
      height: 438,
    },
    resizability: "contentSize",
  };
};

// parse query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const city = urlParams.get("city") ?? "beijing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WeatherWidget city={city} />
  </StrictMode>
);
