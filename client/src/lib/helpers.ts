import { Pollutant, PollenLevel, AirQualityLevel, DayForecast } from '../types';

// Format current date and time
export function getCurrentDate(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date().toLocaleDateString('fr-FR', options);
}

// Get AQI category based on value
export function getAQICategory(value: number): AirQualityLevel {
  if (value <= 20) {
    return { 
      label: 'Très bonne', 
      color: 'aqi-good',
      description: 'La qualité de l\'air est excellente. Profitez de vos activités en plein air.'
    };
  } else if (value <= 40) {
    return { 
      label: 'Bonne', 
      color: 'aqi-good',
      description: 'La qualité de l\'air est considérée comme satisfaisante, et la pollution de l\'air pose peu ou pas de risque.'
    };
  } else if (value <= 60) {
    return { 
      label: 'Moyenne', 
      color: 'aqi-moderate',
      description: 'La qualité de l\'air est acceptable. Certains polluants peuvent toutefois avoir un effet modéré sur la santé d\'un très petit nombre de personnes particulièrement sensibles.'
    };
  } else if (value <= 80) {
    return { 
      label: 'Médiocre', 
      color: 'aqi-poor',
      description: 'Les personnes sensibles peuvent ressentir des effets. Le grand public n\'est pas susceptible d\'être affecté.'
    };
  } else if (value <= 100) {
    return { 
      label: 'Mauvaise', 
      color: 'aqi-very-poor',
      description: 'Tout le monde peut commencer à ressentir des effets sur la santé; les personnes sensibles peuvent ressentir des effets plus graves.'
    };
  } else {
    return { 
      label: 'Très mauvaise', 
      color: 'aqi-extremely-poor',
      description: 'Alerte sanitaire : tout le monde peut ressentir des effets sanitaires plus graves.'
    };
  }
}

// Get pollutant level based on value
export function getPollutantLevel(pollutant: string, value: number): Pollutant {
  let level: 'good' | 'moderate' | 'poor' | 'very-poor' | 'extremely-poor' = 'good';
  let status = 'Faible';
  let percentage = 0;

  if (pollutant === 'PM2.5') {
    if (value <= 10) {
      level = 'good';
      status = 'Faible';
      percentage = (value / 25) * 100;
    } else if (value <= 20) {
      level = 'moderate';
      status = 'Modéré';
      percentage = (value / 25) * 100;
    } else if (value <= 25) {
      level = 'poor';
      status = 'Élevé';
      percentage = (value / 25) * 100;
    } else if (value <= 50) {
      level = 'very-poor';
      status = 'Très élevé';
      percentage = 100;
    } else {
      level = 'extremely-poor';
      status = 'Dangereux';
      percentage = 100;
    }
  } else if (pollutant === 'PM10') {
    if (value <= 20) {
      level = 'good';
      status = 'Faible';
      percentage = (value / 50) * 100;
    } else if (value <= 40) {
      level = 'moderate';
      status = 'Modéré';
      percentage = (value / 50) * 100;
    } else if (value <= 50) {
      level = 'poor';
      status = 'Élevé';
      percentage = (value / 50) * 100;
    } else if (value <= 100) {
      level = 'very-poor';
      status = 'Très élevé';
      percentage = 100;
    } else {
      level = 'extremely-poor';
      status = 'Dangereux';
      percentage = 100;
    }
  } else if (pollutant === 'NO₂') {
    if (value <= 40) {
      level = 'good';
      status = 'Faible';
      percentage = (value / 100) * 100;
    } else if (value <= 70) {
      level = 'moderate';
      status = 'Modéré';
      percentage = (value / 100) * 100;
    } else if (value <= 100) {
      level = 'poor';
      status = 'Élevé';
      percentage = (value / 100) * 100;
    } else if (value <= 200) {
      level = 'very-poor';
      status = 'Très élevé';
      percentage = 100;
    } else {
      level = 'extremely-poor';
      status = 'Dangereux';
      percentage = 100;
    }
  } else if (pollutant === 'O₃') {
    if (value <= 60) {
      level = 'good';
      status = 'Faible';
      percentage = (value / 120) * 100;
    } else if (value <= 100) {
      level = 'moderate';
      status = 'Modéré';
      percentage = (value / 120) * 100;
    } else if (value <= 120) {
      level = 'poor';
      status = 'Élevé';
      percentage = (value / 120) * 100;
    } else if (value <= 180) {
      level = 'very-poor';
      status = 'Très élevé';
      percentage = 100;
    } else {
      level = 'extremely-poor';
      status = 'Dangereux';
      percentage = 100;
    }
  } else if (pollutant === 'CO') {
    if (value <= 4400) {
      level = 'good';
      status = 'Faible';
      percentage = (value / 10000) * 100;
    } else if (value <= 7000) {
      level = 'moderate';
      status = 'Modéré';
      percentage = (value / 10000) * 100;
    } else if (value <= 10000) {
      level = 'poor';
      status = 'Élevé';
      percentage = (value / 10000) * 100;
    } else if (value <= 15000) {
      level = 'very-poor';
      status = 'Très élevé';
      percentage = 100;
    } else {
      level = 'extremely-poor';
      status = 'Dangereux';
      percentage = 100;
    }
  }

  return {
    value,
    unit: pollutant === 'CO' ? 'µg/m³' : 'µg/m³',
    level,
    status,
    percentage
  };
}

