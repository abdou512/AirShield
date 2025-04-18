import { AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  message: string;
}

const AlertBanner = ({ message }: AlertBannerProps) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
