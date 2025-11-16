import React from 'react';
import PlanetVisibility from './PlanetVisibility';
import MeteorShowerCalendar from './MeteorShowerCalendar';
import { useLocale } from '../contexts/LocaleContext';

const WhatsUpTonight: React.FC = () => {
  const { t } = useLocale();
  return (
    <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
      <h3 className="text-3xl font-bold text-center text-white mb-8">{t('whatsUp.title')}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <PlanetVisibility />
        <MeteorShowerCalendar />
      </div>
    </div>
  );
};

export default WhatsUpTonight;