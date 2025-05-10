"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

// Define state machine states
type TimerState = "idle" | "playing" | "paused" | "finished";

// Define component props
interface TimerAppProps {
  initialSeconds?: number;
  autoStart?: boolean;
}

export default function TimerApp({
  initialSeconds = 60,
  autoStart = true,
}: TimerAppProps) {
  // State management
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [timerState, setTimerState] = useState<TimerState>(
    autoStart ? "playing" : "idle"
  );
  const [isMuted, setIsMuted] = useState(false);

  // Update state when initialSeconds changes
  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  // Calculate progress percentage
  const progress = (remainingSeconds / totalSeconds) * 100;

  // Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      // 超过1小时，显示为 HH:MM:SS
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      // 少于1小时，显示为 MM:SS
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === "playing" && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Play sound when timer ends
            if (!isMuted && audioRef.current) {
              audioRef.current.play();
            }
            clearInterval(interval!);
            setTimerState("finished"); // 转换到finished状态
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, remainingSeconds, isMuted]);

  // State transition handler
  const handleStateTransition = (action: string) => {
    switch (timerState) {
      case "idle":
        if (action === "play") {
          setTimerState("playing");
        }
        break;
      case "playing":
        if (action === "pause") {
          setTimerState("paused");
        } else if (action === "reset") {
          setRemainingSeconds(totalSeconds);
          setTimerState("idle");
        }
        break;
      case "paused":
        if (action === "play") {
          setTimerState("playing");
        } else if (action === "reset") {
          setRemainingSeconds(totalSeconds);
          setTimerState("idle");
        }
        break;
      case "finished":
        if (action === "stop") {
          setRemainingSeconds(totalSeconds);
          setTimerState("idle");
        }
        break;
    }
  };

  // Toggle sound state
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Get progress bar color based on current state
  const getProgressColor = () => {
    return timerState === "finished" ? "#ff3838" : "#66e616";
  };

  // Get progress bar offset based on current state
  const getProgressOffset = () => {
    // Circle circumference is 2πr = 2 * π * 46 ≈ 289.03
    const circumference = 289.03;

    if (timerState === "finished") return 0; // Show complete circle when finished
    if (timerState === "idle") return 0; // Show complete circle in idle state

    // Calculate elapsed percentage
    const elapsedPercentage = 100 - progress;

    // Calculate the portion that should be hidden based on elapsed time
    // Use negative value to make it decrease in clockwise direction
    return -circumference * (elapsedPercentage / 100);
  };

  // Render control buttons based on current state
  const renderControlButtons = () => {
    switch (timerState) {
      case "idle":
        return (
          <button
            onClick={() => handleStateTransition("play")}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
          >
            <PlayIcon className="w-5 h-5 text-white" />
          </button>
        );
      case "playing":
        return (
          <>
            <button
              onClick={() => handleStateTransition("reset")}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
            >
              <XIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleStateTransition("pause")}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
            >
              <PauseIcon className="w-5 h-5 text-white" />
            </button>
          </>
        );
      case "paused":
        return (
          <>
            <button
              onClick={() => handleStateTransition("reset")}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
            >
              <XIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleStateTransition("play")}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
            >
              <PlayIcon className="w-5 h-5 text-white" />
            </button>
          </>
        );
      case "finished":
        return (
          <button
            onClick={() => handleStateTransition("stop")}
            className="w-16 h-16 rounded-full bg-[#ff3838] flex items-center justify-center"
          >
            <StopIcon className="w-5 h-5 text-white" />
          </button>
        );
    }
  };

  // Get display time
  const getDisplayTime = () => {
    if (timerState === "finished") return "00:00";
    return formatTime(remainingSeconds);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-[402px] h-[456px]">
      <div className="relative w-full max-w-md aspect-square p-6 flex flex-col">
        {/* Top bar - total time and add button */}
        <div className="flex justify-between items-center">
          <div className="text-4xl font-bold text-white">
            {formatTime(totalSeconds)}
          </div>
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Timer circle */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Background circle */}
          <svg className="absolute w-[90%] h-[90%]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#444444"
              strokeOpacity="0.2"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Progress circle */}
          <svg className="absolute w-[90%] h-[90%]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="289.03"
              strokeDashoffset={getProgressOffset()}
              transform="rotate(-90 50 50)"
            />
          </svg>

          {/* Center time display */}
          <div className="flex flex-col items-center z-10 max-w-[50%]">
            <div
              className="text-white mb-6 font-bold tabular-nums text-center scale-90"
              style={{
                fontSize:
                  remainingSeconds >= 3600
                    ? "clamp(1.2rem, 4vw, 2.2rem)"
                    : "clamp(1.5rem, 5vw, 2.5rem)",
                lineHeight: 0.9,
                letterSpacing: "0.01em",
                maxWidth: "100%",
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            >
              {getDisplayTime()}
            </div>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <VolumeIcon className="w-5 h-5 text-white" muted={isMuted} />
            </button>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-center gap-8 mt-4">
          {renderControlButtons()}
        </div>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="/alarm.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

// Custom X icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Custom volume icon component
function VolumeIcon({
  className,
  muted,
}: {
  className?: string;
  muted?: boolean;
}) {
  if (muted) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M11 5L6 9H2V15H6L11 19V5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 9L17 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 9L23 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11 5L6 9H2V15H6L11 19V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Custom pause icon component
function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

// Custom play icon component
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 3L19 12L5 21V3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Custom stop icon component
function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="4" width="16" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}
