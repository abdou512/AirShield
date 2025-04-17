interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`py-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tableau de bord
          </button>
          <button 
            onClick={() => setActiveTab('air')} 
            className={`py-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'air' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Qualité de l'air
          </button>
          <button 
            onClick={() => setActiveTab('pollen')} 
            className={`py-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'pollen' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pollens
          </button>
          <button 
            onClick={() => setActiveTab('weather')} 
            className={`py-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'weather' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Météo
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`py-4 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'history' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Historique
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
