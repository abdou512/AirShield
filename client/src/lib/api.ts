import { AirQualityData, PollenData, WeatherData } from '../types';

export async function fetchAirQualityData(latitude: number, longitude: number): Promise<AirQualityData> {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`
  );
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données de qualité d'air: ${response.status}`);
  }
  
  return await response.json();
}

export async function fetchPollenData(latitude: number, longitude: number): Promise<PollenData> {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&daily=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`
  );
  console.log("response", response);
  
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données de pollen: ${response.status}`);
  }
  
  return await response.json();
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code,pressure_msl,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max&timezone=auto`
  );
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données météo: ${response.status}`);
  }
  
  return await response.json();
}

// Store historical data in localStorage
export function storeHistoricalData(
  aqi: number, 
  pollenAvg: number, 
  temperature: number, 
  humidity: number
) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get existing data
  const storedAQI = JSON.parse(localStorage.getItem('airInfoAQIHistory') || '[]');
  const storedPollen = JSON.parse(localStorage.getItem('airInfoPollenHistory') || '[]');
  const storedWeather = JSON.parse(localStorage.getItem('airInfoWeatherHistory') || '[]');
  
  // Check if we already have data for today
  const aqiExists = storedAQI.some((item: any) => item.date === today);
  const pollenExists = storedPollen.some((item: any) => item.date === today);
  const weatherExists = storedWeather.some((item: any) => item.date === today);
  
  // Add today's data if not already present
  if (!aqiExists) {
    storedAQI.push({ date: today, value: aqi });
    // Keep only the last 7 days
    if (storedAQI.length > 7) storedAQI.shift();
    localStorage.setItem('airInfoAQIHistory', JSON.stringify(storedAQI));
  }
  
  if (!pollenExists) {
    storedPollen.push({ date: today, value: pollenAvg });
    if (storedPollen.length > 7) storedPollen.shift();
    localStorage.setItem('airInfoPollenHistory', JSON.stringify(storedPollen));
  }
  
  if (!weatherExists) {
    storedWeather.push({ date: today, temp: temperature, humidity: humidity });
    if (storedWeather.length > 7) storedWeather.shift();
    localStorage.setItem('airInfoWeatherHistory', JSON.stringify(storedWeather));
  }
}

// Get historical data from localStorage
export function getHistoricalData() {
  return {
    aqi: JSON.parse(localStorage.getItem('airInfoAQIHistory') || '[]'),
    pollen: JSON.parse(localStorage.getItem('airInfoPollenHistory') || '[]'),
    weather: JSON.parse(localStorage.getItem('airInfoWeatherHistory') || '[]')
  };
}
