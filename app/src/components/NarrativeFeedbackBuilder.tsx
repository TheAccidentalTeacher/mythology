'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, X, Sparkles, ThumbsUp, TrendingUp, Target, Save, Eye } from 'lucide-react';

interface Props {
  submissionId: string;
  assignmentId: string;
  pointsPossible: number;
  existingFeedback?: {
    strengthComments: string[];
    growthComments: string[];
    nextSteps: string[];
    overallComment: string;
    pointsEarned: number;
  };
  gradeReleased: boolean;
}

const COMMON_STRENGTHS = [
  "Creative and original ideas",
  "Strong character development",
  "Excellent use of mythology elements",
  "Clear and descriptive writing",
  "Well-organized structure",
  "Engaging storytelling",
  "Thorough research evident",
  "Great attention to detail",
];

const COMMON_GROWTH = [
  "Consider adding more detail about...",
  "Try to expand on the character's motivations",
  "Think about how this connects to...",
  "Could benefit from more descriptive language",
  "Review spelling and grammar",
];

export default function NarrativeFeedbackBuilder({ 
  submissionId,
  assignmentId,
  pointsPossible,
  existingFeedback,
  gradeReleased
}: Props) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Initialize from existing feedback or start with one empty slot for each
  const [strengths, setStrengths] = useState<string[]>(
    existingFeedback?.strengthComments && existingFeedback.strengthComments.length > 0
      ? existingFeedback.strengthComments
      : ['']
  );
  const [growth, setGrowth] = useState<string[]>(
    existingFeedback?.growthComments && existingFeedback.growthComments.length > 0
      ? existingFeedback.growthComments
      : ['']
  );
  const [nextSteps, setNextSteps] = useState<string[]>(
    existingFeedback?.nextSteps && existingFeedback.nextSteps.length > 0
      ? existingFeedback.nextSteps
      : ['']
  );
  const [overallComment, setOverallComment] = useState(existingFeedback?.overallComment || '');
  const [pointsEarned, setPointsEarned] = useState(existingFeedback?.pointsEarned || pointsPossible);

  async function handleSave(releaseGrade: boolean) {
    const filteredStrengths = strengths.filter(s => s.trim());
    
    if (filteredStrengths.length === 0) {
      alert('Please add at least one strength before saving.');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        strength_comments: filteredStrengths,
        growth_comments: growth.filter(g => g.trim()),
        next_steps: nextSteps.filter(n => n.trim()),
        narrative_feedback: overallComment,
        points_earned: pointsEarned,
        status: releaseGrade ? 'graded' : 'reviewed',
        grade_released: releaseGrade,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('assignment_submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (error) throw error;

      router.refresh();
      alert(releaseGrade ? 'Feedback saved and grade released!' : 'Feedback saved as draft.');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateAI() {
    setGeneratingAI(true);
    // TODO: Implement AI suggestions endpoint
    alert('AI suggestions coming soon! This will analyze the student work and suggest feedback.');
    setGeneratingAI(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Provide Feedback</h2>
        <button
          onClick={handleGenerateAI}
          disabled={generatingAI}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {generatingAI ? 'Generating...' : 'AI Suggestions'}
        </button>
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Points Earned
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={pointsEarned}
            onChange={(e) => setPointsEarned(Number(e.target.value))}
            max={pointsPossible}
            min={0}
            className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-600">/ {pointsPossible}</span>
        </div>
      </div>

      {/* Strengths */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-green-800 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            Strengths - What did they do well?
          </h3>
          <button
            onClick={() => setStrengths([...strengths, ''])}
            className="text-sm text-green-700 hover:text-green-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_STRENGTHS.map(strength => (
            <button
              key={strength}
              onClick={() => setStrengths([...strengths, strength])}
              className="px-2 py-1 text-xs bg-white border border-green-300 rounded-full hover:bg-green-100 transition-colors"
            >
              + {strength}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {strengths.map((strength, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={strength}
                onChange={(e) => {
                  const newStrengths = [...strengths];
                  newStrengths[index] = e.target.value;
                  setStrengths(newStrengths);
                }}
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                rows={2}
                placeholder="Describe what the student did well..."
              />
              {strengths.length > 1 && (
                <button
                  onClick={() => setStrengths(strengths.filter((_, i) => i !== index))}
                  className="px-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Growth Areas */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Growth Areas - Where can they improve?
          </h3>
          <button
            onClick={() => setGrowth([...growth, ''])}
            className="text-sm text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_GROWTH.map(item => (
            <button
              key={item}
              onClick={() => setGrowth([...growth, item])}
              className="px-2 py-1 text-xs bg-white border border-blue-300 rounded-full hover:bg-blue-100 transition-colors"
            >
              + {item}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {growth.map((item, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={item}
                onChange={(e) => {
                  const newGrowth = [...growth];
                  newGrowth[index] = e.target.value;
                  setGrowth(newGrowth);
                }}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                rows={2}
                placeholder="Suggest areas for improvement..."
              />
              {growth.length > 1 && (
                <button
                  onClick={() => setGrowth(growth.filter((_, i) => i !== index))}
                  className="px-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-800 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Next Steps - What should they do next?
          </h3>
          <button
            onClick={() => setNextSteps([...nextSteps, ''])}
            className="text-sm text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={step}
                onChange={(e) => {
                  const newSteps = [...nextSteps];
                  newSteps[index] = e.target.value;
                  setNextSteps(newSteps);
                }}
                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                rows={2}
                placeholder="Provide actionable next steps..."
              />
              {nextSteps.length > 1 && (
                <button
                  onClick={() => setNextSteps(nextSteps.filter((_, i) => i !== index))}
                  className="px-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overall Comment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Overall Comment (Optional)
        </label>
        <textarea
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any additional context or summary of feedback..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-sm text-slate-600">
          {gradeReleased ? (
            <span className="text-green-600 font-medium">Grade already released to student</span>
          ) : (
            <span>Save as draft or release grade to student</span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {saving ? 'Releasing...' : gradeReleased ? 'Update & Keep Released' : 'Release Grade'}
          </button>
        </div>
      </div>
    </div>
  );
}
