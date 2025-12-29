'use client';

import { useState, useEffect } from 'react';

const STYLE_OPTIONS = [
  { id: 'illustrated-storybook', name: 'Storybook', emoji: '📖' },
  { id: 'watercolor', name: 'Watercolor', emoji: '🎨' },
  { id: 'ancient-stone-carving', name: 'Stone Carving', emoji: '🗿' },
  { id: 'comic-book', name: 'Comic Book', emoji: '💥' },
  { id: 'pixel-art', name: 'Pixel Art', emoji: '👾' },
  { id: 'oil-painting', name: 'Oil Painting', emoji: '🖼️' },
  { id: 'cave-painting', name: 'Cave Art', emoji: '🦣' },
  { id: 'anime-manga', name: 'Anime', emoji: '✨' },
];

const MATH_TOPIC_OPTIONS = [
  { id: 'mult-1-12', name: 'Multiplication (1-12)', category: 'arithmetic' },
  { id: 'addition-single', name: 'Addition (Single Digit)', category: 'arithmetic' },
  { id: 'subtraction-basic', name: 'Subtraction (Basic)', category: 'arithmetic' },
  { id: 'division-basic', name: 'Division (Basic)', category: 'arithmetic' },
  { id: 'fractions-basic', name: 'Fractions (Basic)', category: 'fractions' },
  { id: 'decimals-operations', name: 'Decimal Operations', category: 'decimals' },
  { id: 'parallelogram-area', name: 'Parallelogram Area', category: 'geometry' },
  { id: 'triangle-area', name: 'Triangle Area', category: 'geometry' },
  { id: 'ratio-concepts', name: 'Ratios', category: 'ratios' },
  { id: 'percent-basics', name: 'Percentages', category: 'percents' },
  { id: 'solve-equations', name: 'Solving Equations', category: 'algebra' },
  { id: 'coordinate-plane', name: 'Coordinate Plane', category: 'geometry' },
  { id: 'order-of-operations', name: 'Order of Operations', category: 'arithmetic' },
  { id: 'absolute-value', name: 'Absolute Value', category: 'algebra' },
  { id: 'exponents', name: 'Exponents', category: 'algebra' },
  { id: 'gcf-lcm', name: 'GCF & LCM', category: 'arithmetic' },
  { id: 'integers-operations', name: 'Integer Operations', category: 'arithmetic' },
  { id: 'algebra-linear', name: 'Linear Equations', category: 'algebra' },
  { id: 'geometry-area', name: 'Area Calculations', category: 'geometry' },
];

interface ClassImageSettings {
  imageGenEnabled: boolean;
  requireApproval: boolean;
  dailyLimitPerStudent: number;
  freeImageCount: number;
  questionsPerToken: number;
  allowedStyles: string[];
  blockedMathTopics: string[];
  maxStudentAdditionLength: number;
  customBlockedTerms: string[];
}

const DEFAULT_SETTINGS: ClassImageSettings = {
  imageGenEnabled: true,
  requireApproval: true,
  dailyLimitPerStudent: 3,
  freeImageCount: 5,
  questionsPerToken: 3,
  allowedStyles: STYLE_OPTIONS.map(s => s.id),
  blockedMathTopics: [],
  maxStudentAdditionLength: 100,
  customBlockedTerms: [],
};

export default function TeacherImageSettings() {
  const [settings, setSettings] = useState<ClassImageSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newBlockedTerm, setNewBlockedTerm] = useState('');

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/classroom/image-settings');
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data.settings,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/classroom/image-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStyle = (styleId: string) => {
    setSettings(prev => ({
      ...prev,
      allowedStyles: prev.allowedStyles.includes(styleId)
        ? prev.allowedStyles.filter(s => s !== styleId)
        : [...prev.allowedStyles, styleId]
    }));
  };

  const toggleMathTopic = (topicId: string) => {
    setSettings(prev => ({
      ...prev,
      blockedMathTopics: prev.blockedMathTopics.includes(topicId)
        ? prev.blockedMathTopics.filter(t => t !== topicId)
        : [...prev.blockedMathTopics, topicId]
    }));
  };

  const addBlockedTerm = () => {
    if (newBlockedTerm.trim() && !settings.customBlockedTerms.includes(newBlockedTerm.trim().toLowerCase())) {
      setSettings(prev => ({
        ...prev,
        customBlockedTerms: [...prev.customBlockedTerms, newBlockedTerm.trim().toLowerCase()]
      }));
      setNewBlockedTerm('');
    }
  };

  const removeBlockedTerm = (term: string) => {
    setSettings(prev => ({
      ...prev,
      customBlockedTerms: prev.customBlockedTerms.filter(t => t !== term)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎨 Image Generation Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure how students can generate AI images in your classroom
        </p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {saveMessage.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Master Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Enable Image Generation
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow students to generate AI images for their mythology creations
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.imageGenEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, imageGenEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Moderation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🛡️ Moderation Settings
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Require Teacher Approval
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Review images before they become visible to others
                </p>
              </div>
            </label>

            {/* Custom blocked terms */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Blocked Terms
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Add words that students cannot use in their custom additions
              </p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newBlockedTerm}
                  onChange={(e) => setNewBlockedTerm(e.target.value)}
                  placeholder="Enter a word to block"
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addBlockedTerm()}
                />
                <button
                  onClick={addBlockedTerm}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              
              {settings.customBlockedTerms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {settings.customBlockedTerms.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
                    >
                      {term}
                      <button
                        onClick={() => removeBlockedTerm(term)}
                        className="hover:text-red-900 dark:hover:text-red-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Economy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎮 Token Economy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Free Images Per Student
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={settings.freeImageCount}
                onChange={(e) => setSettings(prev => ({ ...prev, freeImageCount: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Before tokens required</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Questions Per Token
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.questionsPerToken}
                onChange={(e) => setSettings(prev => ({ ...prev, questionsPerToken: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Correct answers to earn 1 token</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Limit Per Student
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.dailyLimitPerStudent}
                onChange={(e) => setSettings(prev => ({ ...prev, dailyLimitPerStudent: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum images per day</p>
            </div>
          </div>
        </div>

        {/* Art Styles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🖼️ Allowed Art Styles
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select which art styles students can use
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  settings.allowedStyles.includes(style.id)
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-600 opacity-50'
                }`}
              >
                <span className="text-2xl block mb-1">{style.emoji}</span>
                <span className="text-xs font-medium">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Math Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🧮 Math Quiz Topics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Disable topics that you don&apos;t want in the quiz (e.g., not yet covered in class)
          </p>
          
          <div className="space-y-4">
            {['arithmetic', 'fractions', 'decimals', 'geometry', 'algebra', 'ratios', 'percents'].map((category) => {
              const topicsInCategory = MATH_TOPIC_OPTIONS.filter(t => t.category === category);
              if (topicsInCategory.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {topicsInCategory.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => toggleMathTopic(topic.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          settings.blockedMathTopics.includes(topic.id)
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 line-through'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {settings.blockedMathTopics.length === 0 
              ? '✓ All topics enabled'
              : `${settings.blockedMathTopics.length} topic(s) disabled`}
          </p>
        </div>

        {/* Student Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✏️ Student Custom Input
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Characters
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={settings.maxStudentAdditionLength}
              onChange={(e) => setSettings(prev => ({ ...prev, maxStudentAdditionLength: parseInt(e.target.value) || 0 }))}
              className="w-full max-w-xs px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 to disable custom student additions entirely
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
