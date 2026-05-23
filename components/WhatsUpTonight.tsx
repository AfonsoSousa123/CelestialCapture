import React, { useState } from 'react';
import PlanetVisibility from './PlanetVisibility';
import MeteorShowerCalendar from './MeteorShowerCalendar';
import { useLocale } from '../contexts/LocaleContext';
import { generateWhatsUpTonight } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const WhatsUpTonight: React.FC = () => {
  const { t, locale } = useLocale();
  const [dynamicData, setDynamicData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDynamicData = () => {
    setLoading(true);
    setErrorMsg(null);
    if (!navigator.geolocation) {
        setErrorMsg(t('milkyWayGuide.errorUnavailable') || "Location unavailable.");
        setLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const data = await generateWhatsUpTonight(position.coords.latitude, position.coords.longitude, locale);
                setDynamicData(data);
                setLoading(false);
            } catch (err) {
                setErrorMsg(t('milkyWayGuide.errorApi') || "Could not fetch data.");
                setLoading(false);
            }
        },
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setErrorMsg(t('milkyWayGuide.errorDenied') || "Location denied.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    setErrorMsg(t('milkyWayGuide.errorUnavailable') || "Location unavailable.");
                    break;
                case error.TIMEOUT:
                    setErrorMsg(t('milkyWayGuide.errorTimeout') || "Location timeout.");
                    break;
                default:
                    setErrorMsg(t('milkyWayGuide.errorUnknown') || "Unknown error.");
            }
            setLoading(false);
        }
    );
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="text-3xl font-bold text-center text-white flex-1">{t('whatsUp.title')}</h3>
        
        {!dynamicData && !loading && (
             <button 
                onClick={fetchDynamicData}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap"
            >
                {t('milkyWayGuide.button')}
            </button>
        )}
        {loading && <div className="px-4"><LoadingSpinner /></div>}
      </div>

      {errorMsg && (
          <div className="text-red-400 text-center mb-6">{errorMsg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <PlanetVisibility data={dynamicData?.planets} />
        <MeteorShowerCalendar data={dynamicData?.meteors} />
      </div>
    </div>
  );
};

export default WhatsUpTonight;