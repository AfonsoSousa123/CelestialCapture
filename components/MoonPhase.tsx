import React, { useState, useEffect } from 'react';
import { getMoonPhase, getNextMajorPhase } from '../utils/astro';
import { useLocale } from '../contexts/LocaleContext';

const MoonVisualizer: React.FC<{ phase: number }> = ({ phase }) => {
    const radius = 50;
    const diameter = 2 * radius;
    const center = radius;

    let path;
    const x = center + radius * Math.cos(2 * Math.PI * (phase - 0.5));
    const sweepFlag = phase > 0.5 ? 0 : 1;

    if (phase === 0) {
        path = `M ${center},0 A ${radius},${radius} 0 1,1 ${center},${diameter} A ${radius},${radius} 0 1,1 ${center},0 Z`;
    } else if (phase === 0.5) {
        path = `M ${center},0 A ${radius},${radius} 0 1,0 ${center},${diameter} A ${radius},${radius} 0 1,0 ${center},0 Z`;
    } else if (phase < 0.5) {
        path = `M ${center},0 A ${radius},${radius} 0 1,1 ${center},${diameter} A ${x},${radius} 0 0,${sweepFlag} ${center},0 Z`;
    } else {
        path = `M ${center},0 A ${radius},${radius} 0 1,0 ${center},${diameter} A ${x},${radius} 0 0,${sweepFlag} ${center},0 Z`;
    }

    return (
        <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <defs>
                <pattern id="dark-surface" patternUnits="userSpaceOnUse" width="100" height="100">
                    <rect width="100" height="100" fill="#374151" />
                    <circle cx="25" cy="30" r="8" fill="#2d3748" opacity="0.6" />
                    <circle cx="65" cy="70" r="12" fill="#2d3748" opacity="0.6" />
                </pattern>
                <pattern id="light-surface" patternUnits="userSpaceOnUse" width="100" height="100">
                    <rect width="100" height="100" fill="#E5E7EB" />
                    <circle cx="25" cy="30" r="8" fill="#d1d5db" opacity="0.7" />
                    <circle cx="65" cy="70" r="12" fill="#d1d5db" opacity="0.7" />
                </pattern>
                <mask id="moon-mask">
                    <path fill="white" d={path}></path>
                </mask>
            </defs>
            <circle cx="50" cy="50" r="49.5" fill="url(#dark-surface)" />
            <circle cx="50" cy="50" r="50" fill="url(#light-surface)" mask="url(#moon-mask)"></circle>
            <circle cx="50" cy="50" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"></circle>
        </svg>
    );
};

const getRatingColor = (ratingKey: string): string => {
    switch (ratingKey) {
        case 'excellent':
            return 'text-green-400';
        case 'good':
            return 'text-lime-400';
        case 'fair':
            return 'text-yellow-400';
        case 'poor':
        case 'challenging':
            return 'text-orange-400';
        default:
            return 'text-gray-300';
    }
}

const MoonPhase: React.FC = () => {
    const { t, locale } = useLocale();
    const [moonInfo, setMoonInfo] = useState(() => getMoonPhase(new Date(), t));
    const [nextPhaseInfo, setNextPhaseInfo] = useState(() => getNextMajorPhase(new Date(), t));

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setMoonInfo(getMoonPhase(now, t));
            setNextPhaseInfo(getNextMajorPhase(now, t));
        }, 60000);
        return () => clearInterval(interval);
    }, [t]);

    const viewingConditions = {
        stargazing: {
            rating: t(`moon.conditions.${moonInfo.ratingKey}.stargazing.rating`),
            ratingKey: t(`moon.conditions.${moonInfo.ratingKey}.stargazing.ratingKey`),
            description: t(`moon.conditions.${moonInfo.ratingKey}.stargazing.description`)
        },
        astrophotography: {
            rating: t(`moon.conditions.${moonInfo.ratingKey}.astrophotography.rating`),
            ratingKey: t(`moon.conditions.${moonInfo.ratingKey}.astrophotography.ratingKey`),
            description: t(`moon.conditions.${moonInfo.ratingKey}.astrophotography.description`)
        }
    };
    
    const formatNextPhaseDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (targetDate.getTime() === today.getTime()) return t('moon.tonight');
        if (targetDate.getTime() === tomorrow.getTime()) return t('moon.tomorrow');
        
        if (diffDays > 1 && diffDays <= 7) {
            return t('moon.inDays', { count: diffDays });
        }
        
        return t('moon.onDate', { date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }) });
    };

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10 flex flex-col md:flex-row md:items-start text-center max-w-sm md:max-w-5xl">
            <div className="flex flex-col items-center md:w-7/12 flex-shrink-0">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">{t('moon.title')}</h3>
                <MoonVisualizer phase={moonInfo.phaseValue} />
                <p className="text-xl font-semibold text-white mt-4">{moonInfo.phaseName}</p>
                <p className="text-gray-300">{t('moon.illumination')}: {moonInfo.illumination}%</p>

                <div className="mt-4 pt-4 border-t border-purple-800/50 w-full">
                    <p className="text-sm text-gray-400">{t('moon.nextPhase')}:</p>
                    <p className="text-lg text-purple-300 font-semibold">
                        {nextPhaseInfo.name}
                        <span className="text-gray-300 font-normal"> {formatNextPhaseDate(nextPhaseInfo.date)}</span>
                    </p>
                </div>
            </div>

            <div className="mt-6 md:mt-0 pt-4 md:pt-0 md:ml-6 md:pl-6 border-t md:border-t-0 md:border-l border-purple-800/50 w-full text-left">
                <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">{t('moon.conditionsTitle')}</h3>
                <div className="space-y-5">
                    <div className="flex items-start gap-4">
                        <span className="text-2xl" role="img" aria-label="telescope">🔭</span>
                        <div>
                            <p className="font-bold text-white">
                                {t('moon.stargazing')}: <span className={getRatingColor(viewingConditions.stargazing.ratingKey)}>{viewingConditions.stargazing.rating}</span>
                            </p>
                            <p className="text-sm text-gray-400">{viewingConditions.stargazing.description}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl" role="img" aria-label="camera">📷</span>
                        <div>
                            <p className="font-bold text-white">
                                {t('moon.astrophotography')}: <span className={getRatingColor(viewingConditions.astrophotography.ratingKey)}>{viewingConditions.astrophotography.rating}</span>
                            </p>
                            <p className="text-sm text-gray-400">{viewingConditions.astrophotography.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonPhase;