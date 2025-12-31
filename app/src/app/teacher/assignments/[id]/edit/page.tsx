'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, X, Save, Eye } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  subject_area: string;
  points_possible: number;
  due_date: string;
  min_grade_level: number;
  max_grade_level: number;
  scaffolding_hints: string[];
  extension_challenges: string[];
  learning_objectives: string[];
  collaboration_mode: string;
  allow_revisions: boolean;
  ai_feedback: boolean;
  ai_accuracy_check: boolean;
  is_published: boolean;
}

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subjectArea, setSubjectArea] = useState('mythology');
  const [pointsPossible, setPointsPossible] = useState(100);
  const [dueDate, setDueDate] = useState('');
  const [minGradeLevel, setMinGradeLevel] = useState(3);
  const [maxGradeLevel, setMaxGradeLevel] = useState(12);
  const [collaborationMode, setCollaborationMode] = useState('individual');
  const [allowRevisions, setAllowRevisions] = useState(true);
  const [aiFeedback, setAiFeedback] = useState(false);
  const [aiAccuracyCheck, setAiAccuracyCheck] = useState(false);

  // Dynamic arrays
  const [scaffoldingHints, setScaffoldingHints] = useState<string[]>(['']);
  const [extensionChallenges, setExtensionChallenges] = useState<string[]>(['']);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['']);

  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    loadAssignment();
  }, [params.id]);

  async function loadAssignment() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: assignment, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      // Populate form with existing data
      setTitle(assignment.title);
      setDescription(assignment.description || '');
      setInstructions(assignment.instructions || '');
      setSubjectArea(assignment.subject_area);
      setPointsPossible(assignment.points_possible);
      setDueDate(assignment.due_date ? assignment.due_date.split('T')[0] : '');
      setMinGradeLevel(assignment.min_grade_level);
      setMaxGradeLevel(assignment.max_grade_level);
      setScaffoldingHints(assignment.scaffolding_hints?.length > 0 ? assignment.scaffolding_hints : ['']);
      setExtensionChallenges(assignment.extension_challenges?.length > 0 ? assignment.extension_challenges : ['']);
      setLearningObjectives(assignment.learning_objectives?.length > 0 ? assignment.learning_objectives : ['']);
      setCollaborationMode(assignment.collaboration_mode || 'individual');
      setAllowRevisions(assignment.allow_revisions);
      setAiFeedback(assignment.ai_feedback);
      setAiAccuracyCheck(assignment.ai_accuracy_check);
      setIsPublished(assignment.is_published);

      setLoading(false);
    } catch (error) {
      console.error('Error loading assignment:', error);
      alert('Failed to load assignment');
      router.push('/teacher/assignments');
    }
  }

  const addScaffoldingHint = () => setScaffoldingHints([...scaffoldingHints, '']);
  const removeScaffoldingHint = (index: number) => {
    setScaffoldingHints(scaffoldingHints.filter((_, i) => i !== index));
  };
  const updateScaffoldingHint = (index: number, value: string) => {
    const newHints = [...scaffoldingHints];
    newHints[index] = value;
    setScaffoldingHints(newHints);
  };

  const addExtensionChallenge = () => setExtensionChallenges([...extensionChallenges, '']);
  const removeExtensionChallenge = (index: number) => {
    setExtensionChallenges(extensionChallenges.filter((_, i) => i !== index));
  };
  const updateExtensionChallenge = (index: number, value: string) => {
    const newChallenges = [...extensionChallenges];
    newChallenges[index] = value;
    setExtensionChallenges(newChallenges);
  };

  const addLearningObjective = () => setLearningObjectives([...learningObjectives, '']);
  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };
  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...learningObjectives];
    newObjectives[index] = value;
    setLearningObjectives(newObjectives);
  };

  async function handleSubmit(publish: boolean) {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Filter out empty entries
      const filteredHints = scaffoldingHints.filter(h => h.trim());
      const filteredChallenges = extensionChallenges.filter(c => c.trim());
      const filteredObjectives = learningObjectives.filter(o => o.trim());

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        subject_area: subjectArea,
        points_possible: pointsPossible,
        due_date: dueDate || null,
        min_grade_level: minGradeLevel,
        max_grade_level: maxGradeLevel,
        scaffolding_hints: filteredHints,
        extension_challenges: filteredChallenges,
        learning_objectives: filteredObjectives,
        collaboration_mode: collaborationMode,
        allow_revisions: allowRevisions,
        ai_feedback: aiFeedback,
        ai_accuracy_check: aiAccuracyCheck,
        is_published: publish,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', params.id);

      if (error) throw error;

      router.push(`/teacher/assignments/${params.id}`);
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Edit Assignment</h1>
          <p className="text-slate-600 mt-1">Update assignment details and differentiation strategies</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Create Your First Deity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief overview of the assignment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed instructions for students..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Subject Area *
                  </label>
                  <select
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mythology">Mythology</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="civics">Civics</option>
                    <option value="math">Math</option>
                    <option value="ela">English/Language Arts</option>
                    <option value="art">Art</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Points Possible
                  </label>
                  <input
                    type="number"
                    value={pointsPossible}
                    onChange={(e) => setPointsPossible(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Multi-Age Differentiation */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Multi-Age Differentiation</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Minimum Grade Level
                  </label>
                  <select
                    value={minGradeLevel}
                    onChange={(e) => setMinGradeLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 3}>Grade {i + 3}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Maximum Grade Level
                  </label>
                  <select
                    value={maxGradeLevel}
                    onChange={(e) => setMaxGradeLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 3}>Grade {i + 3}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Scaffolding Hints (for younger/struggling students)
                  </label>
                  <button
                    onClick={addScaffoldingHint}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hint
                  </button>
                </div>
                <div className="space-y-2">
                  {scaffoldingHints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hint}
                        onChange={(e) => updateScaffoldingHint(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Start by thinking about what your god controls..."
                      />
                      {scaffoldingHints.length > 1 && (
                        <button
                          onClick={() => removeScaffoldingHint(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Extension Challenges (for advanced students)
                  </label>
                  <button
                    onClick={addExtensionChallenge}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Challenge
                  </button>
                </div>
                <div className="space-y-2">
                  {extensionChallenges.map((challenge, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={challenge}
                        onChange={(e) => updateExtensionChallenge(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Create a complex family tree with multiple generations..."
                      />
                      {extensionChallenges.length > 1 && (
                        <button
                          onClick={() => removeExtensionChallenge(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Learning Objectives</h2>
              <button
                onClick={addLearningObjective}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Objective
              </button>
            </div>
            <div className="space-y-2">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateLearningObjective(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Students will understand the role of creation myths..."
                  />
                  {learningObjectives.length > 1 && (
                    <button
                      onClick={() => removeLearningObjective(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Collaboration Mode
                </label>
                <select
                  value={collaborationMode}
                  onChange={(e) => setCollaborationMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual Work</option>
                  <option value="pairs">Pair Work</option>
                  <option value="small_group">Small Group (3-4)</option>
                  <option value="whole_class">Whole Class</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRevisions}
                    onChange={(e) => setAllowRevisions(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Allow Unlimited Revisions</div>
                    <div className="text-sm text-slate-600">Students can improve and resubmit based on feedback</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiFeedback}
                    onChange={(e) => setAiFeedback(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">AI Writing Feedback</div>
                    <div className="text-sm text-slate-600">Provide instant grammar and style suggestions</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiAccuracyCheck}
                    onChange={(e) => setAiAccuracyCheck(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">AI Accuracy Check</div>
                    <div className="text-sm text-slate-600">Verify factual accuracy for science, history, and civics content</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 pt-6 flex items-center justify-between">
            <button
              onClick={() => router.push(`/teacher/assignments/${params.id}`)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              disabled={saving}
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>

              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {saving ? 'Publishing...' : isPublished ? 'Save & Keep Published' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