// Get pollen level based on value (0-1: Low, 2-3: Moderate, 4-5: High)
export function getPollenLevel(value: number): PollenLevel {
  if (value <= 1) {
    return {
      label: 'Très faible',
      color: 'green',
      percentage: 10
    };
  } else if (value <= 2) {
    return {
      label: 'Faible',
      color: 'green',
      percentage: 25
    };
  } else if (value <= 3) {
    return {
      label: 'Modéré',
      color: 'yellow',
      percentage: 50
    };
  } else if (value <= 4) {
    return {
      label: 'Élevé',
      color: 'orange',
      percentage: 75
    };
  } else {
    return {
      label: 'Très élevé',
      color: 'red',
      percentage: 100
    };
  }
}

// Get UV index label
export function getUVIndexLabel(index: number): string {
  if (index <= 2) return 'Faible';
  if (index <= 5) return 'Modéré';
  if (index <= 7) return 'Élevé';
  if (index <= 10) return 'Très élevé';
  return 'Extrême';
}

// Get UV protection tips
export function getUVProtectionTips(index: number): string[] {
  const baseTips = [
    'Portez des lunettes de soleil qui protègent contre les rayons UVA et UVB'
  ];
  
  if (index <= 2) {
    return [
      ...baseTips,
      'Aucune protection spécifique nécessaire pour la plupart des personnes'
    ];
  }
  
  if (index <= 5) {
    return [
      ...baseTips,
      'Appliquez un écran solaire SPF 30+ toutes les 2 heures',
      'Portez des vêtements de protection si vous restez dehors longtemps'
    ];
  }
  
  return [
    ...baseTips,
    'Appliquez un écran solaire SPF 50+ toutes les 2 heures',
    'Portez un chapeau à larges bords et des vêtements de protection',
    'Cherchez l\'ombre entre 10h et 16h',
    'Limitez le temps d\'exposition au soleil'
  ];
}

// Get recommendations based on user profile
export function getRecommendations(
  userProfile: string,
  airQuality: number,
  pollenLevel: number,
  uvIndex: number
): string[] {
  if (userProfile === 'sensible') {
    const recommendations = [];
    
    // Air quality recommendations
    if (airQuality > 60) {
      recommendations.push('Limitez les activités en extérieur prolongées aujourd\'hui en raison de la qualité de l\'air');
    }
    
    // Pollen recommendations
    if (pollenLevel >= 3) {
      recommendations.push('Gardez vos médicaments antiallergiques à portée de main');
      recommendations.push('Fermez les fenêtres pendant les heures de pointe de pollen (matin et début de soirée)');
      recommendations.push('Rincez-vous les cheveux avant de vous coucher pour éliminer le pollen');
    }
    
    // UV recommendations
    if (uvIndex > 5) {
      recommendations.push('Évitez l\'exposition directe au soleil entre 10h et 16h');
    }
    
    // General recommendations
    recommendations.push('Surveillez vos symptômes respiratoires et consultez votre médecin si nécessaire');
    
    return recommendations;
  } else {
    const recommendations = [];
    
    // Air quality recommendations
    if (airQuality <= 40) {
      recommendations.push('Conditions favorables pour des activités en extérieur');
    } else if (airQuality <= 80) {
      recommendations.push('Conditions modérées pour des activités en extérieur, restez attentif');
    } else {
      recommendations.push('Limitez les activités intenses en extérieur aujourd\'hui');
    }
    
    // UV recommendations
    if (uvIndex > 5) {
      recommendations.push('Le niveau d\'UV est élevé, appliquez de la protection solaire');
    }
    
    // Weather recommendations
    recommendations.push('Hydratez-vous régulièrement au cours de la journée');
    
    // Pollen awareness
    if (pollenLevel >= 3) {
      recommendations.push('Soyez attentif aux personnes sensibles au pollen qui vous accompagnent');
    }
    
    return recommendations;
  }
}

