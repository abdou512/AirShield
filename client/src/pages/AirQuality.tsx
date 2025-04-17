import { AirQualityData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getAQICategory, 
  getPollutantLevel, 
  getPollutantName, 
  getPollutantDescription, 
  getPollutantImpact,
  convertCO
} from '../lib/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AirQualityProps {
  airQualityData: AirQualityData;
}

const AirQuality = ({ airQualityData }: AirQualityProps) => {
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

  // Prepare data for AQI history chart (last 24 hours)
  const aqiChartData = airQualityData.hourly.time.slice(0, 24).map((time, index) => {
    return {
      time: new Date(time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      aqi: airQualityData.hourly.european_aqi[index]
    };
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Qualité de l'air</h2>
      
      {/* AQI Details */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Indice de qualité de l'air (AQI)</h3>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-5xl font-bold">{currentAQI}</div>
              <div className={aqiCategory.color + ' font-medium'}>
                {aqiCategory.label}
              </div>
              <p className="text-sm text-slate-600 mt-2">{aqiCategory.description}</p>
            </div>
            
            <div className="h-48 w-full md:w-1/3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aqiChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="AQI"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Échelle AQI</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-green-100 text-green-800 rounded-lg p-3 text-sm">
                <span className="font-medium">0-50:</span> Bon
              </div>
              <div className="bg-yellow-100 text-yellow-800 rounded-lg p-3 text-sm">
                <span className="font-medium">51-100:</span> Modéré
              </div>
              <div className="bg-orange-100 text-orange-800 rounded-lg p-3 text-sm">
                <span className="font-medium">101-150:</span> Mauvais pour groupes sensibles
              </div>
              <div className="bg-red-100 text-red-800 rounded-lg p-3 text-sm">
                <span className="font-medium">151+:</span> Mauvais à dangereux
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pollutants Details */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Détail des polluants</h3>
          
          <div className="space-y-6">
            {Object.entries(pollutants).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{getPollutantName(key)}</h4>
                    <p className="text-sm text-slate-500">{getPollutantDescription(key)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{value.value.toFixed(1)} {value.unit}</div>
                    <div className={`text-sm aqi-${value.level}`}>{value.status}</div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full bg-aqi-${value.level}`} 
                    style={{ width: `${value.percentage}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-slate-500">{getPollutantImpact(key)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Air Quality Map */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Carte de la qualité de l'air</h3>
          <div className="aspect-[16/9] bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-slate-400 mb-2 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                />
              </svg>
              <p className="text-sm text-slate-500">Carte des stations de mesure proches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirQuality;
