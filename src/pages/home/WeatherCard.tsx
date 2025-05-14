"use client";

import {
  Trash2,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "./weather-type";
import { gAppManager, AppType } from "../../lib/app-manager";

interface WeatherCardProps {
  city: string;
  weather?: WeatherData;
  isLoading: boolean;
  error?: string;
  onRemove: (city: string) => void;
}

export default function WeatherCard({
  city,
  weather,
  isLoading,
  error,
  onRemove,
}: WeatherCardProps) {
  // Select weather icon based on weather condition
  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-6 w-6 text-white opacity-70" />;

    const condition = weather.weather[0]?.main.toLowerCase();

    if (condition.includes("clear"))
      return <Sun className="h-6 w-6 text-white opacity-70" />;
    if (condition.includes("rain"))
      return <CloudRain className="h-6 w-6 text-white opacity-70" />;
    if (condition.includes("snow"))
      return <CloudSnow className="h-6 w-6 text-white opacity-70" />;
    return <Cloud className="h-6 w-6 text-white opacity-70" />;
  };

  const onGotoWeatherApp = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.target === evt.currentTarget) {
      gAppManager.createApp(AppType.Weather, { city });
    }
  };

  return (
    <div
      onClick={onGotoWeatherApp}
      className="flex items-center justify-between bg-[#a0a0a0] rounded-[16px] py-5 px-6"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl">{city}</span>
          {getWeatherIcon()}
        </div>

        {isLoading ? (
          <span className="text-white text-sm opacity-70">
            Loading weather data...
          </span>
        ) : error ? (
          <span className="text-white text-sm opacity-70">Error: {error}</span>
        ) : weather ? (
          <div className="flex flex-col mt-1">
            <span className="text-white text-lg">
              {Math.round(weather.main.temp)}°C
            </span>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-white opacity-70" />
                <span className="text-white text-xs opacity-70">
                  {weather.wind.speed} m/s
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-white opacity-70" />
                <span className="text-white text-xs opacity-70">
                  {weather.main.humidity}%
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Button
        variant="ghost"
        onClick={() => onRemove(city)}
        className="text-white hover:bg-[#888888]/30 rounded-full p-3 h-auto w-auto transition-colors"
      >
        <Trash2 className="h-8 w-8" />
      </Button>
    </div>
  );
}
