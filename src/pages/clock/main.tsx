import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TimerComponent } from "./TimerComponent";
import "./main.css";

// parse query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const hours = parseInt(urlParams.get("hours") ?? "0");
const minutes = parseInt(urlParams.get("minutes") ?? "0");
const seconds = parseInt(urlParams.get("seconds") ?? "0");

console.log(hours, minutes, seconds);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimerComponent hours={hours} minutes={minutes} seconds={seconds} />
  </StrictMode>
);
