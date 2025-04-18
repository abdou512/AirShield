import { useState } from 'react';
import { UserProfile } from '../types';
import AlertBanner from './AlertBanner';
import Navigation from './Navigation';
import Dashboard from '../pages/Dashboard';
import AirQuality from '../pages/AirQuality';
import Pollen from '../pages/Pollen';
import Weather from '../pages/Weather';
import History from '../pages/History';
import { useGeolocation } from '../hooks/useGeolocation';
import { useQuery } from '@tanstack/react-query';
import { fetchAirQualityData, fetchPollenData, fetchWeatherData, storeHistoricalData } from '../lib/api';
import { calculateAveragePollenLevel, getAQICategory } from '../lib/helpers';
import { Skeleton } from '@/components/ui/skeleton';

interface MainContentProps {
  userProfile: UserProfile;
}

const MainContent = ({ userProfile }: MainContentProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { position, loading: locationLoading } = useGeolocation();
  
  // Data fetching for air quality
  const { 
    data: airQualityData, 
    error: airQualityError, 
    isLoading: airQualityLoading 
  } = useQuery({
    queryKey: ['airQuality', position?.latitude, position?.longitude],
    queryFn: () => position ? fetchAirQualityData(position.latitude, position.longitude) : Promise.reject('No position'),
    enabled: !!position,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Data fetching for pollen
  const { 
    data: pollenData, 
    error: pollenError, 
    isLoading: pollenLoading 
  } = useQuery({
    queryKey: ['pollen', position?.latitude, position?.longitude],
    queryFn: () => position ? fetchPollenData(position.latitude, position.longitude) : Promise.reject('No position'),
    enabled: !!position,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Data fetching for weather
  const { 
    data: weatherData, 
    error: weatherError, 
    isLoading: weatherLoading 
  } = useQuery({
    queryKey: ['weather', position?.latitude, position?.longitude],
    queryFn: () => position ? fetchWeatherData(position.latitude, position.longitude) : Promise.reject('No position'),
    enabled: !!position,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Save data to local storage for history
  const isDataLoaded = !airQualityLoading && !pollenLoading && !weatherLoading && 
                       airQualityData && pollenData && weatherData;

  if (isDataLoaded) {
    storeHistoricalData(
      airQualityData.current.european_aqi,
      calculateAveragePollenLevel(pollenData),
      weatherData.current.temperature_2m,
      weatherData.current.relative_humidity_2m
    );
  }

  // Determine if we have alerts to show
  const hasAlerts = airQualityData && 
    (airQualityData.current.european_aqi > 60 || (pollenData && calculateAveragePollenLevel(pollenData) >= 3));

  // Determine alert message
  let alertMessage = '';
  if (airQualityData && airQualityData.current.european_aqi > 60) {
    const category = getAQICategory(airQualityData.current.european_aqi);
    alertMessage = `Alerte qualité de l'air : Niveau ${category.label.toLowerCase()} aujourd'hui.`;
  } else if (pollenData && calculateAveragePollenLevel(pollenData) >= 3) {
    alertMessage = 'Alerte pollen : Niveau élevé de pollen aujourd\'hui. Prenez vos précautions.';
  }

  // Profile switch section
  const ProfileSwitch = () => (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <span className="text-sm font-medium">
          Mode : 
          <span 
            className={userProfile === 'sensible' ? 'text-blue-600 ml-1' : 'text-green-600 ml-1'}
          >
            {userProfile === 'sensible' ? 'Sensible' : 'Grand Public'}
          </span>
        </span>
      </div>
    </div>
  );

  // Loading placeholder
  if (locationLoading || airQualityLoading || pollenLoading || weatherLoading) {
    return (
      <div className="flex-grow">
        <ProfileSwitch />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-4 w-full mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (airQualityError || pollenError || weatherError) {
    return (
      <div className="flex-grow">
        <ProfileSwitch />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Erreur lors de la récupération des données. Veuillez réessayer ultérieurement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      <ProfileSwitch />
      
      {hasAlerts && <AlertBanner message={alertMessage} />}
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userProfile={userProfile}
            airQualityData={airQualityData}
            pollenData={pollenData}
            weatherData={weatherData}
          />
        )}
        
        {activeTab === 'air' && <AirQuality airQualityData={airQualityData} />}
        
        {activeTab === 'pollen' && <Pollen pollenData={pollenData} />}
        
        {activeTab === 'weather' && <Weather weatherData={weatherData} />}
        
        {activeTab === 'history' && <History />}
      </div>
    </main>
  );
};

export default MainContent;
