import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppType, gAppManager } from "../../lib/app-manager";

export default function Timer() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("01");
  const [seconds, setSeconds] = useState("00");

  const incrementTime = (type: "hours" | "minutes" | "seconds") => {
    if (type === "hours") {
      const newHours = (Number.parseInt(hours) + 1) % 24;
      setHours(newHours.toString().padStart(2, "0"));
    } else if (type === "minutes") {
      const newMinutes = (Number.parseInt(minutes) + 1) % 60;
      setMinutes(newMinutes.toString().padStart(2, "0"));
    } else {
      const newSeconds = (Number.parseInt(seconds) + 1) % 60;
      setSeconds(newSeconds.toString().padStart(2, "0"));
    }
  };

  const decrementTime = (type: "hours" | "minutes" | "seconds") => {
    if (type === "hours") {
      const newHours = (Number.parseInt(hours) - 1 + 24) % 24;
      setHours(newHours.toString().padStart(2, "0"));
    } else if (type === "minutes") {
      const newMinutes = (Number.parseInt(minutes) - 1 + 60) % 60;
      setMinutes(newMinutes.toString().padStart(2, "0"));
    } else {
      const newSeconds = (Number.parseInt(seconds) - 1 + 60) % 60;
      setSeconds(newSeconds.toString().padStart(2, "0"));
    }
  };

  const handleStart = () => {
    gAppManager.createApp(AppType.Clock, { hours, minutes, seconds });

    console.log(
      "Start button clicked with time:",
      `${hours}:${minutes}:${seconds}`
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[29px] h-[92px] leading-[92px] font-bold text-white mb-16">Timer</h1>

      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => incrementTime("hours")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronUp className="h-8 w-8" />
          </button>
          <div className="text-white text-6xl font-bold tabular-nums w-[80px] text-center">
            {hours}
          </div>
          <button
            onClick={() => decrementTime("hours")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
          <span className="text-white text-sm mt-1">hours</span>
        </div>

        <div className="text-white text-6xl font-bold mb-6">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => incrementTime("minutes")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronUp className="h-8 w-8" />
          </button>
          <div className="text-white text-6xl font-bold tabular-nums w-[80px] text-center">
            {minutes}
          </div>
          <button
            onClick={() => decrementTime("minutes")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
          <span className="text-white text-sm mt-1">minutes</span>
        </div>

        <div className="text-white text-6xl font-bold mb-6">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => incrementTime("seconds")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronUp className="h-8 w-8" />
          </button>
          <div className="text-white text-6xl font-bold tabular-nums w-[80px] text-center">
            {seconds}
          </div>
          <button
            onClick={() => decrementTime("seconds")}
            className="text-white opacity-50 hover:opacity-100"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
          <span className="text-white text-sm mt-1">seconds</span>
        </div>
      </div>

      <div className="flex-1"></div>
      <div className="w-full flex justify-center mb-8">
        <Button
          onClick={handleStart}
          className="bg-white text-black hover:bg-white/90 rounded-full w-[200px] h-[60px] text-xl font-medium"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
