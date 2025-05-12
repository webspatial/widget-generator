"use client";

import type React from "react";

import { Plus, Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Types for OpenWeatherMap API responses
interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}

interface DayForecast {
  name: string;
  date: Date;
  icon: JSX.Element;
  temp: string;
  current: string;
  temp_min: number;
  temp_max: number;
  fullWeather: string;
  weatherId: number;
  isToday: boolean;
}

interface WeatherWidgetProps {
  city?: string;
}

export default function WeatherWidget({
  city = "Beijing",
}: WeatherWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    name: string;
    temp: number;
  } | null>(null);
  const [forecastData, setForecastData] = useState<DayForecast[]>([]);
  const [activeDay, setActiveDay] = useState(0);

  // Map weather codes to our weather types
  const getWeatherType = (id: number): string => {
    if (id >= 200 && id < 300) return "rainy"; // Thunderstorm
    if (id >= 300 && id < 400) return "rainy"; // Drizzle
    if (id >= 500 && id < 600) return "rainy"; // Rain
    if (id >= 600 && id < 700) return "cloudy"; // Snow
    if (id >= 700 && id < 800) return "cloudy"; // Atmosphere
    if (id === 800) return "sunny"; // Clear
    if (id > 800) return "partly_cloudy"; // Clouds
    return "partly_cloudy";
  };

  // Get weather icon based on weather type
  const getWeatherIcon = (type: string) => {
    switch (type) {
      case "sunny":
        return <Sun className="h-20 w-20 text-[#ffe600]" />;
      case "rainy":
        return (
          <CloudRain className="h-20 w-20 text-white stroke-white fill-[#51f5ff]" />
        );
      case "partly_cloudy":
      case "cloudy":
      default:
        return <Cloud className="h-20 w-20 text-white" />;
    }
  };

  // Get day name from date
  const getDayName = (date: Date): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  // Fetch weather data using separate endpoints instead of One Call API
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_KEY = "f98e4bba1f6eb2af7dde364a5ebc367f";

      // Fetch current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!currentRes.ok) {
        throw new Error(
          `Failed to fetch current weather: ${currentRes.statusText}`
        );
      }

      const currentData: WeatherData = await currentRes.json();
      setWeatherData({
        name: currentData.name,
        temp: currentData.main.temp,
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!forecastRes.ok) {
        throw new Error(`Failed to fetch forecast: ${forecastRes.statusText}`);
      }

      const forecastData: ForecastData = await forecastRes.json();

      // Process forecast data to get daily forecasts
      const dailyForecasts: DayForecast[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison

      // Add today's forecast
      const weatherType = getWeatherType(currentData.weather[0].id);
      dailyForecasts.push({
        name: "Today",
        date: today,
        icon: getWeatherIcon(weatherType),
        temp: `${Math.round(currentData.main.temp_min)}°-${Math.round(
          currentData.main.temp_max
        )}°`,
        current: `${Math.round(currentData.main.temp)}°`,
        temp_min: currentData.main.temp_min,
        temp_max: currentData.main.temp_max,
        fullWeather: weatherType,
        weatherId: currentData.weather[0].id,
        isToday: true,
      });

      // Process next 4 days
      const processedDates = new Set<string>();
      processedDates.add(today.toDateString());

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        date.setHours(0, 0, 0, 0); // Set to start of day for comparison
        const dateString = date.toDateString();

        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          processedDates.add(dateString);
          const weatherType = getWeatherType(item.weather[0].id);
          dailyForecasts.push({
            name: getDayName(date),
            date: date,
            icon: getWeatherIcon(weatherType),
            temp: `${Math.round(item.main.temp_min)}°-${Math.round(
              item.main.temp_max
            )}°`,
            current: `${Math.round(item.main.temp)}°`,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            fullWeather: weatherType,
            weatherId: item.weather[0].id,
            isToday: false,
          });
        }
      }

      setForecastData(dailyForecasts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      setLoading(false);

      // If we fail to fetch data and have no existing data, use fallback data
      if (forecastData.length === 0) {
        setFallbackData();
      }
    }
  };

  // Set fallback data in case API fails
  const setFallbackData = () => {
    const today = new Date();
    const fallbackDays: DayForecast[] = [];

    fallbackDays.push({
      name: "Today",
      date: today,
      icon: getWeatherIcon("partly_cloudy"),
      temp: "18°-24°",
      current: "21°",
      temp_min: 18,
      temp_max: 24,
      fullWeather: "partly_cloudy",
      weatherId: 801,
      isToday: true,
    });

    for (let i = 1; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      fallbackDays.push({
        name: getDayName(date),
        date: date,
        icon: getWeatherIcon(
          i % 3 === 0 ? "partly_cloudy" : i % 3 === 1 ? "sunny" : "rainy"
        ),
        temp: "18°-24°",
        current: "21°",
        temp_min: 18,
        temp_max: 24,
        fullWeather:
          i % 3 === 0 ? "partly_cloudy" : i % 3 === 1 ? "sunny" : "rainy",
        weatherId: i % 3 === 0 ? 801 : i % 3 === 1 ? 800 : 500,
        isToday: false,
      });
    }

    setForecastData(fallbackDays);
    setWeatherData({
      name: city,
      temp: 21,
    });
    setLoading(false);
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchWeatherData();

    // Set up polling every minute
    const intervalId = setInterval(() => {
      fetchWeatherData();
    }, 60000); // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [city]); // Re-run effect when city changes

  if (loading && !weatherData) {
    return (
      <div className="flex h-96 w-full max-w-md items-center justify-center rounded-3xl bg-[#3c3c3c] text-white">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <span className="ml-2">Loading weather data...</span>
      </div>
    );
  }

  const renderWhetherDetail = () => {
    if (forecastData[activeDay]?.isToday) {
      return (
        <div className="flex items-start justify-between">
          <div className="flex flex-col h-full">
            <p className="text-[17px]">
              {forecastData[activeDay]?.name || "Today"}
            </p>
            <p className="text-[70px] font-light leading-none mt-[4px]">
              {forecastData[activeDay]?.current || "21°"}
            </p>
          </div>

          <img
            src="./sunny.jpeg"
            alt="Sunny"
            width={250}
            height={166}
            className="h-[166] w-[250] object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start justify-between">
          <p className="text-[17px]">
            {forecastData[activeDay]?.name || "Today"}
          </p>

          <div className="flex w-[347px] h-[80px] justify-between">
            <div className="flex items-baseline">
              <p className="text-[54px] font-light leading-none">
                {Math.round(forecastData[activeDay]?.temp_max || 0)}°
              </p>
              <p className="ml-4 text-[54px] font-light leading-none text-gray-400">
                {Math.round(forecastData[activeDay]?.temp_min || 0)}°
              </p>
            </div>

            <img
              src="./sunny.jpeg"
              alt="Sunny"
              width={80}
              height={80}
              className="h-[80] w-[80] object-contain"
            />
          </div>
        </div>
      );
    }
  };

  const renderFutureWeather = (day: any, index: number) => {
    return (
      <button
        key={index}
        onClick={() => setActiveDay(index)}
        className={`flex w-[80px] h-[120px] flex-1 flex-col items-center justify-center border-[1px]   ${
          activeDay === index
            ? "bg-[#4a4a4a]"
            : "bg-[#3d3d3d] hover:bg-[#454545]"
        }`}
      >
        <span className="text-[13px]">{day.name}</span>

        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="path-1-inside-1_339_20147" fill="white">
            <path d="M21 14C23.8198 14 26.1834 15.9455 26.8257 18.5673C26.8888 18.8248 27.1262 19.0062 27.3913 19.0011C27.4274 19.0004 27.4637 19 27.5 19C30.5376 19 33 21.4624 33 24.5C33 27.5376 30.5376 30 27.5 30C27.3357 30 27.1733 29.9909 27.0127 29.9767C27.0059 29.9761 27 29.9815 27 29.9883C27 29.9948 26.9948 30 26.9883 30H16L15.7432 29.9932C13.1011 29.8595 11 27.6753 11 25C11 22.615 12.6699 20.6199 14.9043 20.1204C14.9607 20.1078 15 20.0577 15 20C15 16.6863 17.6863 14 21 14Z" />
          </mask>
          <path
            d="M21 14C23.8198 14 26.1834 15.9455 26.8257 18.5673C26.8888 18.8248 27.1262 19.0062 27.3913 19.0011C27.4274 19.0004 27.4637 19 27.5 19C30.5376 19 33 21.4624 33 24.5C33 27.5376 30.5376 30 27.5 30C27.3357 30 27.1733 29.9909 27.0127 29.9767C27.0059 29.9761 27 29.9815 27 29.9883C27 29.9948 26.9948 30 26.9883 30H16L15.7432 29.9932C13.1011 29.8595 11 27.6753 11 25C11 22.615 12.6699 20.6199 14.9043 20.1204C14.9607 20.1078 15 20.0577 15 20C15 16.6863 17.6863 14 21 14Z"
            fill="white"
          />
          <path
            d="M16 30L15.9468 31.9993L15.9734 32H16V30ZM15.7432 29.9932L15.6421 31.9906L15.666 31.9918L15.69 31.9925L15.7432 29.9932ZM14.9043 20.1204L14.468 18.1686L14.9043 20.1204ZM27.0127 29.9767L26.8365 31.9689L27.0127 29.9767ZM26.8257 18.5673L24.8832 19.0432L26.8257 18.5673ZM21 14V16C22.8763 16 24.4548 17.2944 24.8832 19.0432L26.8257 18.5673L28.7683 18.0914C27.9121 14.5965 24.7633 12 21 12V14ZM27.3913 19.0011L27.4302 21.0007C27.4534 21.0002 27.4767 21 27.5 21V19V17C27.4507 17 27.4015 17.0005 27.3524 17.0014L27.3913 19.0011ZM27.5 19V21C29.433 21 31 22.567 31 24.5L33 24.5H35C35 20.3579 31.6421 17 27.5 17V19ZM33 24.5L31 24.5C31 26.433 29.433 28 27.5 28L27.5 30V32C31.6421 32 35 28.6421 35 24.5H33ZM27.5 30L27.5 28C27.4087 28 27.3069 27.9949 27.1889 27.9845L27.0127 29.9767L26.8365 31.9689C27.0397 31.9869 27.2628 32 27.5 32V30ZM26.9883 30V28H16V30V32L26.9883 32V30ZM16 30L16.0532 28.0007L15.7964 27.9939L15.7432 29.9932L15.69 31.9925L15.9468 31.9993L16 30ZM15.7432 29.9932L15.8442 27.9957C14.2605 27.9156 13 26.6044 13 25H11H9C9 28.7462 11.9417 31.8034 15.6421 31.9906L15.7432 29.9932ZM11 25H13C13 23.5715 14.0004 22.3719 15.3407 22.0722L14.9043 20.1204L14.468 18.1686C11.3394 18.868 9 21.6584 9 25H11ZM15 20H17C17 17.7909 18.7909 16 21 16V14V12C16.5817 12 13 15.5817 13 20H15ZM14.9043 20.1204L15.3407 22.0722C16.33 21.8511 17 20.9745 17 20H15H13C13 19.141 13.5914 18.3646 14.468 18.1686L14.9043 20.1204ZM27.0127 29.9767L27.1889 27.9845C26.0147 27.8807 25 28.8052 25 29.9883H27H29C29 31.1578 27.9971 32.0716 26.8365 31.9689L27.0127 29.9767ZM27 29.9883H25C25 28.8902 25.8902 28 26.9883 28V30V32C28.0993 32 29 31.0993 29 29.9883H27ZM26.8257 18.5673L24.8832 19.0432C25.1704 20.2154 26.2355 21.0239 27.4302 21.0007L27.3913 19.0011L27.3524 17.0014C28.017 16.9885 28.6073 17.4342 28.7683 18.0914L26.8257 18.5673Z"
            fill="white"
            mask="url(#path-1-inside-1_339_20147)"
          />
        </svg>

        <span className="text-[14px]">{day.temp}</span>
      </button>
    );
  };

  return (
    <div className="w-full h-full text-white pl-[24px] pr-[24px] ">
      <div className="flex items-center h-[92px] justify-between">
        <h1 className="text-[29px] font-bold">{weatherData?.name || city}</h1>
        <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#5e5e5e] text-white transition hover:bg-[#6e6e6e]">
          <Plus className="h-[24px] w-[24px]" />
        </button>
      </div>

      <div className="w-[392px] h-[166px]">{renderWhetherDetail()}</div>

      <div className="flex overflow-x-auto scrollbar-hide w-[408px] h-[120px] mt-[24px]">
        {forecastData.map((day, index) => renderFutureWeather(day, index))}
      </div>

      {error && (
        <div className="bg-[#3d3d3d] p-2 text-center text-xs text-gray-300">
          <p>{error}</p>
          <button
            onClick={fetchWeatherData}
            className="mt-1 text-xs underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
