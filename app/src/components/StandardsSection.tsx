'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StandardsModal from './StandardsModal';
import {
  ACTIVITY_STANDARD_MAPPINGS,
  filterStandards,
  getStandardsForActivity,
  getFrameworkDisplayName,
  getStandardsSummary,
  Standard,
  StandardFramework,
  SubjectArea,
  GradeLevel,
  ActivityType,
} from '@/lib/standards';

interface StandardsSectionProps {
  className?: string;
}

/**
 * Landing page section showing standards with filter dropdowns
 * Allows filtering by subject, grade level, and activity type
 */
export default function StandardsSection({ className = '' }: StandardsSectionProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStandards, setModalStandards] = useState<Standard[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);

  const summary = getStandardsSummary();

  // Get filtered standards based on selections
  const filteredStandards = useMemo(() => {
    // If an activity is selected, show those standards
    if (selectedActivity !== 'all') {
      let standards = getStandardsForActivity(selectedActivity);
      
      // Apply additional filters
      if (selectedSubject !== 'all') {
        standards = standards.filter(s => s.subject === selectedSubject);
      }
      if (selectedGrade !== 'all') {
        standards = standards.filter(s => s.gradeLevel === selectedGrade || s.gradeLevel === '6-8');
      }
      
      return standards;
    }

    // Otherwise filter all standards
    return filterStandards({
      subjects: selectedSubject !== 'all' ? [selectedSubject] : undefined,
      gradeLevels: selectedGrade !== 'all' ? [selectedGrade] : undefined,
    });
  }, [selectedSubject, selectedGrade, selectedActivity]);

  // Group standards by framework
  const groupedStandards = useMemo(() => {
    return filteredStandards.reduce((acc, standard) => {
      const framework = standard.framework;
      if (!acc[framework]) {
        acc[framework] = [];
      }
      acc[framework].push(standard);
      return acc;
    }, {} as Record<string, Standard[]>);
  }, [filteredStandards]);

  const openStandardsModal = (standards: Standard[], title: string) => {
    setModalStandards(standards);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const subjects: { value: SubjectArea | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Subjects', icon: '📚' },
    { value: 'ela', label: 'English Language Arts', icon: '📖' },
    { value: 'math', label: 'Mathematics', icon: '🔢' },
    { value: 'cultural', label: 'Cultural Studies', icon: '🌍' },
    { value: 'social-studies', label: 'Social Studies', icon: '🏛️' },
    { value: 'geography', label: 'Geography', icon: '🗺️' },
    { value: 'technology', label: 'Technology', icon: '💻' },
  ];

  const grades: { value: GradeLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Grades (6-8)' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
  ];

  // Get activities organized by subject
  const activities = ACTIVITY_STANDARD_MAPPINGS.map(m => ({
    value: m.activityType,
    label: m.activityName,
    subjects: m.primarySubjects,
  }));

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              📚 Educational Standards Alignment
            </h2>
            <p className="text-purple-200/80 text-lg max-w-3xl mx-auto">
              Every activity in MythoLogic is aligned with Alaska State Standards and national Common Core standards.
              Explore how our mythology-based learning connects to educational objectives.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <div className="px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-300">{summary.totalStandards}</div>
              <div className="text-sm text-purple-400">Total Standards</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-3xl font-bold text-amber-300">{summary.byFramework['alaska-cultural']}</div>
              <div className="text-sm text-amber-400">Cultural Standards</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-300">{summary.byFramework['alaska-ela']}</div>
              <div className="text-sm text-blue-400">ELA Standards</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="text-3xl font-bold text-green-300">{summary.byFramework['alaska-math']}</div>
              <div className="text-sm text-green-400">Math Standards</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-pink-500/10 border border-pink-500/30">
              <div className="text-3xl font-bold text-pink-300">{summary.totalActivities}</div>
              <div className="text-sm text-pink-400">Activities Mapped</div>
            </div>
          </motion.div>
        </div>

        {/* Filter Dropdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 rounded-2xl border border-purple-500/30 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <span>🔍</span> Filter Standards
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Filter */}
            <div>
              <label className="block text-sm text-purple-300 mb-2">By Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectArea | 'all')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-purple-500/30 text-purple-100 focus:outline-none focus:border-purple-500 transition-colors"
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.icon} {subject.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div>
              <label className="block text-sm text-purple-300 mb-2">By Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as GradeLevel | 'all')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-purple-500/30 text-purple-100 focus:outline-none focus:border-purple-500 transition-colors"
              >
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    🎓 {grade.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Filter */}
            <div>
              <label className="block text-sm text-purple-300 mb-2">By Activity</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value as ActivityType | 'all')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-purple-500/30 text-purple-100 focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">🎮 All Activities</option>
                {activities.map((activity) => (
                  <option key={activity.value} value={activity.value}>
                    {activity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-purple-300/70">
            Showing <span className="font-bold text-purple-200">{filteredStandards.length}</span> standards
            {selectedActivity !== 'all' && (
              <span> for <span className="text-purple-200">{activities.find(a => a.value === selectedActivity)?.label}</span></span>
            )}
          </div>
        </motion.div>

        {/* Standards by Framework */}
        <div className="space-y-4">
          {Object.entries(groupedStandards).map(([framework, standards], index) => (
            <motion.div
              key={framework}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-900/50 rounded-2xl border border-purple-500/30 overflow-hidden"
            >
              {/* Framework Header - Clickable */}
              <button
                onClick={() => setExpandedFramework(expandedFramework === framework ? null : framework)}
                className="w-full flex items-center justify-between p-5 hover:bg-purple-500/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-3xl ${
                    framework.includes('cultural') ? '' : 
                    framework.includes('ela') ? '' : 
                    framework.includes('math') ? '' : ''
                  }`}>
                    {framework.includes('cultural') ? '🌍' : 
                     framework.includes('ela') ? '📖' : 
                     framework.includes('math') ? '🔢' : '📋'}
                  </span>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-purple-100">
                      {getFrameworkDisplayName(framework as StandardFramework)}
                    </h3>
                    <p className="text-sm text-purple-300/70">
                      {standards.length} standards
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedFramework === framework ? 180 : 0 }}
                  className="text-purple-400"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              {/* Expanded Standards Preview */}
              <AnimatePresence>
                {expandedFramework === framework && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-purple-500/20"
                  >
                    <div className="p-5">
                      {/* Preview of first few standards */}
                      <div className="space-y-3 mb-4">
                        {standards.slice(0, 5).map((standard) => (
                          <div 
                            key={standard.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
                          >
                            <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold ${
                              framework.includes('cultural') 
                                ? 'bg-amber-500/20 text-amber-300'
                                : framework.includes('ela')
                                ? 'bg-blue-500/20 text-blue-300'
                                : framework.includes('math')
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {standard.code}
                            </span>
                            <div>
                              <div className="font-medium text-purple-100 text-sm">{standard.title}</div>
                              <div className="text-xs text-purple-300/60 line-clamp-1">{standard.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {standards.length > 5 && (
                        <p className="text-sm text-purple-300/60 mb-4">
                          ...and {standards.length - 5} more standards
                        </p>
                      )}

                      <button
                        onClick={() => openStandardsModal(standards, getFrameworkDisplayName(framework as StandardFramework))}
                        className="w-full py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-medium transition-colors border border-purple-500/30"
                      >
                        View All {standards.length} Standards
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {Object.keys(groupedStandards).length === 0 && (
            <div className="text-center py-12 text-purple-300/60">
              <span className="text-4xl mb-4 block">🔍</span>
              <p>No standards match your current filters</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => openStandardsModal(filteredStandards, 'All Filtered Standards')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105"
          >
            <span>📋</span>
            View All Standards
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-sm">
              {filteredStandards.length}
            </span>
          </button>
        </motion.div>

        {/* Source Attribution */}
        <div className="mt-12 text-center text-sm text-purple-300/50">
          <p>
            Standards sourced from{' '}
            <a 
              href="https://education.alaska.gov/akstandards" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Alaska Department of Education
            </a>
            {' '}and{' '}
            <a 
              href="https://www.uaf.edu/ankn/publications/guides/alaska-standards-for-cult/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Alaska Native Knowledge Network
            </a>
          </p>
        </div>
      </div>

      {/* Standards Modal */}
      <StandardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityName={modalTitle}
        standards={modalStandards}
      />
    </section>
  );
}
