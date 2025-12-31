'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Target, Award, BookOpen } from 'lucide-react';

interface Standard {
  code: string;
  mastery_level: number;
  assignment_count: number;
  last_assessed: string;
}

interface StandardWithDetails extends Standard {
  displayName: string;
  category: string;
}

export default function StudentStandardsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [standards, setStandards] = useState<StandardWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'ela' | 'math' | 'science' | 'social'>('all');

  useEffect(() => {
    loadStandards();
  }, []);

  async function loadStandards() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get all submissions with standards_mastery data
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('standards_mastery, graded_at')
        .eq('student_id', user.id)
        .not('standards_mastery', 'is', null)
        .order('graded_at', { ascending: false });

      if (!submissions || submissions.length === 0) {
        setLoading(false);
        return;
      }

      // Aggregate standards mastery
      const standardsMap = new Map<string, { levels: number[], count: number, lastDate: string }>();

      submissions.forEach(submission => {
        const mastery = submission.standards_mastery as any;
        if (mastery && typeof mastery === 'object') {
          Object.entries(mastery).forEach(([code, level]) => {
            if (!standardsMap.has(code)) {
              standardsMap.set(code, { levels: [], count: 0, lastDate: submission.graded_at });
            }
            const existing = standardsMap.get(code)!;
            existing.levels.push(level as number);
            existing.count++;
            if (new Date(submission.graded_at) > new Date(existing.lastDate)) {
              existing.lastDate = submission.graded_at;
            }
          });
        }
      });

      // Calculate average mastery and format
      const standardsArray: StandardWithDetails[] = Array.from(standardsMap.entries()).map(([code, data]) => {
        const avgMastery = Math.round(
          data.levels.reduce((a, b) => a + b, 0) / data.levels.length
        );

        return {
          code,
          mastery_level: avgMastery,
          assignment_count: data.count,
          last_assessed: data.lastDate,
          displayName: parseStandardName(code),
          category: parseStandardCategory(code)
        };
      });

      // Sort by mastery level descending
      standardsArray.sort((a, b) => b.mastery_level - a.mastery_level);

      setStandards(standardsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error loading standards:', error);
      setLoading(false);
    }
  }

  function parseStandardName(code: string): string {
    // Parse standard codes like "CCSS.ELA-LITERACY.W.6.3" into readable names
    if (code.includes('CCSS.ELA')) {
      const parts = code.split('.');
      return `ELA: Writing Grade ${parts[3] || '?'}`;
    } else if (code.includes('NGSS')) {
      return `Science: ${code.split('.').pop() || code}`;
    } else if (code.includes('CCSS.MATH')) {
      return `Math: ${code.split('.').slice(2).join(' ')}`;
    }
    return code;
  }

  function parseStandardCategory(code: string): string {
    if (code.includes('ELA')) return 'ela';
    if (code.includes('MATH')) return 'math';
    if (code.includes('NGSS') || code.includes('science')) return 'science';
    if (code.includes('civics') || code.includes('history')) return 'social';
    return 'other';
  }

  function getMasteryLabel(level: number): { label: string; color: string; bgColor: string } {
    if (level >= 90) return { label: 'Mastered', color: 'text-green-300', bgColor: 'bg-green-500/20 border-green-400/30' };
    if (level >= 75) return { label: 'Proficient', color: 'text-blue-300', bgColor: 'bg-blue-500/20 border-blue-400/30' };
    if (level >= 60) return { label: 'Developing', color: 'text-yellow-300', bgColor: 'bg-yellow-500/20 border-yellow-400/30' };
    return { label: 'Beginning', color: 'text-orange-300', bgColor: 'bg-orange-500/20 border-orange-400/30' };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading standards...</p>
        </div>
      </div>
    );
  }

  const filteredStandards = standards.filter(s => 
    filterCategory === 'all' || s.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">Standards Mastery</h1>
          <p className="text-purple-200">Track your progress across learning standards</p>
        </div>

        {/* Summary Cards */}
        {standards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-500/20 border border-green-400/30 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">
                  {standards.filter(s => s.mastery_level >= 90).length}
                </h3>
              </div>
              <p className="text-green-300">Standards Mastered</p>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/30 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  {standards.filter(s => s.mastery_level >= 75 && s.mastery_level < 90).length}
                </h3>
              </div>
              <p className="text-blue-300">Proficient</p>
            </div>

            <div className="bg-purple-500/20 border border-purple-400/30 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                  {standards.length}
                </h3>
              </div>
              <p className="text-purple-300">Total Standards</p>
            </div>
          </div>
        )}

        {/* Filter */}
        {standards.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Standards' },
                { key: 'ela', label: 'English/Language Arts' },
                { key: 'math', label: 'Mathematics' },
                { key: 'science', label: 'Science' },
                { key: 'social', label: 'Social Studies' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFilterCategory(cat.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === cat.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Standards List */}
        {filteredStandards.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center">
            <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {standards.length === 0 ? 'No Standards Tracked Yet' : 'No Standards in This Category'}
            </h2>
            <p className="text-gray-300">
              {standards.length === 0 
                ? 'Complete graded assignments with standards to see your progress here.'
                : 'Try selecting a different category filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStandards.map((standard) => {
              const mastery = getMasteryLabel(standard.mastery_level);
              
              return (
                <div
                  key={standard.code}
                  className={`${mastery.bgColor} backdrop-blur-lg rounded-xl border p-6`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {standard.displayName}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{standard.code}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            standard.mastery_level >= 90 ? 'bg-green-500' :
                            standard.mastery_level >= 75 ? 'bg-blue-500' :
                            standard.mastery_level >= 60 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${standard.mastery_level}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${mastery.color} mb-1`}>
                        {standard.mastery_level}%
                      </div>
                      <div className={`text-sm ${mastery.color} font-medium`}>
                        {mastery.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-400">Assessed in </span>
                      <span className="font-medium text-white">{standard.assignment_count} assignment{standard.assignment_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last assessed </span>
                      <span className="font-medium text-white">
                        {new Date(standard.last_assessed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            📊 About Standards Mastery
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span><strong>Mastered (90%+):</strong> You've shown strong understanding consistently</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span><strong>Proficient (75-89%):</strong> You understand this well and continue to improve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span><strong>Developing (60-74%):</strong> You're making progress - keep practicing!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span><strong>Beginning (&lt;60%):</strong> You're learning - ask for help and keep trying!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
