import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

function App() {
  return <CalendarDemo />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
