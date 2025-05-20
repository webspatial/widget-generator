
// Types for OpenWeatherMap API responses
export interface WeatherData {
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

export interface ForecastData {
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

export interface DayForecast {
  name: string;
  date: Date;
  icon: React.ReactNode;
  temp: string;
  current: string;
  temp_min: number;
  temp_max: number;
  fullWeather: string;
  weatherId: number;
  isToday: boolean;
}
