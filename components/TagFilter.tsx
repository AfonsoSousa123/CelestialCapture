import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface TagFilterProps {
  tags: string[];
  activeTags: string[];
  onSelectTag: (tag: string) => void;
  onClearTags: () => void;
}

const TagCheckbox: React.FC<{
  tag: string;
  isChecked: boolean;
  onChange: () => void;
}> = ({ tag, isChecked, onChange }) => (
  <label className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
    isChecked
      ? 'bg-purple-600 text-white shadow-lg'
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
  }`}>
    <input
      type="checkbox"
      className="hidden"
      checked={isChecked}
      onChange={onChange}
    />
    <span>{tag}</span>
  </label>
);

const TagFilter: React.FC<TagFilterProps> = ({ 
  tags, activeTags, onSelectTag, onClearTags,
}) => {
  const { t } = useLocale();

  if (tags.length === 0) {
    return null;
  }
  
  const hasActiveFilters = activeTags.length > 0;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-center items-center flex-wrap gap-2 mb-4">
        {hasActiveFilters && (
          <button
            onClick={onClearTags}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-red-800 text-red-200 hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            {t('tagFilter.clear')}
          </button>
        )}
      </div>
      <div className="flex justify-center flex-wrap gap-2">
        {tags.map(tag => (
          <TagCheckbox
            key={tag}
            tag={tag}
            isChecked={activeTags.includes(tag)}
            onChange={() => onSelectTag(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default TagFilter;