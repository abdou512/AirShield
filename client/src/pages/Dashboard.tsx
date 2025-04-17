import { UserProfile, AirQualityData, PollenData, WeatherData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getAQICategory, 
  getCurrentDate, 
  getPollutantLevel, 
  mapPollenDataToUI, 
  calculatePollenRiskLevel,
  getRecommendations,
  getWeatherCondition,
  convertCO
} from '../lib/helpers';
import { CheckCircle, CloudSun, Wind, Droplets } from 'lucide-react';

interface DashboardProps {
  userProfile: UserProfile;
  airQualityData: AirQualityData;
  pollenData: PollenData;
  weatherData: WeatherData;
}

const Dashboard = ({ userProfile, airQualityData, pollenData, weatherData }: DashboardProps) => {
  const currentAQI = airQualityData.current.european_aqi;
  const aqiCategory = getAQICategory(currentAQI);
  
  // Process pollutants data
  const pollutants = {
    'PM2.5': getPollutantLevel('PM2.5', airQualityData.current.pm2_5),
    'PM10': getPollutantLevel('PM10', airQualityData.current.pm10),
    'NO₂': getPollutantLevel('NO₂', airQualityData.current.nitrogen_dioxide),
    'O₃': getPollutantLevel('O₃', airQualityData.current.ozone),
    'CO': getPollutantLevel('CO', convertCO(airQualityData.current.carbon_monoxide))
  };
  
  // Process pollen data
  const pollenLevels = mapPollenDataToUI(pollenData);
  const pollenRisk = calculatePollenRiskLevel(pollenLevels);
  
  // Process weather data
  const weatherCondition = getWeatherCondition(weatherData.current.weather_code);
  
  // Get recommendations
  const recommendations = getRecommendations(
    userProfile, 
    currentAQI, 
    pollenRisk.value, 
    weatherData.current.uv_index
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Votre tableau de bord</h2>
      
      <div className="mb-6 text-sm text-slate-500">{getCurrentDate()}</div>

      {/* Air Quality Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Qualité de l'air actuelle</h3>
              <div className="flex items-center">
                <span className={`font-semibold mr-2 ${aqiCategory.color}`}>
                  {aqiCategory.label}
                </span>
                <span className="text-sm text-slate-500">Indice: {currentAQI}</span>
              </div>
            </div>
            <div 
              className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-${aqiCategory.color.replace('aqi-', 'aqi-')}`}
            >
              {currentAQI}
            </div>
          </div>
          
          {/* AQI Scale */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${(currentAQI / 300) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>300+</span>
            </div>
          </div>
          
          {/* Pollutants */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Polluants</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(pollutants).map(([key, value]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-semibold">{value.value.toFixed(1)}</div>
                  <div className="text-xs text-slate-500">{key}</div>
                  <div className={`text-xs aqi-${value.level}`}>{value.status}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Two-Column Layout for Weather & Pollen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weather Summary Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Météo actuelle</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CloudSun className="text-amber-400 h-10 w-10 mr-4" />
                <div>
                  <div className="text-3xl font-semibold">{weatherData.current.temperature_2m}°C</div>
                  <div className="text-sm text-slate-500">{weatherCondition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">
                  Ressenti: {weatherData.current.apparent_temperature.toFixed(1)}°C
                </div>
                <div className="text-sm text-slate-500">
                  Humidité: {weatherData.current.relative_humidity_2m}%
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-slate-600">Vent</div>
                <div className="font-medium">{weatherData.current.wind_speed_10m} km/h</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="text-sm text-slate-600">Indice UV</div>
                <div className="font-medium">{weatherData.current.uv_index}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pollen Summary Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Niveaux de pollen</h3>
            
            <div className="space-y-3">
              {Object.entries(pollenLevels).map(([type, level]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{type}</span>
                    <span className={`text-xs font-medium text-${level.color}-500`}>{level.label}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${level.color}-500`} 
                      style={{ width: `${level.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recommendations Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            {userProfile === 'sensible' ? 'Recommandations Santé' : 'Recommandations Activités'}
          </h3>
          
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-slate-700">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
