'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getStandardsForActivity, 
  getFrameworkDisplayName,
  getSubjectDisplayName,
  Standard,
  ActivityType,
  StandardFramework
} from '@/lib/standards';

interface StandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType?: ActivityType;
  activityName?: string;
  standards?: Standard[];
}

export default function StandardsModal({
  isOpen,
  onClose,
  activityType,
  activityName,
  standards: providedStandards,
}: StandardsModalProps) {
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);

  // Compute standards from props - no useEffect needed
  const standards = useMemo(() => {
    if (providedStandards) {
      return providedStandards;
    }
    if (activityType) {
      return getStandardsForActivity(activityType);
    }
    return [];
  }, [activityType, providedStandards]);

  // Group standards by framework
  const groupedStandards = standards.reduce((acc, standard) => {
    const framework = standard.framework;
    if (!acc[framework]) {
      acc[framework] = [];
    }
    acc[framework].push(standard);
    return acc;
  }, {} as Record<string, Standard[]>);

  const frameworks = Object.keys(groupedStandards);

  const filteredStandards = selectedFramework === 'all' 
    ? standards 
    : groupedStandards[selectedFramework] || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/30 overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/80 to-slate-900/80 backdrop-blur-sm border-b border-purple-500/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-purple-100 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Educational Standards
                </h2>
                {activityName && (
                  <p className="text-purple-300/80 text-sm mt-1">
                    Standards addressed in: <span className="font-semibold text-purple-200">{activityName}</span>
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-purple-500/20 transition-colors text-purple-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Framework Filter Tabs */}
            {frameworks.length > 1 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setSelectedFramework('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedFramework === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  All ({standards.length})
                </button>
                {frameworks.map((framework) => (
                  <button
                    key={framework}
                    onClick={() => setSelectedFramework(framework)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedFramework === framework
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    {getFrameworkDisplayName(framework as StandardFramework)} ({groupedStandards[framework].length})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Standards List */}
          <div className="overflow-y-auto max-h-[60vh] p-6">
            {filteredStandards.length === 0 ? (
              <div className="text-center py-12 text-purple-300/60">
                <span className="text-4xl mb-4 block">📋</span>
                <p>No standards to display</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStandards.map((standard) => (
                  <motion.div
                    key={standard.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all"
                  >
                    <button
                      onClick={() => setExpandedStandard(expandedStandard === standard.id ? null : standard.id)}
                      className="w-full text-left p-4 flex items-start gap-4"
                    >
                      {/* Standard Code Badge */}
                      <div className="flex-shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          standard.framework.includes('cultural') 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : standard.framework.includes('ela')
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : standard.framework.includes('math')
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {standard.code}
                        </span>
                      </div>

                      {/* Standard Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-purple-100">{standard.title}</h3>
                        <p className={`text-sm text-purple-300/70 mt-1 ${
                          expandedStandard === standard.id ? '' : 'line-clamp-2'
                        }`}>
                          {standard.description}
                        </p>
                      </div>

                      {/* Expand Icon */}
                      <div className="flex-shrink-0 text-purple-400">
                        <motion.svg
                          animate={{ rotate: expandedStandard === standard.id ? 180 : 0 }}
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedStandard === standard.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-purple-500/20 bg-slate-900/50"
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                                📖 {getSubjectDisplayName(standard.subject)}
                              </span>
                              <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                                🎓 Grade {standard.gradeLevel}
                              </span>
                              <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                                🏛️ {getFrameworkDisplayName(standard.framework)}
                              </span>
                            </div>
                            {standard.sourceUrl && (
                              <a
                                href={standard.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                View official source
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-sm border-t border-purple-500/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-300/70">
                <span className="font-medium text-purple-200">{filteredStandards.length}</span> standards shown
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
