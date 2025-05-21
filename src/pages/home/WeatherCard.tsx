"use client";

import type { WeatherData } from "./weather-type";
import { gAppManager, AppType } from "../../lib/app-manager";
import { WeatherSmallSVG } from "../weather/WeatherSmallSVG";


function getWeatherBgImage(weatherType: string) {
  switch (weatherType) {
    case "Clear":
      return "url(/images/weather/sunny.png)";
    case "Clouds":
      return "url(/images/weather/cloud.png)";
    case "Rain":
      return "url(/images/weather/rain.png)";
    case "Snow":
      return "url(/images/weather/snow.png)";
    case "Thunderstorm":
      return "url(/images/weather/thunderstorm.png)";
    default:
      return "url(/images/weather/sunny.png)";
  }
}

function WindSVG() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_387_7593)">
      <path d="M2.5 7.49935L7.50004 7.4993C8.42049 7.4993 9.16667 6.75312 9.16667 5.83266V5.83266C9.16667 4.9122 8.42048 4.16602 7.50002 4.16602H6.94444" stroke="white" stroke-width="1.25" stroke-linecap="round" />
      <path d="M2.5 12.4993L10.4167 12.4994C11.5673 12.4994 12.5 13.4321 12.5 14.5827V14.5827C12.5 15.7333 11.5673 16.666 10.4167 16.666H10.1923" stroke="white" stroke-width="1.25" stroke-linecap="round" />
      <path d="M2.5 10L14.8469 9.99962C15.8606 9.99959 16.6907 9.19384 16.7208 8.18061V8.18061C16.7523 7.12379 15.9041 6.25 14.8468 6.25H13.6302" stroke="white" stroke-width="1.25" stroke-linecap="round" />
    </g>
    <defs>
      <clipPath id="clip0_387_7593">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
}

function RainSVG() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_387_7615)">
      <path d="M6.45791 9.62089L9.60757 4.77041C9.79208 4.48628 10.208 4.48628 10.3925 4.77041L13.5422 9.62089C13.9498 10.2486 14.1667 10.981 14.1667 11.7295C14.1667 13.4657 13.0109 14.9897 11.3389 15.4578L11.1235 15.5181C10.3887 15.7239 9.61142 15.7239 8.87658 15.5181L8.66117 15.4578C6.98923 14.9897 5.83337 13.4657 5.83337 11.7295C5.83337 10.981 6.05031 10.2486 6.45791 9.62089Z" stroke="white" stroke-width="1.25" />
    </g>
    <defs>
      <clipPath id="clip0_387_7615">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
}

function DeleteSVG() {
  return <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 20.5C17.8284 20.5 18.5 21.1716 18.5 22C18.5 22.8284 17.8284 23.5 17 23.5C16.1716 23.5 15.5 22.8284 15.5 22C15.5 21.1716 16.1716 20.5 17 20.5ZM22 20.5C22.8284 20.5 23.5 21.1716 23.5 22C23.5 22.8284 22.8284 23.5 22 23.5C21.1716 23.5 20.5 22.8284 20.5 22C20.5 21.1716 21.1716 20.5 22 20.5ZM27 20.5C27.8284 20.5 28.5 21.1716 28.5 22C28.5 22.8284 27.8284 23.5 27 23.5C26.1716 23.5 25.5 22.8284 25.5 22C25.5 21.1716 26.1716 20.5 27 20.5Z" fill="white" />
  </svg>
}

interface WeatherCardProps {
  city: string;
  weather?: WeatherData;
  isLoading: boolean;
  error?: string;
  onRemove: (city: string) => void;
}

export default function WeatherCard({
  weather,
  isLoading,
  error,
  onRemove,
}: WeatherCardProps) {

  const onGotoWeatherApp = () => {
    gAppManager.createApp(AppType.Weather, { city });
  };

  const weatherType = weather?.weather[0]?.main || "Clear";
  const temperature = weather?.main.temp || 20;
  const city = weather?.name || "Beijing";
  const country = weather?.sys.country || "CN";
  const countryCity = `${city}, ${country}`;
  const windSpeed = weather?.wind.speed || 0;
  const humidity = weather?.main.humidity || 0;

  if (isLoading) {
    return (
      <div className=" bg-[#a0a0a0] rounded-[16px]   w-[354px] h-[100px]  " />
    )
  }

  const backgroundImage = getWeatherBgImage(weatherType)

  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={onGotoWeatherApp}
      className="relative text-white   bg-[#a0a0a0] rounded-[16px]  w-[354px] h-[100px] cursor-pointer"
    >
      <div className="absolute left-[20px] top-[10px] flex items-center gap-0">
        <span className="text-white text-[36px] h-[55px] leading-[55px]">
          {Math.round(temperature)}°
        </span>
        <WeatherSmallSVG weatherType={weatherType} />
      </div>

      <div className="absolute left-[20px] bottom-[8px] text-[13px] h-[36px] leading-[36px]">
        {countryCity}
      </div>

      <div className="absolute bottom-[14px] right-[20px] flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1">
          <WindSVG />
          <span className="text-white text-xs opacity-70">
            {windSpeed} m/s
          </span>
        </div>
        <div className="flex items-center gap-1">
          <RainSVG />
          <span className="text-white text-xs opacity-70">
            {humidity}%
          </span>
        </div>
      </div>

      <div
        onClick={(evt) => { evt.stopPropagation(); onRemove(city); }}
        className="absolute top-[18px] right-[8px] w-[44px] h-[44px] text-white hover:bg-[#888888]/30 rounded-full"
      >
        <DeleteSVG />
      </div>
    </div>
  );
}