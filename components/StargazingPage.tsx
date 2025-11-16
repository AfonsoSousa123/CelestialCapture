import React from 'react';
import MoonPhase from './MoonPhase';
import InteractiveTelescope from './InteractiveTelescope';
import WhatsUpTonight from './WhatsUpTonight';
import { useLocale } from '../contexts/LocaleContext';
import MilkyWayGuide from './MilkyWayGuide';
import CelestialEvents from './CelestialEvents';
import BortleScaleMeter from './BortleScaleMeter';
import TipsSection from './TipsSection';

const StargazingPage: React.FC = () => {
    const { t } = useLocale();
    return (
        <div
            className="bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1532839885865-c332935215c2?q=80&w=1920&auto=format&fit=crop')",
            }}
        >
            <div className="bg-gray-900/80">
                <div className="relative isolate animate-fadeInUp">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-extrabold text-white tracking-tight">{t('stargazing.title')}</h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{t('stargazing.subtitle')}</p>
                        </div>
                        
                        <div className="space-y-16">
                            {/* Moon Phase Section - Full Width */}
                            <div className="flex justify-center">
                                <MoonPhase />
                            </div>

                            {/* Dashboard Section - Now stacked for better spacing */}
                            <div className="grid grid-cols-1 gap-16 items-stretch">
                                <BortleScaleMeter />
                                <MilkyWayGuide />
                            </div>
                            
                            {/* Full-width sections */}
                            <CelestialEvents />
                            <WhatsUpTonight />
                            <TipsSection />
                            <InteractiveTelescope />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StargazingPage;