// Get next seven days for forecasts
export function getNextSevenDays(): DayForecast[] {
  const days = [];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const date = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date();
    nextDate.setDate(date.getDate() + i);
    
    days.push({
      name: dayNames[nextDate.getDay()],
      date: `${nextDate.getDate().toString().padStart(2, '0')}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}`,
      temp: {
        max: Math.round(18 + Math.random() * 10),
        min: Math.round(12 + Math.random() * 5)
      },
      pollenLevel: {
        label: ['Faible', 'Modéré', 'Élevé'][Math.floor(Math.random() * 3)],
        color: ['green', 'yellow', 'orange'][Math.floor(Math.random() * 3)]
      },
      weatherCode: Math.floor(Math.random() * 3)
    });
  }
  
  return days;
}

// Get pollutant name
export function getPollutantName(key: string): string {
  const names: Record<string, string> = {
    'PM2.5': 'Particules fines (PM2.5)',
    'PM10': 'Particules grossières (PM10)',
    'NO₂': 'Dioxyde d\'azote (NO₂)',
    'O₃': 'Ozone (O₃)',
    'CO': 'Monoxyde de carbone (CO)'
  };
  return names[key] || key;
}

// Get pollutant description
export function getPollutantDescription(key: string): string {
  const descriptions: Record<string, string> = {
    'PM2.5': 'Particules de diamètre inférieur à 2,5 micromètres',
    'PM10': 'Particules de diamètre entre 2,5 et 10 micromètres',
    'NO₂': 'Gaz irritant émis principalement par les véhicules et l\'industrie',
    'O₃': 'Polluant secondaire formé par réaction chimique',
    'CO': 'Gaz inodore provenant de combustion incomplète'
  };
  return descriptions[key] || '';
}

// Get pollutant health impact
export function getPollutantImpact(key: string): string {
  const impacts: Record<string, string> = {
    'PM2.5': 'Impact sur la santé: Peut pénétrer profondément dans les poumons et le sang, causant problèmes respiratoires et cardiovasculaires.',
    'PM10': 'Impact sur la santé: Peut irriter les voies respiratoires et aggraver l\'asthme et les allergies.',
    'NO₂': 'Impact sur la santé: Peut causer une inflammation des voies respiratoires et réduire la fonction pulmonaire.',
    'O₃': 'Impact sur la santé: Peut causer des problèmes respiratoires, une irritation des yeux et aggraver l\'asthme.',
    'CO': 'Impact sur la santé: Se lie à l\'hémoglobine, réduisant la capacité du sang à transporter l\'oxygène.'
  };
  return impacts[key] || '';
}

// Get weather condition text from weather code
export function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes (WW)
  const weatherCodes: Record<number, string> = {
    0: 'Ensoleillé',
    1: 'Principalement ensoleillé',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine modérée',
    55: 'Bruine intense',
    56: 'Bruine verglaçante légère',
    57: 'Bruine verglaçante dense',
    61: 'Pluie légère',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    66: 'Pluie verglaçante légère',
    67: 'Pluie verglaçante forte',
    71: 'Neige légère',
    73: 'Neige modérée',
    75: 'Neige forte',
    77: 'Grésil',
    80: 'Averses de pluie légères',
    81: 'Averses de pluie modérées',
    82: 'Averses de pluie violentes',
    85: 'Averses de neige légères',
    86: 'Averses de neige fortes',
    95: 'Orage',
    96: 'Orage avec grêle légère',
    99: 'Orage avec grêle forte'
  };
  
  return weatherCodes[code] || 'Inconnu';
}

