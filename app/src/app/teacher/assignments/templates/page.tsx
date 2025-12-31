'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { BookOpen, Sparkles, TrendingUp, Users, ArrowLeft } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  grade_level_range: string;
  difficulty: string;
  template_data: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mythology_basics' | 'science' | 'civics'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const { data, error } = await supabase
        .from('assignment_templates')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true });

      if (error) throw error;
      
      setTemplates(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading templates:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading templates...</p>
        </div>
      </div>
    );
  }

  const filteredTemplates = templates.filter(t => {
    if (filter !== 'all' && t.category !== filter) return false;
    if (difficultyFilter !== 'all' && t.difficulty !== difficultyFilter) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return 'bg-green-500/30 text-green-200 border-green-400/30';
    if (difficulty === 'intermediate') return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30';
    return 'bg-red-500/30 text-red-200 border-red-400/30';
  };

  const getGradeLevelIcon = (range: string) => {
    if (range === 'elementary') return '🎈';
    if (range === 'middle') return '📚';
    if (range === 'high') return '🎓';
    return '🌟'; // multi-age
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/teacher/assignments"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">Assignment Templates</h1>
          <p className="text-purple-200">
            Pre-built curiosity-driven assignments ready to use
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Categories' },
                { key: 'mythology_basics', label: 'Mythology Basics' },
                { key: 'science', label: 'Science' },
                { key: 'civics', label: 'Civics' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === cat.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Levels' },
                { key: 'beginner', label: 'Beginner' },
                { key: 'intermediate', label: 'Intermediate' },
                { key: 'advanced', label: 'Advanced' }
              ].map(diff => (
                <button
                  key={diff.key}
                  onClick={() => setDifficultyFilter(diff.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    difficultyFilter === diff.key
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 text-center">
            <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Templates Found</h2>
            <p className="text-gray-300">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {template.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {template.description}
                    </p>
                  </div>
                  <div className="text-3xl ml-4">
                    {getGradeLevelIcon(template.grade_level_range)}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-xs font-medium rounded-full border border-purple-400/30">
                    {template.category.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-medium rounded-full border border-blue-400/30">
                    {template.grade_level_range === 'multi-age' ? 'Multi-Age' : `${template.grade_level_range} school`}
                  </span>
                </div>

                {/* Template Info */}
                {template.template_data && (
                  <div className="space-y-3 mb-6">
                    {template.template_data.points_possible && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <TrendingUp className="w-4 h-4 text-pink-400" />
                        <span>{template.template_data.points_possible} points possible</span>
                      </div>
                    )}
                    {template.template_data.min_grade_level && template.template_data.max_grade_level && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Grades {template.template_data.min_grade_level}-{template.template_data.max_grade_level}</span>
                      </div>
                    )}
                    {template.template_data.learning_objectives && template.template_data.learning_objectives.length > 0 && (
                      <div className="text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Learning Goals:</span>
                            <ul className="mt-1 space-y-1">
                              {template.template_data.learning_objectives.slice(0, 2).map((obj: string, idx: number) => (
                                <li key={idx} className="text-xs">• {obj}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/teacher/assignments/create?templateId=${template.id}`}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-center"
                  >
                    Use This Template
                  </Link>
                  <button
                    onClick={() => {
                      // Preview modal could be added here
                      alert(`Preview for "${template.title}"\n\n${template.description}`);
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-all"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-pink-500/10 backdrop-blur-lg rounded-xl border border-pink-400/30 p-6">
          <h3 className="text-lg font-semibold text-pink-300 mb-3">
            ✨ About Templates
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Pre-built with scaffolding hints and extension challenges for multi-age learning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Aligned with learning objectives and designed for curiosity-driven exploration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Customize any template after selecting it to fit your classroom's needs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <span>Templates support unlimited revisions and narrative feedback</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
