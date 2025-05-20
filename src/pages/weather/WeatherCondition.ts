export enum WeatherCondition {
  Clear = 'Clear',
  Rain = 'Rain',
  Thunderstorm = 'Thunderstorm',
  Cloud = 'Cloud',
  Snow = 'Snow',
  Drizzle = 'Drizzle',
  Atmosphere = 'Atmosphere',
}
 
// Map weather codes to our weather types
export function getWeatherType(id: number): WeatherCondition {
    if (id >= 200 && id < 300) return WeatherCondition.Thunderstorm
    if (id >= 300 && id < 400) return WeatherCondition.Drizzle
    if (id >= 500 && id < 600) return WeatherCondition.Rain
    if (id >= 600 && id < 700) return WeatherCondition.Snow
    if (id >= 700 && id < 800) return WeatherCondition.Atmosphere
    if (id === 800) return WeatherCondition.Clear
    if (id > 800) return WeatherCondition.Cloud
    return WeatherCondition.Cloud
}