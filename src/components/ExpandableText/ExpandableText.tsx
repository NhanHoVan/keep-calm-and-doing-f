import React, { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';

interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  limit = 160,
  className = "text-slate-500 ml-13 mb-6"
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > limit;

  return (
    <div className={className}>
      <p className="inline text-sm leading-relaxed">
        {isExpanded ? text : `${text.slice(0, limit)}${shouldTruncate ? '...' : ''}`}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-xs uppercase tracking-wider"
        >
          {isExpanded ? t('common.show_less') : t('common.read_more')}
        </button>
      )}
    </div>
  );
};
