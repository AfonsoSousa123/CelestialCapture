import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { generateCelestialEvents } from '../services/geminiService';
import CelestialEventsSkeleton from './CelestialEventsSkeleton';

interface CelestialEvent {
    name: string;
    date: string;
    description: string;
}

const CelestialEvents: React.FC = () => {
    const { t, locale } = useLocale();
    const [events, setEvents] = useState<CelestialEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedEvents = await generateCelestialEvents(locale);
                setEvents(fetchedEvents);
            } catch (err) {
                setError(t('celestialEvents.error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [locale, t]);

    const renderContent = () => {
        if (isLoading) {
            return <CelestialEventsSkeleton />;
        }

        if (error) {
            return <p className="text-center text-red-400">{error}</p>;
        }

        if (events.length === 0) {
            return <p className="text-center text-gray-400">{t('celestialEvents.noEvents')}</p>;
        }

        return (
            <ul className="space-y-4">
                {events.map((event, index) => (
                    <li key={index} className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-lg font-bold text-purple-300">{event.name}</h4>
                        <p className="text-sm font-semibold text-gray-400 mb-2">{event.date}</p>
                        <p className="text-sm text-gray-300">{event.description}</p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-8">{t('celestialEvents.title')}</h3>
            {renderContent()}
        </div>
    );
};

export default CelestialEvents;
