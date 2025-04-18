export type UserProfile = 'sensible' | 'public';

export interface AirQualityData {
  current: {
    european_aqi: number;
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    ozone: number;
  };
  hourly: {
    time: string[];
    european_aqi: number[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    nitrogen_dioxide: number[];
    ozone: number[];
  };
}

export interface PollenData {
  daily: {
    time: string[];
    alder_pollen: number[];
    birch_pollen: number[];
    grass_pollen: number[];
    mugwort_pollen: number[];
    olive_pollen: number[];
    ragweed_pollen: number[];
  };
}

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    pressure_msl: number;
    uv_index: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    uv_index_max: number[];
  };
}

export interface HistoricalData {
  aqi: {
    date: string;
    value: number;
  }[];
  pollen: {
    date: string;
    value: number;
  }[];
  weather: {
    date: string;
    temp: number;
    humidity: number;
  }[];
}

export interface Pollutant {
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'very-poor' | 'extremely-poor';
  status: string;
  percentage: number;
}

export interface Pollutants {
  'PM2.5': Pollutant;
  'PM10': Pollutant;
  'NO₂': Pollutant;
  'O₃': Pollutant;
  'CO': Pollutant;
}

export interface PollenLevel {
  label: string;
  color: string;
  percentage: number;
}

export interface PollenLevels {
  Bouleau: PollenLevel;
  Graminées: PollenLevel;
  Armoise: PollenLevel;
  Ambroisie: PollenLevel;
  Olivier: PollenLevel;
  Aulne: PollenLevel;
}

export interface PollenRisk {
  value: number;
  label: string;
  color: string;
  advice: string;
}

export interface AirQualityLevel {
  label: string;
  color: string;
  description: string;
}

export interface AirQualityLevels {
  [key: number]: AirQualityLevel;
}

export interface DayForecast {
  name: string;
  date: string;
  temp: {
    max: number;
    min: number;
  };
  pollenLevel: {
    label: string;
    color: string;
  };
  weatherCode: number;
}
