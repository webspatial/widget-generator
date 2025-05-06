import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TimerComponent } from "./TimerComponent";
// import { useState } from "react";

function App() {
  return <TimerComponent />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
