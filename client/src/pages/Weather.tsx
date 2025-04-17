import { WeatherData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getWeatherCondition,
  getUVIndexLabel,
  getUVProtectionTips,
  getNextSevenDays
} from '../lib/helpers';
import { 
  Sun, 
  CloudSun, 
  Shield,
  CloudRain,
  Cloud
} from 'lucide-react';

interface WeatherProps {
  weatherData: WeatherData;
}

const Weather = ({ weatherData }: WeatherProps) => {
  const weatherCondition = getWeatherCondition(weatherData.current.weather_code);
  const uvIndexLabel = getUVIndexLabel(weatherData.current.uv_index);
  const uvProtectionTips = getUVProtectionTips(weatherData.current.uv_index);
  const nextSevenDays = getNextSevenDays();

  // Get weather icon based on weather code
  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="text-amber-400" />;
    if (code <= 3) return <CloudSun className="text-slate-600" />;
    if (code >= 61 && code <= 67) return <CloudRain className="text-slate-600" />;
    return <Cloud className="text-slate-600" />;
  };

  // Get UV index color class
  const getUVIndexColorClass = (index: number) => {
    if (index <= 2) return 'bg-green-500';
    if (index <= 5) return 'bg-yellow-500';
    if (index <= 7) return 'bg-orange-500';
    if (index <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  // Get UV index text color class
  const getUVIndexTextColorClass = (index: number) => {
    if (index <= 2) return 'text-green-500';
    if (index <= 5) return 'text-yellow-500';
    if (index <= 7) return 'text-orange-500';
    if (index <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Météo</h2>
      
      {/* Current Weather */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Conditions actuelles</h3>
          
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              {getWeatherIcon(weatherData.current.weather_code)}
              <div className="ml-6">
                <div className="text-4xl font-bold">{weatherData.current.temperature_2m}°C</div>
                <div className="text-slate-500">{weatherCondition}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-500">Ressenti</div>
                <div className="font-medium">{weatherData.current.apparent_temperature.toFixed(1)}°C</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-500">Humidité</div>
                <div className="font-medium">{weatherData.current.relative_humidity_2m}%</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-500">Vent</div>
                <div className="font-medium">{weatherData.current.wind_speed_10m} km/h</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-500">Pression</div>
                <div className="font-medium">{weatherData.current.pressure_msl} hPa</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* UV Index */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Indice UV</h3>
          
          <div className="flex items-center mb-4">
            <div 
              className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getUVIndexColorClass(weatherData.current.uv_index)}`}
            >
              <span>{weatherData.current.uv_index}</span>
            </div>
            <div className="ml-4">
              <div className={`font-medium ${getUVIndexTextColorClass(weatherData.current.uv_index)}`}>
                {uvIndexLabel}
              </div>
              <div className="text-sm text-slate-500">Protection recommandée</div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Conseils de protection</h4>
            <ul className="text-sm text-amber-700 space-y-2">
              {uvProtectionTips.map((tip, index) => (
                <li key={index} className="flex">
                  <Shield className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Weather Forecast */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Prévisions sur 7 jours</h3>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-7 gap-3">
                {weatherData.daily.time.slice(0, 7).map((time, index) => {
                  const date = new Date(time);
                  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                  const dayDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                  
                  return (
                    <div key={time} className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium">{dayName}</div>
                      <div className="text-xs text-slate-500">{dayDate}</div>
                      <div className="my-2">
                        {getWeatherIcon(weatherData.daily.weather_code[index])}
                      </div>
                      <div className="text-sm font-medium">{weatherData.daily.temperature_2m_max[index].toFixed(0)}°</div>
                      <div className="text-xs text-slate-500">{weatherData.daily.temperature_2m_min[index].toFixed(0)}°</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
