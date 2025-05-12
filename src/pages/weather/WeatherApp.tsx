"use client";

import type React from "react";

import { Plus, Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

  // Ref for the forecast scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Touch handling state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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
  const getWeatherIcon = (type: string): JSX.Element => {
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

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
    if (isRightSwipe && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
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
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
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

  return (
    <div className="w-[456px] h-[438px] max-w-md overflow-hidden rounded-3xl bg-[#3c3c3c] text-white shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[29px] font-bold">{weatherData?.name || city}</h1>
          <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#5e5e5e] text-white transition hover:bg-[#6e6e6e]">
            <Plus className="h-[24px] w-[24px]" />
          </button>
        </div>

        <div className="mt-[28.5px] w-[392px] h-[166px]">
          <p className="text-[17px]">
            {forecastData[activeDay]?.name || "Today"}
          </p>
          <div className="flex items-center justify-between">
            {forecastData[activeDay]?.isToday ? (
              // For today, show only current temperature
              <p className="text-[70px] font-light leading-none mt-[4px]">
                {forecastData[activeDay]?.current || "21°"}
              </p>
            ) : (
              // For other days, show high and low temperatures
              <div className="flex items-baseline">
                <p className="text-[54px] font-light leading-none">
                  {Math.round(forecastData[activeDay]?.temp_max || 0)}°
                </p>
                <p className="ml-4 text-[54px] font-light leading-none text-gray-400">
                  {Math.round(forecastData[activeDay]?.temp_min || 0)}°
                </p>
              </div>
            )}
            <div className="relative h-[166px] w-[250px]">
              {forecastData[activeDay]?.fullWeather === "partly_cloudy" && (
                <img
                  src="./sunny.jpeg"
                  alt="Partly cloudy"
                  width={250}
                  height={166}
                  className="h-full w-full object-contain"
                />
              )}
              {forecastData[activeDay]?.fullWeather === "sunny" && (
                <img
                  src="./sunny.jpeg"
                  alt="Sunny"
                  width={250}
                  height={166}
                  className="h-full w-full object-contain"
                />
              )}
              {forecastData[activeDay]?.fullWeather === "rainy" && (
                <img
                  src="./sunny.jpeg"
                  alt="Rainy"
                  width={250}
                  height={166}
                  className="h-full w-full object-contain"
                />
              )}
              {forecastData[activeDay]?.fullWeather === "cloudy" && (
                <img
                  src="./sunny.jpeg"
                  alt="Cloudy"
                  width={250}
                  height={166}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {forecastData.map((day, index) => (
          <button
            key={index}
            onClick={() => setActiveDay(index)}
            className={`flex min-w-[100px] flex-1 flex-col items-center justify-center border-t border-[#4a4a4a] py-4 transition ${
              activeDay === index
                ? "bg-[#4a4a4a]"
                : "bg-[#3d3d3d] hover:bg-[#454545]"
            }`}
          >
            <span className="mb-2">{day.name}</span>
            <div className="my-2 h-20 w-20">
              {day.fullWeather === "partly_cloudy" && (
                <img
                  src="/partly-cloudy-icon.png"
                  alt="Partly cloudy"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              )}
              {day.fullWeather === "sunny" && (
                <img
                  src="/bright-yellow-sun-weather-icon.png"
                  alt="Sunny"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              )}
              {day.fullWeather === "rainy" && (
                <img
                  src="/rain-cloud-icon.png"
                  alt="Rainy"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              )}
              {day.fullWeather === "cloudy" && (
                <img
                  src="/fluffy-gray-cloud-icon.png"
                  alt="Cloudy"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <span className="text-sm">{day.temp}</span>
          </button>
        ))}
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
