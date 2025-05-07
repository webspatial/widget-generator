import { useState } from "react";
import { Clock, RefreshCw, Maximize } from "lucide-react";
import { AppType, gAppManager } from "./app-manager";

export function TimerPage() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("15");
  const [seconds, setSeconds] = useState("00");

  const handleStart = () => {
    gAppManager.createApp(AppType.Clock, { hours, minutes, seconds });
  };

  const handleReset = () => {};

  const adjustTime = (
    unit: "hours" | "minutes" | "seconds",
    increment: boolean
  ) => {
    let hrs = Number.parseInt(hours);
    let mins = Number.parseInt(minutes);
    let secs = Number.parseInt(seconds);

    if (unit === "hours") {
      hrs = increment ? (hrs + 1) % 100 : (hrs - 1 + 100) % 100;
    } else if (unit === "minutes") {
      mins = increment ? (mins + 1) % 60 : (mins - 1 + 60) % 60;
    } else {
      secs = increment ? (secs + 1) % 60 : (secs - 1 + 60) % 60;
    }

    setHours(hrs.toString().padStart(2, "0"));
    setMinutes(mins.toString().padStart(2, "0"));
    setSeconds(secs.toString().padStart(2, "0"));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#d9d9d9]">
      <div className="relative flex">
        {/* Left sidebar */}
        <div className="flex flex-col items-center gap-10 p-6 mr-4 rounded-full bg-[#d9d9d9] shadow-inner">
          <button className="p-4 rounded-full bg-[#d9d9d9] shadow">
            <Clock className="w-6 h-6 text-white" />
          </button>
          <button className="p-4 rounded-full bg-[#d9d9d9] shadow">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M15 3H21V9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21H3V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21L13 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="p-4 rounded-full bg-[#d9d9d9] shadow"
            onClick={handleReset}
          >
            <RefreshCw className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main timer container */}
        <div className="relative flex flex-col items-center w-[500px] h-[600px] p-8 rounded-[40px] bg-[#d9d9d9] shadow">
          {/* Header */}
          <div className="flex justify-between w-full mb-20">
            <h1 className="text-4xl font-bold text-white">Timer</h1>
            <button className="p-4 rounded-full bg-[#d9d9d9] shadow">
              <Maximize className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Timer display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("hours", true)}
                >
                  ▲
                </button>
              </div>
              <div className="text-7xl font-bold text-white">{hours}</div>
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("hours", false)}
                >
                  ▼
                </button>
              </div>
              <div className="mt-2 text-lg text-white">Hours</div>
            </div>

            <div className="text-6xl font-bold text-white">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("minutes", true)}
                >
                  ▲
                </button>
              </div>
              <div className="text-7xl font-bold text-white">{minutes}</div>
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("minutes", false)}
                >
                  ▼
                </button>
              </div>
              <div className="mt-2 text-lg text-white">Minutes</div>
            </div>

            <div className="text-6xl font-bold text-white">:</div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("seconds", true)}
                >
                  ▲
                </button>
              </div>
              <div className="text-7xl font-bold text-white">{seconds}</div>
              <div className="flex items-center">
                <button
                  className="text-white opacity-50"
                  onClick={() => adjustTime("seconds", false)}
                >
                  ▼
                </button>
              </div>
              <div className="mt-2 text-lg text-white">Seconds</div>
            </div>
          </div>

          {/* Start button */}
          <div className="absolute bottom-12 w-full flex justify-center">
            <button
              onClick={handleStart}
              className="px-16 py-4 text-2xl font-bold text-black bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
