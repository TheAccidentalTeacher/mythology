'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Sparkles, Target, BookOpen, Lightbulb, Users } from 'lucide-react';

const SUBJECT_AREAS = [
  { value: 'mythology', label: '🏛️ Mythology', icon: '🏛️' },
  { value: 'science', label: '🧬 Science', icon: '🧬' },
  { value: 'history', label: '📜 History', icon: '📜' },
  { value: 'civics', label: '🗽 Civics/Government', icon: '🗽' },
  { value: 'math', label: '➗ Mathematics', icon: '➗' },
  { value: 'ela', label: '📚 English/Language Arts', icon: '📚' },
  { value: 'art', label: '🎨 Arts', icon: '🎨' },
];

const COLLABORATION_MODES = [
  { value: 'individual_only', label: 'Individual Work Only', description: 'Students work alone' },
  { value: 'optional', label: 'Optional Collaboration', description: 'Students choose' },
  { value: 'required', label: 'Required Collaboration', description: 'Must work together' },
];

function CreateAssignmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [classroom, setClassroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const templateId = searchParams?.get('templateId');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subjectArea, setSubjectArea] = useState('mythology');
  const [minGrade, setMinGrade] = useState<number>(5);
  const [maxGrade, setMaxGrade] = useState<number>(8);
  const [dueDate, setDueDate] = useState('');
  const [pointsPossible, setPointsPossible] = useState(100);
  const [collaborationMode, setCollaborationMode] = useState('optional');
  const [allowRevisions, setAllowRevisions] = useState(true);
  const [maxRevisions, setMaxRevisions] = useState<number | null>(null);
  const [aiFeedbackEnabled, setAiFeedbackEnabled] = useState(true);
  const [aiAccuracyCheck, setAiAccuracyCheck] = useState(false);
  const [scaffoldingHints, setScaffoldingHints] = useState<string[]>(['']);
  const [extensionChallenges, setExtensionChallenges] = useState<string[]>(['']);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['']);

  useEffect(() => {
    loadClassroom();
  }, []);

  useEffect(() => {
    if (templateId && !loading) {
      loadTemplate();
    }
  }, [templateId, loading]);

  const loadTemplate = async () => {
    try {
      const { data: template, error } = await supabase
        .from('assignment_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        alert('Failed to load template');
        return;
      }

      // Populate form from template
      setTitle(template.title);
      setDescription(template.description || '');
      setInstructions(template.instructions || '');
      
      if (template.template_data) {
        const data = template.template_data;
        setSubjectArea(data.subject_area || 'mythology');
        setMinGrade(data.min_grade_level || 5);
        setMaxGrade(data.max_grade_level || 8);
        setPointsPossible(data.points_possible || 100);
        setAiAccuracyCheck(data.ai_accuracy_check || false);
        setAllowRevisions(data.allow_revisions !== false);
        
        if (data.scaffolding_hints && data.scaffolding_hints.length > 0) {
          setScaffoldingHints(data.scaffolding_hints);
        }
        if (data.extension_challenges && data.extension_challenges.length > 0) {
          setExtensionChallenges(data.extension_challenges);
        }
        if (data.learning_objectives && data.learning_objectives.length > 0) {
          setLearningObjectives(data.learning_objectives);
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const loadClassroom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: classroomData } = await supabase
      .from('classrooms')
      .select('*')
      .eq('teacher_id', user.id)
      .single();

    if (!classroomData) {
      router.push('/teacher/dashboard');
      return;
    }

    setClassroom(classroomData);
    setLoading(false);
  };

  const addScaffoldingHint = () => {
    setScaffoldingHints([...scaffoldingHints, '']);
  };

  const updateScaffoldingHint = (index: number, value: string) => {
    const newHints = [...scaffoldingHints];
    newHints[index] = value;
    setScaffoldingHints(newHints);
  };

  const removeScaffoldingHint = (index: number) => {
    setScaffoldingHints(scaffoldingHints.filter((_, i) => i !== index));
  };

  const addExtensionChallenge = () => {
    setExtensionChallenges([...extensionChallenges, '']);
  };

  const updateExtensionChallenge = (index: number, value: string) => {
    const newChallenges = [...extensionChallenges];
    newChallenges[index] = value;
    setExtensionChallenges(newChallenges);
  };

  const removeExtensionChallenge = (index: number) => {
    setExtensionChallenges(extensionChallenges.filter((_, i) => i !== index));
  };

  const addLearningObjective = () => {
    setLearningObjectives([...learningObjectives, '']);
  };

  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...learningObjectives];
    newObjectives[index] = value;
    setLearningObjectives(newObjectives);
  };

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const assignmentData = {
        classroom_id: classroom.id,
        teacher_id: user.id,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        subject_area: subjectArea,
        min_grade_level: minGrade,
        max_grade_level: maxGrade,
        due_date: dueDate || null,
        points_possible: pointsPossible,
        collaboration_mode: collaborationMode,
        allow_revisions: allowRevisions,
        max_revisions: maxRevisions,
        ai_feedback_enabled: aiFeedbackEnabled,
        ai_accuracy_check: aiAccuracyCheck,
        scaffolding_hints: scaffoldingHints.filter(h => h.trim()),
        extension_challenges: extensionChallenges.filter(c => c.trim()),
        learning_objectives: learningObjectives.filter(o => o.trim()),
        is_published: publish,
      };

      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;

      router.push(`/teacher/assignments/${data.id}`);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/teacher/assignments"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Assignment</h1>
            <p className="text-gray-300">Spark curiosity and engage all learners</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Create Your First God or Goddess"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what students will learn..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Detailed instructions for students..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Subject Area
                  </label>
                  <select
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    {SUBJECT_AREAS.map(subject => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Points Possible
                  </label>
                  <input
                    type="number"
                    value={pointsPossible}
                    onChange={(e) => setPointsPossible(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
              </div>
            </div>
          </div>

          {/* Multi-Age Differentiation */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Multi-Age Differentiation
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Minimum Grade Level
                  </label>
                  <input
                    type="number"
                    value={minGrade}
                    onChange={(e) => setMinGrade(parseInt(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Maximum Grade Level
                  </label>
                  <input
                    type="number"
                    value={maxGrade}
                    onChange={(e) => setMaxGrade(parseInt(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Scaffolding Hints */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Scaffolding Hints (for struggling students)
                </label>
                <div className="space-y-2">
                  {scaffoldingHints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hint}
                        onChange={(e) => updateScaffoldingHint(index, e.target.value)}
                        placeholder={`Hint ${index + 1}: e.g., Think about what your god controls...`}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                      {scaffoldingHints.length > 1 && (
                        <button
                          onClick={() => removeScaffoldingHint(index)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addScaffoldingHint}
                  className="mt-2 text-sm text-purple-300 hover:text-purple-200"
                >
                  + Add another hint
                </button>
              </div>

              {/* Extension Challenges */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Extension Challenges (for advanced students)
                </label>
                <div className="space-y-2">
                  {extensionChallenges.map((challenge, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={challenge}
                        onChange={(e) => updateExtensionChallenge(index, e.target.value)}
                        placeholder={`Challenge ${index + 1}: e.g., Create a myth about your god...`}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                      {extensionChallenges.length > 1 && (
                        <button
                          onClick={() => removeExtensionChallenge(index)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addExtensionChallenge}
                  className="mt-2 text-sm text-purple-300 hover:text-purple-200"
                >
                  + Add another challenge
                </button>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Learning Objectives</h2>
            <div className="space-y-2">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateLearningObjective(index, e.target.value)}
                    placeholder={`Objective ${index + 1}: e.g., Students will create original characters...`}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  />
                  {learningObjectives.length > 1 && (
                    <button
                      onClick={() => removeLearningObjective(index)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addLearningObjective}
              className="mt-2 text-sm text-green-300 hover:text-green-200"
            >
              + Add objective
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Assignment Settings
            </h2>

            <div className="space-y-4">
              {/* Collaboration Mode */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Collaboration Mode
                </label>
                <div className="space-y-2">
                  {COLLABORATION_MODES.map(mode => (
                    <label key={mode.value} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="radio"
                        name="collaboration"
                        value={mode.value}
                        checked={collaborationMode === mode.value}
                        onChange={(e) => setCollaborationMode(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-white font-medium">{mode.label}</div>
                        <div className="text-gray-400 text-sm">{mode.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Revisions */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRevisions}
                    onChange={(e) => setAllowRevisions(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-medium">Allow Revisions (Growth Mindset!)</span>
                </label>

                {allowRevisions && (
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Maximum Revisions (leave blank for unlimited)
                    </label>
                    <input
                      type="number"
                      value={maxRevisions || ''}
                      onChange={(e) => setMaxRevisions(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Unlimited"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    />
                  </div>
                )}
              </div>

              {/* AI Settings */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiFeedbackEnabled}
                    onChange={(e) => setAiFeedbackEnabled(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-medium">AI Feedback Assistance</span>
                </label>
                <p className="text-gray-400 text-sm ml-7">
                  AI can provide gentle suggestions for feedback (you review before sending)
                </p>

                {(subjectArea === 'science' || subjectArea === 'history' || subjectArea === 'civics') && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiAccuracyCheck}
                        onChange={(e) => setAiAccuracyCheck(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-white font-medium">AI Accuracy Verification</span>
                    </label>
                    <p className="text-gray-400 text-sm ml-7">
                      AI will check factual accuracy in {subjectArea} content
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <Eye className="w-5 h-5" />
              Publish Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <CreateAssignmentForm />
    </Suspense>
  );
}
