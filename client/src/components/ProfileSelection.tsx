import { Users, Stethoscope } from 'lucide-react';
import { UserProfile } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileSelectionProps {
  setUserProfile: (profile: UserProfile) => void;
}

const ProfileSelection = ({ setUserProfile }: ProfileSelectionProps) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Choisissez votre profil</h2>
          <p className="text-slate-600 mb-6 text-center">Sélectionnez un profil pour personnaliser votre expérience</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setUserProfile('sensible')} 
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-between transition duration-150"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Stethoscope className="text-blue-500 h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-slate-800">Mode Sensible</h3>
                  <p className="text-sm text-slate-600">Pour les personnes avec des sensibilités respiratoires</p>
                </div>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-slate-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
            
            <button 
              onClick={() => setUserProfile('public')} 
              className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg flex items-center justify-between transition duration-150"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Users className="text-green-500 h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-slate-800">Mode Grand Public</h3>
                  <p className="text-sm text-slate-600">Pour les sportifs, familles et voyageurs</p>
                </div>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-slate-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSelection;
