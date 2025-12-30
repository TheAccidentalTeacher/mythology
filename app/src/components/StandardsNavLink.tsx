'use client';

import { useState } from 'react';
import StandardsModal from './StandardsModal';
import { ALL_STANDARDS, getStandardsSummary } from '@/lib/standards';

interface StandardsNavLinkProps {
  className?: string;
  showCount?: boolean;
}

/**
 * Navigation link for standards - can be placed in header/nav
 */
export default function StandardsNavLink({ 
  className = '',
  showCount = true,
}: StandardsNavLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const summary = getStandardsSummary();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors text-purple-200 hover:text-white ${className}`}
      >
        <span className="text-lg">📚</span>
        <span className="font-medium">Standards</span>
        {showCount && (
          <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 text-xs font-bold">
            {summary.totalStandards}
          </span>
        )}
      </button>

      <StandardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityName="All Platform Standards"
        standards={ALL_STANDARDS}
      />
    </>
  );
}
