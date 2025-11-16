import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const TipCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg shadow-lg hover:bg-gray-800/80 hover:border-purple-500/40 transition-all duration-300 h-full">
        <div className="text-3xl mb-3">{icon}</div>
        <h4 className="text-xl font-bold text-purple-300 mb-2">{title}</h4>
        <p className="text-gray-400">{description}</p>
    </div>
);

const StargazingTips: React.FC = () => {
  const { t } = useLocale();
  const tips = t('stargazingTips.tips') as unknown as { icon: string; title: string; description: string }[];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <TipCard key={tip.title} {...tip} />
        ))}
      </div>
    </div>
  );
};

export default StargazingTips;