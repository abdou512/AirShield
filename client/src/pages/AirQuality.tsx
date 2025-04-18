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

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useState } from 'react';

const getAQIColor = (level) => {
  switch (level) {
    case 'good': return "bg-green-400";   // Très faible
    case 'moderate': return "bg-yellow-400";  // Faible
    case 'poor': return "bg-orange-400";  // Modéré
    case 'very-poor': return "bg-red-500";     // Élevé
    case 'extremely-poor': return "bg-purple-600";  // Très élevé
    default: return "bg-gray-300";   // Par défaut
  }
};


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

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
                    className={`h-2 rounded-full ${getAQIColor(value.level)}`}
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
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Carte de la qualité de l'air
          </h3>

          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <MapContainer
              center={[36.75, 3.04]} // Alger par défaut
              zoom={11}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Exemples de stations */}
              <Marker position={[36.75, 3.04]}>
                <Popup>
                  Station d'Alger<br />
                  PM2.5: 45 µg/m³
                </Popup>
              </Marker>

              <Marker position={[36.77, 3.05]}>
                <Popup>
                  Station Bab El Oued<br />
                  PM2.5: 52 µg/m³
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirQuality;
