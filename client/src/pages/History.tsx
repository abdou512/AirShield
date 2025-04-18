import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getHistoricalData } from '../lib/api';
import { getAQICategory, getPollenLevel } from '../lib/helpers';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';

const History = () => {
  const [historicalData, setHistoricalData] = useState<any>(null);

  useEffect(() => {
    const data = getHistoricalData();
    setHistoricalData(data);
  }, []);

  if (!historicalData || 
      !historicalData.aqi.length || 
      !historicalData.pollen.length || 
      !historicalData.weather.length) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Historique</h2>
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-slate-500">Pas encore de données historiques disponibles. Les données seront enregistrées automatiquement lorsque vous consulterez l'application.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format dates for better display
  const formatChartData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }));
  };

  const aqiChartData = formatChartData(historicalData.aqi);
  const pollenChartData = formatChartData(historicalData.pollen);

  // Combined data for the table display
  const tableData = historicalData.aqi.map((aqiItem: any) => {
    const matchingPollen = historicalData.pollen.find((p: any) => p.date === aqiItem.date);
    const matchingWeather = historicalData.weather.find((w: any) => w.date === aqiItem.date);
    
    let pollenLabel = 'Inconnu';
    if (matchingPollen) {
      const level = getPollenLevel(matchingPollen.value);
      pollenLabel = level.label;
    }
    
    return {
      date: aqiItem.date,
      formattedDate: new Date(aqiItem.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      aqi: aqiItem.value,
      aqiCategory: getAQICategory(aqiItem.value).label,
      aqiColor: getAQICategory(aqiItem.value).color,
      pollen: pollenLabel,
      temp: matchingWeather ? matchingWeather.temp : 'N/A',
      humidity: matchingWeather ? matchingWeather.humidity : 'N/A'
    };
  }).sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Historique</h2>
      
      {/* AQI History */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Qualité de l'air des 7 derniers jours</h3>
          <div className="aspect-[16/9] bg-slate-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aqiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Indice AQI" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Pollen History */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Niveaux de pollen des 7 derniers jours</h3>
          <div className="aspect-[16/9] bg-slate-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollenChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#10b981" 
                  name="Niveau de pollen" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Données historiques</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">AQI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pollen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Température</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Humidité</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {tableData.map((day: any) => (
                  <tr key={day.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {day.formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          day.aqi <= 40 ? 'bg-green-100 text-green-800' :
                          day.aqi <= 70 ? 'bg-yellow-100 text-yellow-800' :
                          day.aqi <= 100 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {day.aqi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          day.pollen === 'Très faible' || day.pollen === 'Faible' ? 'bg-green-100 text-green-800' :
                          day.pollen === 'Modéré' ? 'bg-yellow-100 text-yellow-800' :
                          day.pollen === 'Élevé' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {day.pollen}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {typeof day.temp === 'number' ? `${day.temp}°C` : day.temp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {typeof day.humidity === 'number' ? `${day.humidity}%` : day.humidity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
