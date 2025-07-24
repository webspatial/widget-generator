export interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
}

export interface CityWeather {
  city: string
  weather?: WeatherData
  isLoading: boolean
  error?: string
}
