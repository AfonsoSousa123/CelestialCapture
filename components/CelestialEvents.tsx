import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { generateCelestialEvents } from '../services/geminiService';
import CelestialEventsSkeleton from './CelestialEventsSkeleton';
import { CelestialEvent } from '../types';

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
                
                // Client-side filtering to ensure no past events are shown
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const upcomingEvents = fetchedEvents.filter((event: CelestialEvent) => {
                    // Check against end date if available (for multi-day events), else start date
                    const dateToCheckStr = event.isoEndDate || event.isoDate;
                    if (!dateToCheckStr) return true;

                    const parts = dateToCheckStr.split('-');
                    if (parts.length === 3) {
                         const eventDate = new Date(
                            parseInt(parts[0], 10),
                            parseInt(parts[1], 10) - 1,
                            parseInt(parts[2], 10)
                        );
                        // Ensure event ends today or in the future
                        return eventDate >= today;
                    }
                    return true;
                });

                setEvents(upcomingEvents);
            } catch (err) {
                setError(t('celestialEvents.error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [locale, t]);

    const addToGoogleCalendar = (event: CelestialEvent) => {
        if (!event.isoDate) return;

        const parseDateParts = (dateStr: string) => {
            const parts = dateStr.split('-');
            return {
                y: parseInt(parts[0], 10),
                m: parseInt(parts[1], 10), // 1-indexed for string building, 0 for Date obj
                d: parseInt(parts[2], 10)
            };
        };

        const startDateParts = parseDateParts(event.isoDate);
        
        // Helper to format YYYYMMDD
        const formatDateStr = (y: number, m: number, d: number) => {
            return `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
        };

        // Helper to format HHMMSS
        const formatTimeStr = (timeStr: string) => {
            return timeStr.replace(':', '') + '00';
        };

        let datesString = '';
        
        if (event.startTime) {
            // Specific time event
            const startStr = `${formatDateStr(startDateParts.y, startDateParts.m, startDateParts.d)}T${formatTimeStr(event.startTime)}`;
            
            let endStr = '';
            if (event.endTime) {
                 let endDateParts = startDateParts;
                 if (event.isoEndDate) {
                     endDateParts = parseDateParts(event.isoEndDate);
                 }
                 // Usually only the same day or next day if overnight, assume date logic from API is correct or same day
                 // But better to reconstruct Date objects to be safe if strictly necessary, but string concat is safer for preserving local time intent
                 endStr = `${formatDateStr(endDateParts.y, endDateParts.m, endDateParts.d)}T${formatTimeStr(event.endTime)}`;
            } else {
                // Default duration 2 hours if no end time
                let endDateParts = startDateParts;
                if (event.isoEndDate) {
                    endDateParts = parseDateParts(event.isoEndDate);
                }
                const startObj = new Date(startDateParts.y, startDateParts.m - 1, startDateParts.d, parseInt(event.startTime.split(':')[0]), parseInt(event.startTime.split(':')[1]));
                // Start with the end date, add the 2 hours logic to the start time (assuming duration from start)
                const endObj = new Date(endDateParts.y, endDateParts.m - 1, endDateParts.d, startObj.getHours() + 2, startObj.getMinutes());
                endStr = `${formatDateStr(endObj.getFullYear(), endObj.getMonth() + 1, endObj.getDate())}T${String(endObj.getHours()).padStart(2, '0')}${String(endObj.getMinutes()).padStart(2, '0')}00`;
            }
            datesString = `${startStr}/${endStr}`;
        } else {
            // All day event logic
            const startDate = new Date(startDateParts.y, startDateParts.m - 1, startDateParts.d);
            let endDate = new Date(startDate);
            if (event.isoEndDate) {
                const parts = event.isoEndDate.split('-');
                endDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            }
             // For all day, end date is exclusive (next day)
            endDate.setDate(endDate.getDate() + 1);
            
            datesString = `${formatDateStr(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate())}/${formatDateStr(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())}`;
        }

        const title = event.emoji ? `${event.emoji} ${event.name}` : event.name;
        let details = event.description;
        
        let locationParam = '';
        if (event.location) {
            locationParam = `&location=${encodeURIComponent(event.location)}`;
            details += `\n\nVisibility: ${event.location}`;
        }
        
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesString}&details=${encodeURIComponent(details)}${locationParam}`;
        window.open(url, '_blank');
    };

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
                    <li key={index} className="bg-gray-800/50 p-4 rounded-lg relative group transition-all hover:bg-gray-800/70">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="text-lg font-bold text-purple-300">
                                    {event.emoji && <span className="mr-2 text-xl" role="img" aria-label="Event icon">{event.emoji}</span>}
                                    {event.name}
                                </h4>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-semibold text-gray-400">{event.date}</p>
                                    {event.startTime && (
                                        <p className="text-xs text-purple-400">
                                            {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                                        </p>
                                    )}
                                    {event.location && (
                                        <p className="text-xs text-gray-500 italic">
                                            {event.location}
                                        </p>
                                    )}
                                </div>
                             </div>
                             {event.isoDate && (
                                <button 
                                    onClick={() => addToGoogleCalendar(event)}
                                    className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                                    title={t('celestialEvents.addToCalendarTooltip')}
                                    aria-label={t('celestialEvents.addToCalendarAriaLabel')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008H14.25V15z" />
                                    </svg>
                                </button>
                             )}
                         </div>
                         <p className="text-gray-300">{event.description}</p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <section className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-6">{t('celestialEvents.title')}</h3>
            {renderContent()}
        </section>
    );
};

export default CelestialEvents;