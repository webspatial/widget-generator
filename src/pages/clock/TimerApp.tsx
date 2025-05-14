"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { AppType, gAppManager } from "../../lib/app-manager";

// Define state machine states
type TimerState = "idle" | "playing" | "paused" | "finished";

// Component props interface
interface TimerAppProps {
  initialSeconds?: number;
}

export default function TimerApp({ initialSeconds = 60 }: TimerAppProps) {
  // State management
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds); // Initialize with props
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds); // Initialize with props
  const [timerState, setTimerState] = useState<TimerState>("idle"); // Initial state is playing
  const [isMuted, setIsMuted] = useState(false);

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
      // For more than 1 hour, display as HH:MM:SS
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      // For less than 1 hour, display as MM:SS
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
              audioRef.current.muted = isMuted;
              audioRef.current.play();
            }
            clearInterval(interval!);
            setTimerState("finished"); // Transition to finished state
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

  // Handle initialSeconds changes
  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

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

  useEffect(() => {
    if ( audioRef.current && audioRef.current.played) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if ( timerState !== 'finished' && audioRef.current && audioRef.current.played) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [timerState]);

  // Get progress bar color based on current state
  const getProgressColor = () => {
    return timerState === "finished" ? "#ff3838" : "#66e616";
  };

  // Get progress bar offset based on current state - corrected logic
  const getProgressOffset = () => {
    // Circle circumference is 2πr = 2 * π * 46 ≈ 289.03
    const circumference = 289.03;

    if (timerState === "finished") return 0; // Show complete circle when finished
    if (timerState === "idle") return 0; // Show complete circle in idle state

    // Calculate elapsed percentage
    const elapsedPercentage = 100 - progress;
    return circumference * (elapsedPercentage / 100);
  };

  // Render control buttons based on current state
  const renderControlButtons = () => {
    switch (timerState) {
      case "idle":
        return (
          <button
            onClick={() => handleStateTransition("play")}
            className="w-[64px] h-[64px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
          >
            <PlayIcon className="w-8 h-8 text-white" />
          </button>
        );
      case "playing":
        return (
          <>
            <button
              onClick={() => handleStateTransition("reset")}
              className="w-[64px] h-[64px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
            >
              <XIcon className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => handleStateTransition("pause")}
              className="w-[64px] h-[64px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
            >
              <PauseIcon className="w-8 h-8 text-white" />
            </button>
          </>
        );
      case "paused":
        return (
          <>
            <button
              onClick={() => handleStateTransition("reset")}
              className="w-[64px] h-[64px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
            >
              <XIcon className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => handleStateTransition("play")}
              className="w-[64px] h-[64px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
            >
              <PlayIcon className="w-8 h-8 text-white" />
            </button>
          </>
        );
      case "finished":
        return (
          <button
            onClick={() => handleStateTransition("stop")}
            className="w-[64px] h-[64px] rounded-full bg-[#e95050] hover:bg-[#e95050] active:bg-[#cf3434] transition-colors flex items-center justify-center focus:outline-none"
          >
            <StopIcon className="w-8 h-8 text-white" />
          </button>
        );
    }
  };

  // Get display time
  const getDisplayTime = () => {
    if (timerState === "finished") return "00:00";
    return formatTime(remainingSeconds);
  };

  const jumpToHome = () => {
    gAppManager.createApp(AppType.Home, { from: AppType.Clock });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-[402px] h-[456px] rounded-[40px] bg-[#d9d9d9] p-6 flex flex-col">
        {/* Top bar - total time and add button */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-white" style={{ fontSize: "29px" }}>
            {formatTime(totalSeconds)}
          </div>
          <button
            onClick={jumpToHome}
            className="w-[44px] h-[44px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Timer circle container with specific top margin */}
        <div
          className="flex-1 relative flex items-start justify-center"
          style={{ marginTop: "10px" }}
        >
          {/* Background circle */}
          <svg className="absolute w-[190px] h-[190px]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#444444"
              strokeOpacity="0.2"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Progress circle */}
          <svg
            className="absolute w-[190px] h-[190px]"
            viewBox="0 0 100 100"
            style={{
              transform: "rotateX(180deg) rotateZ(90deg)",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="289.03"
              strokeDashoffset={getProgressOffset()}
            />
          </svg>

          {/* Center time display */}
          <div className="absolute flex flex-col items-center justify-start w-[190px] h-[190px]">
            <div
              className="text-white font-bold tabular-nums text-center"
              style={{
                fontSize: "36px",
                lineHeight: 1,
                letterSpacing: "0.01em",
                marginTop: "61px",
              }}
            >
              {getDisplayTime()}
            </div>
            <div
              className="absolute"
              style={{
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <button
                onClick={toggleMute}
                className="w-[32px] h-[32px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors flex items-center justify-center focus:outline-none"
              >
                <VolumeIcon className="w-6 h-6 text-white" muted={isMuted} />
              </button>
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-center gap-8 mt-60 mb-2">
          {renderControlButtons()}
        </div>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto" muted >
        <source src="./alarm.mp3" type="audio/mp3" />
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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.80138 6.6141L8.49595 3.44433C8.84618 3.14385 9.0213 2.9936 9.16958 2.98988C9.29844 2.98664 9.42154 3.04322 9.50299 3.14313C9.59671 3.25809 9.59671 3.48883 9.59671 3.9503V15.9355C9.59671 16.4274 9.59671 16.6733 9.49862 16.7897C9.41348 16.8907 9.28547 16.9453 9.15363 16.937C9.00175 16.9273 8.82414 16.7572 8.46893 16.417L8.46891 16.417L4.75718 12.862L3.00008 12.862H3.00007H3.00007C2.53337 12.862 2.30001 12.8619 2.12176 12.7711C1.96495 12.6912 1.83747 12.5637 1.75758 12.4069C1.66675 12.2287 1.66675 11.9953 1.66675 11.5286V7.94744C1.66675 7.48073 1.66675 7.24737 1.75758 7.06911C1.83747 6.91231 1.96495 6.78483 2.12176 6.70493C2.30002 6.6141 2.53337 6.6141 3.00008 6.6141H4.80138ZM12.5587 8.11272L13.5015 7.16991L15.387 9.05547L17.2726 7.16991L18.2154 8.11272L16.3299 9.99828L18.2155 11.884L17.2727 12.8268L15.387 10.9411L13.5014 12.8268L12.5586 11.884L14.4442 9.99828L12.5587 8.11272Z"
          fill="white"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.80138 6.6141L8.49595 3.44433L8.49595 3.44433C8.84619 3.14385 9.0213 2.9936 9.16958 2.98988C9.29844 2.98664 9.42154 3.04322 9.50299 3.14313C9.59671 3.25809 9.59671 3.48883 9.59671 3.9503V15.9355C9.59671 16.4274 9.59671 16.6733 9.49862 16.7897C9.41348 16.8907 9.28547 16.9453 9.15363 16.937C9.00175 16.9273 8.82414 16.7572 8.46893 16.417L8.46891 16.417L4.75718 12.862L3.00008 12.862C2.53337 12.862 2.30002 12.862 2.12176 12.7711C1.96495 12.6912 1.83747 12.5637 1.75758 12.4069C1.66675 12.2287 1.66675 11.9953 1.66675 11.5286V7.94744C1.66675 7.48073 1.66675 7.24737 1.75758 7.06911C1.83747 6.91231 1.96495 6.78482 2.12176 6.70493C2.30001 6.6141 2.53337 6.6141 3.00008 6.6141H3.00008H4.80138ZM11.9672 7.33639L12.2921 7.87034C12.6568 8.4698 12.8667 9.17397 12.8667 9.92526C12.8667 10.6571 12.6675 11.3443 12.32 11.9335L12.0026 12.4719L10.9258 11.8369L11.2433 11.2986C11.4805 10.8964 11.6167 10.4277 11.6167 9.92526C11.6167 9.40955 11.4732 8.92927 11.2242 8.52004L10.8993 7.98609L11.9672 7.33639ZM14.1918 5.87661L13.838 5.36141L12.8076 6.06904L13.1614 6.58425C13.8285 7.55564 14.2188 8.73126 14.2188 9.99993C14.2188 11.2082 13.8648 12.3319 13.255 13.2752L12.9157 13.8L13.9654 14.4787L14.3047 13.9538C15.0413 12.8144 15.4688 11.4562 15.4688 9.99993C15.4688 8.47066 14.9974 7.04962 14.1918 5.87661Z"
        fill="white"
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
