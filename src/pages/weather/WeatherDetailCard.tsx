import { DayForecast } from "./interface";
import { WeatherBigSVG } from "./WeatherBigSVG";
import { getWeatherType } from "./WeatherCondition";
import { WeatherMiddleSVG } from "./WeatherMiddleSVG";

export default function WeatherDetailCard({ currentData }: { currentData: DayForecast }) {
    if (currentData.isToday) {
        return (
            <div className="flex items-start justify-between w-[376px] h-[174px]">
                <div className="flex flex-col h-full">
                    <p className="text-[17px]">
                        {currentData.name}
                    </p>
                    <p className="text-[70px] font-bold leading-none mt-[4px]">
                        {currentData.current}
                    </p>
                </div>
                <div enable-xr={true} style={{ '--xr-back': 16 }}>
                    <WeatherBigSVG  weatherType={getWeatherType(currentData.weatherId)} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-start justify-between">
                <p className="text-[17px]">
                    {currentData.name}
                </p>

                <div className="flex w-[271px] h-[80px] justify-between   items-center">
                    <p className="text-[54px] font-bold leading-none">
                        {Math.round(currentData.temp_max)}°
                    </p>
                    <p className="ml-4 text-[54px] font-bold leading-none text-white/40">
                        {Math.round(currentData.temp_min)}°
                    </p>
                    <div enable-xr={true} style={{ '--xr-back': 16 }}>
                        <WeatherMiddleSVG  weatherType={getWeatherType(currentData.weatherId)} />
                    </div>
                </div>
            </div>
        );
    }
};
