import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WidgetGenerator from "./WidgetGenerator";
import "./main.css";
import { addWebSpatialClassFlagOnHtml } from "@/lib/detect-env";
import { AppType } from "../../lib/app-manager";
import { enableDebugTool } from '@webspatial/react-sdk'
import { DialogProvider } from "./Dialog";

enableDebugTool()

addWebSpatialClassFlagOnHtml();

// parse query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const from = (urlParams.get("from") as AppType) ?? AppType.Clock;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <WidgetGenerator from={from} />
    </DialogProvider>


  </StrictMode>
);
