import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { generateBortleScaleInfo } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface BortleData {
    class: number;
    name: string;
    description: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const BortleScaleVisualizer: React.FC<{ bortleClass: number }> = ({ bortleClass }) => {
    const colors = [
        '#023047', // Class 1 (Dark Blue)
        '#023e8a', // Class 2
        '#0077b6', // Class 3
        '#00b4d8', // Class 4
        '#48cae4', // Class 5 (Light Blue)
        '#ffb703', // Class 6 (Yellow)
        '#fb8500', // Class 7
        '#f77f00', // Class 8
        '#d62828'  // Class 9 (Red)
    ];

    return (
        <div className="w-full max-w-lg mx-auto mt-4">
            <div className="flex rounded-full overflow-hidden border-2 border-gray-700">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex-1 h-5" style={{ backgroundColor: colors[i] }}></div>
                ))}
            </div>
            <div className="relative h-4 -mt-4">
                <div 
                    className="absolute top-1/2 -translate-y-1/2 transform transition-all duration-500 ease-out" 
                    style={{ left: `calc(${(bortleClass - 1) / 8 * 100}% - 8px)` }}
                >
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-900 shadow-lg"></div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white font-bold text-xs bg-gray-900/50 px-1.5 py-0.5 rounded-md">{bortleClass}</div>
                </div>
            </div>
        </div>
    );
};


const BortleScaleMeter: React.FC = () => {
    const { t, locale } = useLocale();
    const [status, setStatus] = useState<Status>('idle');
    const [bortleData, setBortleData] = useState<BortleData | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGetLocation = () => {
        setStatus('loading');
        setErrorMsg('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const data = await generateBortleScaleInfo(position.coords.latitude, position.coords.longitude, locale);
                    setBortleData(data);
                    setStatus('success');
                } catch (apiError) {
                    setErrorMsg(t('bortleScale.errorApi'));
                    setStatus('error');
                }
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMsg(t('milkyWayGuide.errorDenied')); // Re-use existing translation
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
                        <p className="mt-4 text-gray-400">{t('bortleScale.loading')}</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center h-48 flex flex-col justify-center items-center">
                        <p className="text-red-400 font-semibold">{t('bortleScale.errorTitle')}</p>
                        <p className="text-gray-300 mt-2 max-w-xs">{errorMsg}</p>
                         <button onClick={handleGetLocation} className="mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            {t('bortleScale.tryAgain')}
                        </button>
                    </div>
                );
            case 'success':
                if (!bortleData) return null;
                return (
                    <div className="text-center">
                        <h4 className="text-xl font-bold text-white">
                            {t('bortleScale.classLabel')}: <span className="text-purple-300">{bortleData.class} - {bortleData.name}</span>
                        </h4>
                        <BortleScaleVisualizer bortleClass={bortleData.class} />
                        <p className="text-gray-400 mt-8 max-w-3xl mx-auto text-left md:text-center">{bortleData.description}</p>
                    </div>
                );
            case 'idle':
            default:
                return (
                     <div className="flex flex-col items-center justify-center h-48">
                        <p className="text-gray-300 mb-4 text-center max-w-xs">{t('bortleScale.prompt')}</p>
                        <button onClick={handleGetLocation} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center space-x-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                             <span>{t('bortleScale.button')}</span>
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-6">{t('bortleScale.title')}</h3>
            {renderContent()}
        </div>
    );
};

export default BortleScaleMeter;
