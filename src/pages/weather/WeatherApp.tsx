"use client";

import type React from "react";

import { Plus, Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { gAppManager, AppType } from "../../lib/app-manager";
import { WeatherSmallSVG } from "./WeatherSmallSVG";
import { getWeatherType } from "./WeatherCondition";
import { DayForecast, WeatherData, ForecastData } from "./interface";
import WeatherDetailCard from "./WeatherDetailCard";

interface WeatherWidgetProps {
  city?: string;
}

export default function WeatherWidget({
  city = "Beijing",
}: WeatherWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    name: string;
    temp: number;
  } | null>(null);
  const [forecastData, setForecastData] = useState<DayForecast[]>([]);
  const [activeDay, setActiveDay] = useState(0);



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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  // Fetch weather data using separate endpoints instead of One Call API
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // @ts-ignore
      const API_KEY = OPEN_WEATHER_API_KEY
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
      <div className="flex h-96 w-full max-w-md items-center justify-center  text-white">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <span className="ml-2">Loading weather data...</span>
      </div>
    );
  }

  const jumpToHome = () => {
    gAppManager.createApp(AppType.Home, { from: AppType.Weather });
  };

  const renderFutureWeather = (day: any, index: number) => {
    return (
      <button
        key={index}
        onClick={() => setActiveDay(index)}
        className={`flex w-[80px] h-[120px]   flex-col items-center justify-center    ${activeDay === index
          ? "bg-black/40"
          : "bg-black/20 hover:bg-[#454545]"
          }`}
      >
        <span className="text-[13px] mb-[11px]">{day.name}</span>
        <WeatherSmallSVG weatherType={day.fullWeather} />
        <span className="text-[14px] mt-[12px]">{day.temp}</span>
      </button>
    );
  };

  const currentData = forecastData[activeDay] || {
    isToday: true,
    weatherId: 801,
    name: "Today",
    date: new Date(),
    current: "21°",
    temp: "18°-24°",
  }

  const weatherType = getWeatherType(currentData.weatherId)

  return (
    <div className={"w-full h-full text-white pl-[24px] pr-[24px] relative " + ` weather-${weatherType}`}>
      <div className="flex items-center h-[92px] justify-between">
        <h1 className="text-[29px] font-bold">{weatherData?.name || city}</h1>
        <button
          onClick={jumpToHome}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full  bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
        >
          <Plus className="h-[24px] w-[24px]" />
        </button>
      </div>

      {!error && <WeatherDetailCard currentData={currentData} />}
      {!error &&
        <div className="flex overflow-x-auto justify-evenly scrollbar-hide w-[408px] h-[120px] absolute bottom-[36px] rounded-[16px]">
          {forecastData.map((day, index) => renderFutureWeather(day, index))}
        </div>
      }

      {error && (
        <div className="flex flex-col   w-full  pt-[100px] text-[17px] items-center justify-center  text-white">
          <p> Failed to load, Please Retry </p>
          <button
            onClick={fetchWeatherData}
            className="mt-[30px] text-xs underline hover:text-white rounded-full"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="22" fill="white" fill-opacity="0.1" />
              <path d="M22 32.3125C27.6954 32.3125 32.3125 27.6954 32.3125 22H30.25C30.25 26.5563 26.5563 30.25 22 30.25C17.4437 30.25 13.75 26.5563 13.75 22C13.75 17.4437 17.4437 13.75 22 13.75C24.2519 13.75 26.2932 14.6523 27.7818 16.115L25.9841 17.9128C25.7697 18.1272 25.9215 18.4938 26.2247 18.4938H31.075C31.3598 18.4938 31.5906 18.2629 31.5906 17.9781V13.1278C31.5906 12.8247 31.224 12.6728 31.0097 12.8872L29.2403 14.6566C27.3783 12.8206 24.8215 11.6875 22 11.6875C16.3046 11.6875 11.6875 16.3046 11.6875 22C11.6875 27.6954 16.3046 32.3125 22 32.3125Z" fill="white" />
            </svg>

          </button>
        </div>
      )}
    </div>
  );
}
