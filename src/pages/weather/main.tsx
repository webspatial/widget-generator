import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div> this is a weather page </div>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
