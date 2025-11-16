import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface Planet {
    name: string;
    emoji: string;
    status: string;
    location: string;
}

const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('evening') || lowerStatus.includes('noite') || lowerStatus.includes('morning') || lowerStatus.includes('manhã')) return 'text-green-400';
    if (lowerStatus.includes('difficult') || lowerStatus.includes('difícil') || lowerStatus.includes('binoculars') || lowerStatus.includes('binóculos')) return 'text-yellow-400';
    if (lowerStatus.includes('not visible') || lowerStatus.includes('não visível') || lowerStatus.includes('telescope') || lowerStatus.includes('telescópio')) return 'text-red-400';
    return 'text-gray-300';
}

const PlanetVisibility: React.FC = () => {
    const { t } = useLocale();
    const planetsData = t('whatsUp.planets.list');
    const planets = Array.isArray(planetsData) ? planetsData as Planet[] : [];

    return (
        <section>
            <h4 className="text-2xl font-bold text-purple-300 mb-4 text-center md:text-left">{t('whatsUp.planets.title')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {planets.map((planet) => (
                    <div key={planet.name} className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3" role="img" aria-label={`${planet.name} symbol`}>{planet.emoji}</span>
                            <h5 className="text-lg font-bold text-white">{planet.name}</h5>
                        </div>
                        <p className={`text-sm font-semibold ${getStatusColor(planet.status)}`}>{planet.status}</p>
                        <p className="text-xs text-gray-400 mt-1">{planet.location}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PlanetVisibility;