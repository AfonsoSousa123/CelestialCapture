import React, { useState } from 'react';
import StargazingTips from './StargazingTips';
import AstrophotographyTips from './AstrophotographyTips';
import { useLocale } from '../contexts/LocaleContext';

type ActiveTab = 'stargazing' | 'astrophotography';

const TipsSection: React.FC = () => {
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<ActiveTab>('stargazing');

    const tabButtonClasses = (tabName: ActiveTab) => 
        `px-6 py-3 font-bold text-lg rounded-t-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
            activeTab === tabName 
            ? 'bg-gray-800/50 text-purple-300' 
            : 'bg-transparent text-gray-400 hover:bg-gray-800/20 hover:text-white'
        }`;

    return (
        <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10">
            <div className="flex border-b border-purple-500/20">
                <button 
                    onClick={() => setActiveTab('stargazing')}
                    className={tabButtonClasses('stargazing')}
                    aria-selected={activeTab === 'stargazing'}
                    role="tab"
                >
                    {t('stargazingTips.title')}
                </button>
                <button 
                    onClick={() => setActiveTab('astrophotography')}
                    className={tabButtonClasses('astrophotography')}
                    aria-selected={activeTab === 'astrophotography'}
                    role="tab"
                >
                    {t('astrophotographyTips.title')}
                </button>
            </div>
            <div className="p-6 md:p-8">
                {activeTab === 'stargazing' && <StargazingTips />}
                {activeTab === 'astrophotography' && <AstrophotographyTips />}
            </div>
        </div>
    );
};

export default TipsSection;
