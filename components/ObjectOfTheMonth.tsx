import React from 'react';
import { ObjectOfTheMonthData } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ObjectOfTheMonthProps {
    objectData: ObjectOfTheMonthData;
    isAdmin: boolean;
    onEditClick: () => void;
}

const ObjectOfTheMonth: React.FC<ObjectOfTheMonthProps> = ({ objectData, isAdmin, onEditClick }) => {
    const { t } = useLocale();
    return (
        <div className="relative bg-gray-900/30 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6">
            {isAdmin && (
                <button
                    onClick={onEditClick}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-purple-600 text-white font-bold text-sm py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                    <span>{t('edit')}</span>
                </button>
            )}
            <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">{t('objectOfTheMonth.title')}</h3>
                <h4 className="text-xl font-semibold text-purple-300 mb-4">{objectData.name}</h4>
            </div>

            <hr className="border-white/20 mb-6" />
            
            <img 
                src={objectData.imageUrl} 
                alt={objectData.name} 
                className="w-full h-auto max-h-[450px] object-cover rounded-lg border border-gray-600 mb-6" 
            />
            
            <p className="text-gray-300 mb-6">{objectData.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                {objectData.facts.map(fact => (
                    <div key={fact.label} className="bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-sm text-purple-400 font-bold">{fact.label}</p>
                        <p className="text-md text-white">{fact.value}</p>
                    </div>
                ))}
            </div>

            <div>
                 <h5 className="text-lg font-bold text-purple-300 mb-2">{t('objectOfTheMonth.howToFind')}</h5>
                 <p className="text-gray-400 text-sm">{objectData.findingTips}</p>
            </div>
        </div>
    );
};

export default ObjectOfTheMonth;