// Convert CO from mg/m³ to µg/m³
export function convertCO(value: number): number {
  return value * 1000; // 1 mg/m³ = 1000 µg/m³
}

// Map pollen data from API to UI format
export function mapPollenDataToUI(pollenData: PollenData): Record<string, PollenLevel> {
  if (!pollenData || !pollenData.daily) {
    return {
      'Bouleau': getPollenLevel(0),
      'Graminées': getPollenLevel(0),
      'Armoise': getPollenLevel(0),
      'Ambroisie': getPollenLevel(0),
      'Olivier': getPollenLevel(0),
      'Aulne': getPollenLevel(0)
    };
  }
  
  const currentIndex = 0; // Use the most recent data
  
  return {
    'Bouleau': getPollenLevel(pollenData.daily.birch_pollen[currentIndex] || 0),
    'Graminées': getPollenLevel(pollenData.daily.grass_pollen[currentIndex] || 0),
    'Armoise': getPollenLevel(pollenData.daily.mugwort_pollen[currentIndex] || 0),
    'Ambroisie': getPollenLevel(pollenData.daily.ragweed_pollen[currentIndex] || 0),
    'Olivier': getPollenLevel(pollenData.daily.olive_pollen[currentIndex] || 0),
    'Aulne': getPollenLevel(pollenData.daily.alder_pollen[currentIndex] || 0)
  };
}

// Calculate average pollen level for storage
export function calculateAveragePollenLevel(pollenData: PollenData): number {
  if (!pollenData || !pollenData.daily) {
    return 0;
  }
  
  const currentIndex = 0;
  const pollenTypes = [
    pollenData.daily.alder_pollen[currentIndex] || 0,
    pollenData.daily.birch_pollen[currentIndex] || 0,
    pollenData.daily.grass_pollen[currentIndex] || 0,
    pollenData.daily.mugwort_pollen[currentIndex] || 0,
    pollenData.daily.olive_pollen[currentIndex] || 0,
    pollenData.daily.ragweed_pollen[currentIndex] || 0
  ];
  
  return pollenTypes.reduce((sum, level) => sum + level, 0) / pollenTypes.length;
}

// Calculate pollen risk level
export function calculatePollenRiskLevel(pollenLevels: Record<string, PollenLevel>): {
  value: number;
  label: string;
  color: string;
  advice: string;
} {
  const levels = Object.values(pollenLevels).map(level => {
    switch (level.label) {
      case 'Très faible': return 1;
      case 'Faible': return 2;
      case 'Modéré': return 3;
      case 'Élevé': return 4;
      case 'Très élevé': return 5;
      default: return 1;
    }
  });
  
  const avgLevel = Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length);
  
  let label, color, advice;
  
  switch (avgLevel) {
    case 1:
      label = 'Très faible';
      color = 'green';
      advice = 'Le risque d\'allergie est très faible. Profitez de vos activités en extérieur.';
      break;
    case 2:
      label = 'Faible';
      color = 'green';
      advice = 'Le risque d\'allergie est faible. Les personnes très sensibles peuvent ressentir de légers symptômes.';
      break;
    case 3:
      label = 'Modéré';
      color = 'yellow';
      advice = 'Les personnes sensibles peuvent ressentir des symptômes. Pensez à prendre vos médicaments si vous êtes allergique.';
      break;
    case 4:
      label = 'Élevé';
      color = 'orange';
      advice = 'Risque élevé pour les personnes allergiques. Limitez l\'exposition en extérieur et prenez vos médicaments.';
      break;
    case 5:
      label = 'Très élevé';
      color = 'red';
      advice = 'Risque très élevé. Évitez l\'exposition en extérieur et consultez votre médecin si symptômes importants.';
      break;
    default:
      label = 'Modéré';
      color = 'yellow';
      advice = 'Les personnes sensibles peuvent ressentir des symptômes. Pensez à prendre vos médicaments si vous êtes allergique.';
  }
  
  return {
    value: avgLevel,
    label,
    color,
    advice
  };
}
