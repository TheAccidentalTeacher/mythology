'use client';

import { useState } from 'react';
import StandardsModal from './StandardsModal';
import { 
  getStandardsForActivity, 
  ActivityType,
  Standard 
} from '@/lib/standards';

interface StandardsFooterProps {
  activityType?: ActivityType;
  activityName?: string;
  standards?: Standard[];
  className?: string;
}

/**
 * Footer bar showing standards for the current activity
 * Can be placed at the bottom of any page
 */
export default function StandardsFooter({
  activityType,
  activityName,
  standards: providedStandards,
  className = '',
}: StandardsFooterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get standards
  const standards = providedStandards || (activityType ? getStandardsForActivity(activityType) : []);
  
  if (standards.length === 0) return null;

  // Group by framework for preview
  const frameworkCounts = standards.reduce((acc, s) => {
    const framework = s.framework.includes('cultural') 
      ? 'Cultural' 
      : s.framework.includes('ela') 
      ? 'ELA'
      : s.framework.includes('math')
      ? 'Math'
      : 'Other';
    acc[framework] = (acc[framework] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className={`w-full bg-gradient-to-r from-slate-900/95 via-purple-900/30 to-slate-900/95 backdrop-blur-sm border-t border-purple-500/30 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left side: Standards info */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-purple-200">
                <span className="text-lg">📚</span>
                <span className="font-medium text-sm">
                  This activity addresses <span className="text-purple-100 font-bold">{standards.length}</span> educational standards
                </span>
              </div>

              {/* Framework breakdown pills */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(frameworkCounts).map(([framework, count]) => (
                  <span
                    key={framework}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      framework === 'Cultural'
                        ? 'bg-amber-500/20 text-amber-300'
                        : framework === 'ELA'
                        ? 'bg-blue-500/20 text-blue-300'
                        : framework === 'Math'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {count} {framework}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side: View button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white text-sm font-medium transition-all border border-purple-500/30 hover:border-purple-500/50"
            >
              <span>View Standards</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <StandardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityType={activityType}
        activityName={activityName}
        standards={providedStandards}
      />
    </>
  );
}
