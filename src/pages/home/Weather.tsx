import type React from "react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherCard from "./WeatherCard";
import type { CityWeather } from "./weather-type";

const API_KEY = "f98e4bba1f6eb2af7dde364a5ebc367f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const citiesFromLocalStorage = localStorage.getItem('cities') ?? "New York,Los Angeles,Tokoy";
const defaultCities = citiesFromLocalStorage.split(",").map((city) => city.trim()).map((city) => ({ city, isLoading: true }));

export default function Weather() {
  const [cities, setCities] = useState<CityWeather[]>(defaultCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch weather data for a city
  const fetchWeatherData = async (city: string) => {
    try {
      // const response = await fetch(
      //   `/api/weather?city=${encodeURIComponent(city)}`
      // );
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch weather data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    localStorage.setItem('cities', cities.map((city) => city.city).join(","));
  }, [cities]);

  // Load all weather data on initial render
  useEffect(() => {
    const loadAllWeatherData = async () => {
      const updatedCities = [...cities];

      for (let i = 0; i < updatedCities.length; i++) {
        try {
          const weatherData = await fetchWeatherData(updatedCities[i].city);
          updatedCities[i] = {
            ...updatedCities[i],
            weather: weatherData,
            isLoading: false,
          };
          setCities([...updatedCities]);
        } catch (error) {
          updatedCities[i] = {
            ...updatedCities[i],
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          };
          setCities([...updatedCities]);
        }
      }
    };

    loadAllWeatherData();
  }, []);

  const handleRemoveCity = (cityToRemove: string) => {
    setCities(cities.filter((cityData) => cityData.city !== cityToRemove));
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Check if city already exists in the list
    if (
      cities.some(
        (cityData) =>
          cityData.city.toLowerCase() === searchQuery.trim().toLowerCase()
      )
    ) {
      setSearchError("City already in the list");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const weatherData = await fetchWeatherData(searchQuery.trim());

      // Add new city to the beginning of the list
      setCities([
        {
          city: weatherData.name,
          weather: weatherData,
          isLoading: false,
        },
        ...cities,
      ]);

      setSearchQuery("");
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Failed to add city"
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      <h1 className="text-[36px] font-bold text-white mb-6">Weather</h1>

      {/* Search Form */}
      <form onSubmit={handleAddCity} className="relative mb-4">
        <div className="relative flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#888888] h-5 w-5" />
            <Input
              type="text"
              placeholder="Search City"
              className="w-full bg-[#b8b8b8] border-none pl-12 pr-4 py-6 h-[60px] rounded-full text-white placeholder:text-[#888888] focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchError(null);
              }}
              disabled={isSearching}
            />
          </div>
          <Button
            type="submit"
            className="ml-2 bg-[#444444] hover:bg-[#555555] text-white rounded-full h-[50px] px-6"
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        {searchError && (
          <p className="text-red-400 text-sm mt-2 ml-4">{searchError}</p>
        )}
      </form>

      {/* City List */}
      <div className="space-y-4 max-h-[350px] overflow-auto scrollbar-hide pr-2">
        {cities.map((cityData) => (
          <WeatherCard
            key={cityData.city}
            city={cityData.city}
            weather={cityData.weather}
            isLoading={cityData.isLoading}
            error={cityData.error}
            onRemove={handleRemoveCity}
          />
        ))}
      </div>
    </div>
  );
}
