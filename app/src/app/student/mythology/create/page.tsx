'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { MythologyWizard } from '@/components/ai';
import { Wand2, PenTool, Sparkles } from 'lucide-react';
import StandardsBadge from '@/components/StandardsBadge';
import VoiceTextarea from '@/components/VoiceTextarea';

const mythologySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  timeframe: z.string().min(1, 'Please select a timeframe'),
  genre: z.string().min(1, 'Please select a genre'),
  geography_type: z.string().optional(),
  setting_description: z.string().optional(),
  cultural_inspiration: z.string().optional(),
  visibility: z.enum(['public', 'teacher_only', 'hidden']),
});

type MythologyForm = z.infer<typeof mythologySchema>;

export default function CreateMythology() {
  const router = useRouter();
  const supabase = createClient();
  
  const [creationMode, setCreationMode] = useState<'choose' | 'wizard' | 'manual'>('choose');
  const [showWizard, setShowWizard] = useState(false);
  const [formData, setFormData] = useState<Partial<MythologyForm>>({
    visibility: 'public',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: keyof MythologyForm, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setErrors({});

    // Validate form
    const result = mythologySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setGeneralError('You must be logged in to create a mythology');
      setLoading(false);
      return;
    }

    // Get user's classroom
    const { data: profile } = await supabase
      .from('profiles')
      .select('classroom_id')
      .eq('id', user.id)
      .single();

    // Create mythology
    const { data, error } = await supabase
      .from('mythologies')
      .insert({
        ...result.data,
        created_by: user.id,
        classroom_id: profile?.classroom_id || null,
      })
      .select()
      .single();

    if (error) {
      setGeneralError('Failed to create mythology: ' + error.message);
      setLoading(false);
      return;
    }

    // Award points for first mythology (simplified - should check if it's actually first)
    await supabase
      .from('profiles')
      .update({ 
        points: (await supabase.from('profiles').select('points').eq('id', user.id).single()).data?.points || 0 + 50
      })
      .eq('id', user.id);

    // Redirect to mythology detail page
    router.push(`/student/mythology/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => creationMode !== 'choose' ? setCreationMode('choose') : router.back()}
            className="text-gray-300 hover:text-white mb-4 flex items-center"
          >
            ← {creationMode !== 'choose' ? 'Back to Options' : 'Back to Dashboard'}
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Mythology</h1>
          <p className="text-gray-300">Build your own mythology universe from scratch</p>
        </div>

        {/* Mythology Wizard Modal */}
        <MythologyWizard 
          isOpen={showWizard} 
          onClose={() => {
            setShowWizard(false);
            setCreationMode('choose');
          }}
          onComplete={(mythologyId) => {
            router.push(`/student/mythology/${mythologyId}`);
          }}
        />

        {/* Creation Mode Selection */}
        {creationMode === 'choose' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wizard Option */}
              <button
                onClick={() => setShowWizard(true)}
                className="group relative bg-linear-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all text-left"
              >
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-Guided
                </div>
                <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Creation Wizard ✨</h3>
                <p className="text-gray-300 mb-4">
                  Let AI guide you through creating your mythology step-by-step. Perfect for first-timers!
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Choose from 6 world categories</li>
                  <li>• Geography interview with the Five Themes</li>
                  <li>• Get AI-powered name suggestions</li>
                  <li>• Epic reveal of your creation</li>
                </ul>
              </button>

              {/* Manual Option */}
              <button
                onClick={() => setCreationMode('manual')}
                className="group bg-white/10 hover:bg-white/15 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20 hover:border-white/40 transition-all text-left"
              >
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PenTool className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Manual Creation</h3>
                <p className="text-gray-300 mb-4">
                  Go straight to the form and create your mythology your own way. Full creative control!
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Complete creative freedom</li>
                  <li>• All options available immediately</li>
                  <li>• Perfect for experienced creators</li>
                  <li>• Add AI help buttons to any field</li>
                </ul>
              </button>
            </div>

            <div className="text-center text-gray-400 text-sm">
              💡 Not sure? Try the <span className="text-amber-400">Creation Wizard</span> - it&apos;s designed to spark your creativity!
            </div>
          </div>
        )}

        {/* Manual Form */}
        {creationMode === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {generalError && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Mythology Name */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <label className="block text-white font-semibold mb-2">
              Mythology Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., The Frostborn Pantheon"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-300 text-sm mt-2">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <VoiceTextarea
              label="Description"
              value={formData.description || ''}
              onChange={(value) => handleChange('description', value)}
              placeholder="Describe your mythology world... What makes it unique? What themes does it explore? (Tip: Click the microphone to use voice input!)"
              rows={4}
              required
              minLength={50}
              helpText={`Minimum 50 characters. Current: ${formData.description?.length || 0}`}
            />
            {errors.description && <p className="text-red-300 text-sm mt-2">{errors.description}</p>}
          </div>

          {/* Timeframe & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-2">
                Timeframe *
              </label>
              <select
                value={formData.timeframe || ''}
                onChange={(e) => handleChange('timeframe', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select timeframe</option>
                <option value="ancient">Ancient (Pre-500 AD)</option>
                <option value="medieval">Medieval (500-1500)</option>
                <option value="renaissance">Renaissance (1500-1800)</option>
                <option value="industrial">Industrial (1800-1945)</option>
                <option value="modern">Modern (1945-2000)</option>
                <option value="contemporary">Contemporary (2000+)</option>
                <option value="near_future">Near Future (2025-2100)</option>
                <option value="far_future">Far Future (2100+)</option>
                <option value="post_apocalyptic">Post-Apocalyptic</option>
                <option value="timeless">Timeless/Mythical</option>
              </select>
              {errors.timeframe && <p className="text-red-300 text-sm mt-2">{errors.timeframe}</p>}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <label className="block text-white font-semibold mb-2">
                Genre *
              </label>
              <select
                value={formData.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select genre</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Science Fiction</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="steampunk">Steampunk</option>
                <option value="horror">Horror/Dark</option>
                <option value="superhero">Superhero</option>
                <option value="historical">Historical</option>
                <option value="urban_fantasy">Urban Fantasy</option>
                <option value="mythology">Classical Mythology</option>
                <option value="other">Other</option>
              </select>
              {errors.genre && <p className="text-red-300 text-sm mt-2">{errors.genre}</p>}
            </div>
          </div>

          {/* Geography Type */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <label className="block text-white font-semibold mb-2">
              Geography Type (Optional)
            </label>
            <select
              value={formData.geography_type || ''}
              onChange={(e) => handleChange('geography_type', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select geography</option>
              <option value="arctic">Arctic/Tundra</option>
              <option value="desert">Desert</option>
              <option value="forest">Forest</option>
              <option value="jungle">Jungle</option>
              <option value="mountains">Mountains</option>
              <option value="ocean">Ocean/Islands</option>
              <option value="plains">Plains/Grasslands</option>
              <option value="urban">Urban/City</option>
              <option value="underground">Underground</option>
              <option value="sky">Sky/Clouds</option>
              <option value="space">Space</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Setting Description */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <VoiceTextarea
              label="Setting Description (Optional)"
              value={formData.setting_description || ''}
              onChange={(value) => handleChange('setting_description', value)}
              placeholder="Describe the physical world, climate, key locations... (Tip: Click the microphone to use voice input!)"
              rows={3}
            />
          </div>

          {/* Cultural Inspiration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <label className="block text-white font-semibold mb-2">
              Cultural Inspiration (Optional)
            </label>
            <input
              type="text"
              value={formData.cultural_inspiration || ''}
              onChange={(e) => handleChange('cultural_inspiration', e.target.value)}
              placeholder="e.g., Norse, Greek, Egyptian, Japanese, Original..."
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Visibility */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <label className="block text-white font-semibold mb-3">
              Visibility *
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === 'public'}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-white font-medium">👁️ Public</div>
                  <div className="text-gray-400 text-sm">Everyone can see this</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="teacher_only"
                  checked={formData.visibility === 'teacher_only'}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-white font-medium">🔒 Teacher Only</div>
                  <div className="text-gray-400 text-sm">Only your teacher can see this</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="hidden"
                  checked={formData.visibility === 'hidden'}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-white font-medium">✏️ Hidden (Draft)</div>
                  <div className="text-gray-400 text-sm">Work in progress, only you can see it</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating...' : 'Create Mythology'}
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('choose')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>

      {/* Floating Standards Badge */}
      <StandardsBadge 
        activityType="mythology-creation" 
        activityName="Create Mythology"
        position="bottom-right"
      />
    </div>
  );
}
