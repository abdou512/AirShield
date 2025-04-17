import { PollenData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  mapPollenDataToUI, 
  calculatePollenRiskLevel,
  getNextSevenDays
} from '../lib/helpers';
import { CheckIcon } from 'lucide-react';

interface PollenProps {
  pollenData: PollenData;
}

const Pollen = ({ pollenData }: PollenProps) => {
  const pollenLevels = mapPollenDataToUI(pollenData);
  const pollenRisk = calculatePollenRiskLevel(pollenLevels);
  const nextSevenDays = getNextSevenDays();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Niveaux de pollen</h2>
      
      {/* Today's Pollen Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Niveaux actuels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pollen Levels */}
            <div>
              <div className="space-y-4">
                {Object.entries(pollenLevels).map(([type, level]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700">{type}</span>
                      <span className={`text-sm font-medium text-${level.color}-500`}>{level.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-${level.color}-500`} 
                        style={{ width: `${level.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overall Risk */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Risque global d'allergie</h4>
              
              <div className="flex items-center mb-4">
                <div 
                  className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-${pollenRisk.color}-500`}
                >
                  <span>{pollenRisk.value}</span>
                </div>
                <div className="ml-4">
                  <div className={`font-medium text-${pollenRisk.color}-500`}>{pollenRisk.label}</div>
                  <div className="text-sm text-slate-500">Échelle de 1 à 5</div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600">{pollenRisk.advice}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pollen Calendar & Forecast */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Prévisions des pollens</h3>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-7 gap-2">
                {nextSevenDays.map((day) => (
                  <div key={day.date} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium">{day.name}</div>
                    <div className="text-xs text-slate-500">{day.date}</div>
                    <div className="my-2">
                      <span 
                        className={`inline-block h-3 w-3 rounded-full bg-${day.pollenLevel.color}-500`}
                      ></span>
                    </div>
                    <div className={`text-xs text-${day.pollenLevel.color}-500`}>{day.pollenLevel.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Allergen Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Informations sur les allergènes</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Conseils pour les personnes allergiques</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex">
                  <CheckIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Surveillez les prévisions de pollen quotidiennement</span>
                </li>
                <li className="flex">
                  <CheckIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Gardez les fenêtres fermées pendant les périodes de forte concentration</span>
                </li>
                <li className="flex">
                  <CheckIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Changez de vêtements et lavez-vous les cheveux après être resté dehors</span>
                </li>
                <li className="flex">
                  <CheckIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Utilisez un purificateur d'air avec filtre HEPA à l'intérieur</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Principaux allergènes</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <h5 className="font-medium mb-1">Bouleau</h5>
                  <p className="text-xs text-slate-600">Saison: Mars à Mai</p>
                  <p className="text-xs text-slate-600">Symptômes: Rhinite, conjonctivite</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <h5 className="font-medium mb-1">Graminées</h5>
                  <p className="text-xs text-slate-600">Saison: Mai à Juillet</p>
                  <p className="text-xs text-slate-600">Symptômes: Rhinite, asthme</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <h5 className="font-medium mb-1">Ambroisie</h5>
                  <p className="text-xs text-slate-600">Saison: Août à Octobre</p>
                  <p className="text-xs text-slate-600">Symptômes: Rhinite, asthme sévère</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pollen;
