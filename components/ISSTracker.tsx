import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLocale } from '../contexts/LocaleContext';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface ISSPass {
    time: string;
    duration: string;
    direction: string;
}

const ISSTracker: React.FC = () => {
    const { t } = useLocale();
    const [status, setStatus] = useState<Status>('idle');
    const [passes, setPasses] = useState<ISSPass[]>([]);
    const [errorMsg, setErrorMsg] = useState('');

    const generateMockPasses = (): ISSPass[] => {
        const mockPasses: ISSPass[] = [];
        const now = new Date();
        const fromDirections = ['NW', 'W', 'SW'];
        const toDirections = ['SE', 'E', 'NE'];
        for (let i = 0; i < 5; i++) {
            now.setHours(now.getHours() + Math.round(Math.random() * 5) + 8);
            now.setMinutes(now.getMinutes() + Math.round(Math.random() * 59));
            mockPasses.push({
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: `${Math.floor(Math.random() * 5) + 2} min`,
                direction: `${t('issTracker.from')} ${fromDirections[Math.floor(Math.random() * 3)]} ${t('issTracker.to')} ${toDirections[Math.floor(Math.random() * 3)]}`,
            });
        }
        return mockPasses;
    };

    const handleGetLocation = () => {
        setStatus('loading');
        setErrorMsg('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPasses(generateMockPasses());
                setStatus('success');
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMsg(t('issTracker.errorDenied'));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMsg(t('issTracker.errorUnavailable'));
                        break;
                    case error.TIMEOUT:
                        setErrorMsg(t('issTracker.errorTimeout'));
                        break;
                    default:
                        setErrorMsg(t('issTracker.errorUnknown'));
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
                        <p className="mt-4 text-gray-400">{t('issTracker.loading')}</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center h-48 flex flex-col justify-center items-center">
                        <p className="text-red-400 font-semibold">{t('issTracker.errorTitle')}</p>
                        <p className="text-gray-300 mt-2 max-w-xs">{errorMsg}</p>
                         <button onClick={handleGetLocation} className="mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            {t('issTracker.tryAgain')}
                        </button>
                    </div>
                );
            case 'success':
                return (
                    <div>
                         <h4 className="text-lg font-bold text-center text-white mb-4">{t('issTracker.successTitle')}</h4>
                        <ul className="space-y-3">
                           {passes.map((pass, index) => (
                                <li key={index} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center">
                                    <div className="font-bold text-purple-300 text-lg">{pass.time}</div>
                                    <div className="text-sm text-center text-gray-300">{pass.direction}</div>
                                    <div className="text-sm text-right text-gray-400">{pass.duration}</div>
                                </li>
                           ))}
                        </ul>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-48">
                        <p className="text-gray-300 mb-4 text-center max-w-xs">{t('issTracker.prompt')}</p>
                        <button onClick={handleGetLocation} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center space-x-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                             <span>{t('issTracker.button')}</span>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-6">{t('issTracker.title')}</h3>
            {renderContent()}
        </div>
    );
};

export default ISSTracker;
