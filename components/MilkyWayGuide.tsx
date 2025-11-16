import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { generateMilkyWayGuide } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface Season {
    title: string;
    months: string;
    description: string;
}

interface Condition {
    icon: string;
    title: string;
    description: string;
}

interface GuideData {
    intro: string;
    seasonalVisibilityTitle: string;
    seasons: Season[];
    keyConditionsTitle: string;
    conditions: Condition[];
}

type Status = 'idle' | 'loading' | 'success' | 'error';


const MilkyWayGuide: React.FC = () => {
    const { t, locale } = useLocale();
    const [status, setStatus] = useState<Status>('idle');
    const [guideData, setGuideData] = useState<GuideData | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGetLocation = () => {
        setStatus('loading');
        setErrorMsg('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const data = await generateMilkyWayGuide(position.coords.latitude, position.coords.longitude, locale);
                    setGuideData(data);
                    setStatus('success');
                } catch (apiError) {
                    setErrorMsg(t('milkyWayGuide.errorApi'));
                    setStatus('error');
                }
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMsg(t('milkyWayGuide.errorDenied'));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMsg(t('milkyWayGuide.errorUnavailable'));
                        break;
                    case error.TIMEOUT:
                        setErrorMsg(t('milkyWayGuide.errorTimeout'));
                        break;
                    default:
                        setErrorMsg(t('milkyWayGuide.errorUnknown'));
                        break;
                }
                setStatus('error');
            }
        );
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-48">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-400">{t('milkyWayGuide.loading')}</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center h-48 flex flex-col justify-center items-center">
                        <p className="text-red-400 font-semibold">{t('milkyWayGuide.errorTitle')}</p>
                        <p className="text-gray-300 mt-2 max-w-xs">{errorMsg}</p>
                         <button onClick={handleGetLocation} className="mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            {t('milkyWayGuide.tryAgain')}
                        </button>
                    </div>
                );
            case 'success':
                if (!guideData) return null;
                return (
                    <>
                        <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">{guideData.intro}</p>

                        <div className="mb-10">
                            <h4 className="text-2xl font-bold text-purple-300 mb-4 text-center">{guideData.seasonalVisibilityTitle}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {guideData.seasons.map((season) => (
                                    <div key={season.title} className="bg-gray-800/50 p-4 rounded-lg text-center">
                                        <p className="font-bold text-white">{season.title}</p>
                                        <p className="text-sm font-semibold text-purple-400 mb-2">{season.months}</p>
                                        <p className="text-xs text-gray-400">{season.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-2xl font-bold text-purple-300 mb-4 text-center">{guideData.keyConditionsTitle}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {guideData.conditions.map((condition) => (
                                    <div key={condition.title} className="text-center">
                                        <div className="text-4xl mb-2">{condition.icon}</div>
                                        <h5 className="text-lg font-bold text-white mb-1">{condition.title}</h5>
                                        <p className="text-sm text-gray-400">{condition.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
            case 'idle':
            default:
                return (
                     <div className="flex flex-col items-center justify-center h-48">
                        <p className="text-gray-300 mb-4 text-center max-w-xs">{t('milkyWayGuide.prompt')}</p>
                        <button onClick={handleGetLocation} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center space-x-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                             <span>{t('milkyWayGuide.button')}</span>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-6">{t('milkyWayGuide.title')}</h3>
            {renderContent()}
        </div>
    );
};

export default MilkyWayGuide;
