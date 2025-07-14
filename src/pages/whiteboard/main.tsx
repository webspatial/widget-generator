import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";

addWebSpatialClassFlagOnHtml();

(window as any).xrCurrentSceneDefaults = async () => {
  return {
    defaultSize: {
      width: 700,
      height: 600,
    },
    resizability: "contentSize",
  };
};

createRoot(document.getElementById("root")!).render(
    <App />
);
