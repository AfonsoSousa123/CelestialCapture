import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';

type TelescopePart = 'objective' | 'eyepiece' | 'mount' | 'finderscope' | 'tube';

interface PartDetail {
    name: string;
    description: string;
}

const TelescopeSVG: React.FC<{ hoveredPart: TelescopePart | null; onHover: (part: TelescopePart | null) => void }> = ({ hoveredPart, onHover }) => {
    const getPartClass = (part: TelescopePart, type: 'fill' | 'stroke') => {
        const baseClass = "transition-all duration-300";
        if (hoveredPart === null) {
            return type === 'fill' 
                ? `${baseClass} fill-gray-500`
                : `${baseClass} stroke-gray-400`;
        }
        return hoveredPart === part
            ? type === 'fill'
                ? `${baseClass} fill-purple-400`
                : `${baseClass} stroke-purple-300`
            : type === 'fill'
                ? `${baseClass} fill-gray-700`
                : `${baseClass} stroke-gray-600`;
    };

    return (
        <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto">
            {/* MOUNT */}
            <g onMouseEnter={() => onHover('mount')} onMouseLeave={() => onHover(null)} className="cursor-pointer">
                {/* Tripod Legs */}
                <path d="M 150 200 L 100 290" strokeWidth="6" strokeLinecap="round" className={getPartClass('mount', 'stroke')} />
                <path d="M 150 200 L 200 290" strokeWidth="6" strokeLinecap="round" className={getPartClass('mount', 'stroke')} />
                <path d="M 150 200 L 150 280" strokeWidth="4" strokeLinecap="round" className={getPartClass('mount', 'stroke')} />
                {/* Tripod Head */}
                <rect x="140" y="195" width="20" height="10" rx="2" className={getPartClass('mount', 'fill')} />
                {/* Mount Body */}
                <path d="M 150 165 L 150 195" strokeWidth="14" strokeLinecap="round" className={getPartClass('mount', 'stroke')} />
                <g transform="translate(150, 165) rotate(45)">
                    <rect x="-22" y="-12" width="44" height="24" rx="5" className={getPartClass('mount', 'fill')} />
                    <circle cx="0" cy="0" r="14" className={getPartClass('mount', 'stroke')} strokeWidth="4" />
                </g>
                {/* Counterweight */}
                <g transform="translate(150, 165) rotate(225)">
                    <line x1="0" y1="0" x2="0" y2="70" strokeWidth="3" className={getPartClass('mount', 'stroke')} />
                    <rect x="-12" y="70" width="24" height="20" rx="5" className={getPartClass('mount', 'fill')} />
                </g>
            </g>

            {/* Telescope Assembly */}
            <g transform="translate(155, 100) rotate(-45)">
                {/* TUBE */}
                <g onMouseEnter={() => onHover('tube')} onMouseLeave={() => onHover(null)} className="cursor-pointer">
                    <rect x="-100" y="-20" width="200" height="40" rx="5" strokeWidth="1.5" className={`${getPartClass('tube', 'fill')} ${getPartClass('tube', 'stroke')}`} />
                </g>

                {/* OBJECTIVE */}
                <g onMouseEnter={() => onHover('objective')} onMouseLeave={() => onHover(null)} className="cursor-pointer">
                    <rect x="-115" y="-22" width="25" height="44" rx="3" strokeWidth="1.5" className={`${getPartClass('objective', 'fill')} ${getPartClass('objective', 'stroke')}`} />
                </g>

                {/* EYEPIECE */}
                <g onMouseEnter={() => onHover('eyepiece')} onMouseLeave={() => onHover(null)} className="cursor-pointer" transform="translate(50, -22)">
                    <path d="M 0 0 V -15 H 20 V 0" strokeWidth="1.5" className={`${getPartClass('eyepiece', 'fill')} ${getPartClass('eyepiece', 'stroke')}`} />
                    <path d="M 5 -15 V -28 H 15 V -15 Z" strokeWidth="1.5" className={`${getPartClass('eyepiece', 'fill')} ${getPartClass('eyepiece', 'stroke')}`} />
                </g>

                {/* FINDERSCOPE */}
                <g onMouseEnter={() => onHover('finderscope')} onMouseLeave={() => onHover(null)} className="cursor-pointer" transform="translate(0, -35)">
                    <rect x="-30" y="0" width="60" height="15" rx="3" className={getPartClass('finderscope', 'fill')} />
                    <rect x="-25" y="15" width="10" height="5" className={getPartClass('finderscope', 'fill')} />
                    <rect x="15" y="15" width="10" height="5" className={getPartClass('finderscope', 'fill')} />
                </g>
                
                {/* Saddle/Rings */}
                <rect x="-60" y="-25" width="20" height="50" rx="3" className={getPartClass('tube', 'fill')} />
                <rect x="40" y="-25" width="20" height="50" rx="3" className={getPartClass('tube', 'fill')} />
            </g>
        </svg>
    );
};


const InteractiveTelescope: React.FC = () => {
    const { t } = useLocale();
    const [hoveredPart, setHoveredPart] = useState<TelescopePart | null>(null);

    const partDetails = t('interactiveTelescope.parts') as unknown as Record<TelescopePart, PartDetail>;
    const activePart = hoveredPart ? partDetails[hoveredPart] : null;

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-2xl shadow-purple-500/10">
            <h3 className="text-3xl font-bold text-center text-white mb-6">{t('interactiveTelescope.title')}</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                    <TelescopeSVG hoveredPart={hoveredPart} onHover={setHoveredPart} />
                </div>
                <div className="w-full md:w-1/2 h-48 flex items-center justify-center p-4 bg-gray-800/50 rounded-lg">
                    {activePart ? (
                        <div className="text-center md:text-left animate-fadeIn">
                            <h4 className="text-2xl font-bold text-purple-300 mb-2">{activePart.name}</h4>
                            <p className="text-gray-300">{activePart.description}</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p className="text-lg">{t('interactiveTelescope.prompt')}</p>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default InteractiveTelescope;