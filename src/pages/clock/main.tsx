import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TimerApp from "./TimerApp";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";

addWebSpatialClassFlagOnHtml();

// parse query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const hours = parseInt(urlParams.get("hours") ?? "0");
const minutes = parseInt(urlParams.get("minutes") ?? "0");
const seconds = parseInt(urlParams.get("seconds") ?? "0");

// ignore ts lint error
(window as any).xrCurrentSceneDefaults = async () => {
  return {
    defaultSize: {
      width: 402,
      height: 456,
    },
    resizability: "contentSize",
  };
};

// make hours, minutes, seconds to be 0-59
const initialSeconds = hours * 3600 + minutes * 60 + seconds;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimerApp initialSeconds={10} />
  </StrictMode>
);
