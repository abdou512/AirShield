import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Position {
  latitude: number;
  longitude: number;
}

interface GeolocationHook {
  position: Position | null;
  locationName: string;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationHook {
  const [position, setPosition] = useState<Position | null>(null);
  const [locationName, setLocationName] = useState('Chargement...');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      setLoading(false);
      toast({
        title: 'Géolocalisation non supportée',
        description: 'La géolocalisation n\'est pas supportée par votre navigateur',
        variant: 'destructive'
      });
      // Default fallback to Paris
      setPosition({ latitude: 48.8566, longitude: 2.3522 });
      setLocationName('Paris, France');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ latitude, longitude });

        // Reverse geocoding to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=fr`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || data.address.county || '';
            const country = data.address.country || '';
            
            let locationString = city;
            if (city && country) {
              locationString = `${city}, ${country}`;
            } else if (state && country) {
              locationString = `${state}, ${country}`;
            } else if (country) {
              locationString = country;
            }
            
            setLocationName(locationString);
          } else {
            setLocationName('Position actuelle');
          }
        } catch (err) {
          console.error('Error fetching location name:', err);
          setLocationName('Position actuelle');
        }
        
        setLoading(false);
      },
      (err) => {
        setError(`Erreur de géolocalisation: ${err.message}`);
        console.error(err);
        setLoading(false);
        toast({
          title: 'Erreur de géolocalisation',
          description: 'Impossible d\'obtenir votre position. Utilisation de la position par défaut.',
          variant: 'destructive'
        });
        // Default fallback to Paris
        setPosition({ latitude: 48.8566, longitude: 2.3522 });
        setLocationName('Paris, France');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [toast]);

  return { position, locationName, error, loading };
}
