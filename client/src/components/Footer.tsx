import { UserProfile } from '../types';

interface FooterProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const Footer = ({ userProfile, setUserProfile }: FooterProps) => {
  const toggleProfile = () => {
    setUserProfile(userProfile === 'sensible' ? 'public' : 'sensible');
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Données fournies par Open-Meteo
          </div>
          <div className="text-sm">
            <button 
              onClick={toggleProfile} 
              className="text-blue-600 hover:text-blue-800"
            >
              Changer de profil
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
