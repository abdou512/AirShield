import { RefreshCw, Wind } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { locationName, loading } = useGeolocation();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Wind className="text-blue-500 h-6 w-6 mr-2" />
          <h1 className="text-xl font-semibold text-blue-600">AirShield</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-slate-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span className="text-sm font-medium">
            {loading ? 'Chargement...' : locationName}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            className="text-blue-500 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
