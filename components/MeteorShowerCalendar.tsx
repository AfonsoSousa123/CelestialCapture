import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface Shower {
    name: string;
    peak: string;
    rate: string;
    moon: string;
}

const MeteorShowerCalendar: React.FC = () => {
    const { t } = useLocale();
    const showersData = t('whatsUp.meteors.list');
    const showers = Array.isArray(showersData) ? showersData as Shower[] : [];

    return (
        <section>
            <h4 className="text-2xl font-bold text-purple-300 mb-4 text-center md:text-left">{t('whatsUp.meteors.title')}</h4>
            <ul className="space-y-3">
                {showers.map((shower) => (
                    <li key={shower.name} className="bg-gray-800/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h5 className="font-bold text-white">{shower.name}</h5>
                            <p className="text-sm text-gray-400">{t('whatsUp.meteors.peak')}: {shower.peak}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-left sm:text-right">
                            <p className="text-sm font-semibold text-purple-300">{shower.rate}</p>
                            <p className="text-xs text-gray-400">{t('whatsUp.meteors.moon')}: {shower.moon}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default MeteorShowerCalendar;