'use client';

import { useState } from 'react';
import { Plus, X, Sparkles, ThumbsUp, TrendingUp, Target } from 'lucide-react';

interface NarrativeFeedback {
  strengths: string[];
  growth: string[];
  nextSteps: string[];
  overallComment: string;
}

interface Props {
  feedback: NarrativeFeedback;
  onChange: (feedback: NarrativeFeedback) => void;
  onGenerateAISuggestions?: () => void;
  generatingAI?: boolean;
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
  feedback, 
  onChange, 
  onGenerateAISuggestions,
  generatingAI = false 
}: Props) {
  const addStrength = (strength: string = '') => {
    onChange({
      ...feedback,
      strengths: [...feedback.strengths, strength]
    });
  };

  const updateStrength = (index: number, value: string) => {
    const newStrengths = [...feedback.strengths];
    newStrengths[index] = value;
    onChange({ ...feedback, strengths: newStrengths });
  };

  const removeStrength = (index: number) => {
    onChange({
      ...feedback,
      strengths: feedback.strengths.filter((_, i) => i !== index)
    });
  };

  const addGrowth = (growth: string = '') => {
    onChange({
      ...feedback,
      growth: [...feedback.growth, growth]
    });
  };

  const updateGrowth = (index: number, value: string) => {
    const newGrowth = [...feedback.growth];
    newGrowth[index] = value;
    onChange({ ...feedback, growth: newGrowth });
  };

  const removeGrowth = (index: number) => {
    onChange({
      ...feedback,
      growth: feedback.growth.filter((_, i) => i !== index)
    });
  };

  const addNextStep = (step: string = '') => {
    onChange({
      ...feedback,
      nextSteps: [...feedback.nextSteps, step]
    });
  };

  const updateNextStep = (index: number, value: string) => {
    const newSteps = [...feedback.nextSteps];
    newSteps[index] = value;
    onChange({ ...feedback, nextSteps: newSteps });
  };

  const removeNextStep = (index: number) => {
    onChange({
      ...feedback,
      nextSteps: feedback.nextSteps.filter((_, i) => i !== index)
    });
  };

  const setOverallComment = (comment: string) => {
    onChange({ ...feedback, overallComment: comment });
  };

  return (
    <div className="space-y-6">
      {/* Strengths */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-xl border border-green-400/30 p-6">
        <h4 className="text-xl font-semibold text-green-300 mb-3 flex items-center gap-2">
          <ThumbsUp className="w-5 h-5" />
          ✨ Strengths - What did they do well?
        </h4>
        <p className="text-gray-300 text-sm mb-4">
          Start with positivity! Highlight what the student did well.
        </p>
        
        {/* Quick-add common strengths */}
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_STRENGTHS.map(strength => (
            <button
              key={strength}
              onClick={() => addStrength(strength)}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm rounded-lg transition-colors"
            >
              + {strength}
            </button>
          ))}
        </div>
        
        {/* Strength inputs */}
        <div className="space-y-2">
          {feedback.strengths.map((strength, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                value={strength}
                onChange={(e) => updateStrength(idx, e.target.value)}
                placeholder="e.g., Your god's powers are unique and well-explained"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
              <button 
                onClick={() => removeStrength(idx)}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => addStrength()}
          className="mt-3 text-sm text-green-300 hover:text-green-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add another strength
        </button>
      </div>

      {/* Areas for Growth */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 p-6">
        <h4 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          🌱 Areas for Growth - What could be improved?
        </h4>
        <p className="text-gray-300 text-sm mb-4">
          Frame feedback positively. Focus on opportunities, not failures.
        </p>
        
        {/* Quick-add common growth areas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_GROWTH.map(growth => (
            <button
              key={growth}
              onClick={() => addGrowth(growth)}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm rounded-lg transition-colors"
            >
              + {growth}
            </button>
          ))}
        </div>
        
        {/* Growth inputs */}
        <div className="space-y-2">
          {feedback.growth.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea 
                value={item}
                onChange={(e) => updateGrowth(idx, e.target.value)}
                placeholder="e.g., Consider adding more detail about your god's personality and how they interact with mortals"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                rows={2}
              />
              <button 
                onClick={() => removeGrowth(idx)}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors self-start"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => addGrowth()}
          className="mt-3 text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add growth area
        </button>
      </div>

      {/* Next Steps (Actionable!) */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
        <h4 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          🎯 Next Steps - What specific actions should they take?
        </h4>
        <p className="text-gray-300 text-sm mb-4">
          Give concrete, actionable steps. Make it clear what to do next.
        </p>
        
        {/* Next step inputs */}
        <div className="space-y-2">
          {feedback.nextSteps.map((step, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                value={step}
                onChange={(e) => updateNextStep(idx, e.target.value)}
                placeholder="e.g., Try writing one myth about your god's origin story"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              <button 
                onClick={() => removeNextStep(idx)}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => addNextStep()}
          className="mt-3 text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add next step
        </button>
      </div>

      {/* Overall Comment */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
        <h4 className="text-xl font-semibold text-white mb-3">💬 Overall Comment</h4>
        <p className="text-gray-300 text-sm mb-4">
          Your overall thoughts about this work. This is the heart of your feedback.
        </p>
        <textarea
          value={feedback.overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
          placeholder="Write your overall thoughts here... Be encouraging, specific, and honest."
          rows={6}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
        />
      </div>

      {/* AI Assistance */}
      {onGenerateAISuggestions && (
        <div className="border-t border-white/20 pt-6">
          <button 
            onClick={onGenerateAISuggestions}
            disabled={generatingAI}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-400/30 rounded-lg text-indigo-300 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            {generatingAI ? 'Generating AI suggestions...' : 'Get AI suggestions for feedback (you review before sending)'}
          </button>
          <p className="text-gray-400 text-sm mt-2">
            AI will provide gentle suggestions. You review and edit before the student sees anything.
          </p>
        </div>
      )}
    </div>
  );
}
