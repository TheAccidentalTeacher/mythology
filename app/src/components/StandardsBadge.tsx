'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StandardsModal from './StandardsModal';
import { 
  getStandardsForActivity, 
  ActivityType,
  Standard 
} from '@/lib/standards';

interface StandardsBadgeProps {
  activityType?: ActivityType;
  activityName?: string;
  standards?: Standard[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

/**
 * Floating badge that opens a modal showing educational standards
 * Can be placed on any page to show what standards that activity addresses
 */
export default function StandardsBadge({
  activityType,
  activityName,
  standards: providedStandards,
  position = 'bottom-right',
  className = '',
}: StandardsBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get standards count
  const standards = providedStandards || (activityType ? getStandardsForActivity(activityType) : []);
  const standardsCount = standards.length;

  if (standardsCount === 0) return null;

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <>
      {/* Floating Badge Button */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-40 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Main Badge */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/30 hover:shadow-purple-500/50 transition-all">
            <span className="text-lg">📚</span>
            <span className="font-medium text-sm hidden sm:inline">Standards</span>
            {/* Count Badge */}
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">
              {standardsCount}
            </span>
          </div>

          {/* Tooltip on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 5, x: '-50%' }}
                className="absolute bottom-full left-1/2 mb-2 whitespace-nowrap"
              >
                <div className="px-3 py-2 rounded-lg bg-slate-900 border border-purple-500/30 text-sm text-purple-100 shadow-xl">
                  View educational standards
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-slate-900 border-r border-b border-purple-500/30 transform rotate-45" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-purple-500/50 animate-ping opacity-20" />
        </motion.button>
      </motion.div>

      {/* Standards Modal */}
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
