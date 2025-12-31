'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Shield, AlertTriangle, Image as ImageIcon, BookOpen, 
  CheckCircle, XCircle, Eye, Flag, Clock, User, Filter,
  ChevronRight, RefreshCw
} from 'lucide-react';

interface FlaggedMythology {
  id: string;
  name: string;
  flagged_reason: string | null;
  moderation_status: string;
  created_at: string;
  updated_at: string;
  creator?: {
    display_name: string;
    email: string;
  };
}

interface PendingImage {
  id: string;
  entity_type: string;
  entity_id: string;
  image_url: string;
  prompt: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
  };
}

interface ModerationStats {
  flaggedMythologies: number;
  pendingImages: number;
  approvedToday: number;
  rejectedToday: number;
}

type TabType = 'overview' | 'flagged' | 'images';

export default function TeacherModerationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [flaggedMythologies, setFlaggedMythologies] = useState<FlaggedMythology[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    flaggedMythologies: 0,
    pendingImages: 0,
    approvedToday: 0,
    rejectedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Verify teacher
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get teacher's classroom
      const { data: classroom } = await supabase
        .from('classrooms')
        .select('id')
        .eq('teacher_id', user.id)
        .single();

      if (!classroom) {
        router.push('/teacher/dashboard');
        return;
      }

      // Fetch flagged mythologies
      const { data: flaggedData } = await supabase
        .from('mythologies')
        .select(`
          id, name, flagged_reason, moderation_status, created_at, updated_at,
          creator:profiles!mythologies_created_by_fkey(display_name, email)
        `)
        .eq('classroom_id', classroom.id)
        .eq('moderation_status', 'flagged')
        .order('updated_at', { ascending: false });

      // Transform the data to extract creator from array (Supabase returns foreign keys as arrays)
      const transformedFlaggedData = flaggedData?.map(item => ({
        ...item,
        creator: Array.isArray(item.creator) ? item.creator[0] : item.creator
      })) || [];

      setFlaggedMythologies(transformedFlaggedData);

      // Fetch pending images
      const { data: imageData } = await supabase
        .from('generated_images')
        .select(`
          id, entity_type, entity_id, image_url, prompt, status, created_at, user_id,
          profiles(display_name)
        `)
        .eq('status', 'pending')
        .in('user_id', 
          (await supabase
            .from('profiles')
            .select('id')
            .eq('classroom_id', classroom.id)
          ).data?.map(p => p.id) || []
        )
        .order('created_at', { ascending: false });

      // Transform the data to extract profiles from array
      const transformedImageData = imageData?.map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) || [];

      setPendingImages(transformedImageData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      
      const { count: approvedCount } = await supabase
        .from('generated_images')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('updated_at', today);

      const { count: rejectedCount } = await supabase
        .from('generated_images')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .gte('updated_at', today);

      setStats({
        flaggedMythologies: transformedFlaggedData.length,
        pendingImages: transformedImageData.length,
        approvedToday: approvedCount || 0,
        rejectedToday: rejectedCount || 0,
      });

    } catch (error) {
      console.error('Error fetching moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMythologyAction = async (mythologyId: string, action: 'approve' | 'unflag') => {
    setActionLoading(mythologyId);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('mythologies')
        .update({
          moderation_status: action === 'approve' ? 'approved' : 'pending',
          flagged_reason: null,
        })
        .eq('id', mythologyId);

      if (!error) {
        setFlaggedMythologies(prev => prev.filter(m => m.id !== mythologyId));
        setStats(prev => ({ ...prev, flaggedMythologies: prev.flaggedMythologies - 1 }));
      }
    } catch (error) {
      console.error('Error updating mythology:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageAction = async (imageId: string, action: 'approve' | 'reject') => {
    setActionLoading(imageId);

    try {
      const response = await fetch('/api/images/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, action }),
      });

      const data = await response.json();
      if (data.success) {
        setPendingImages(prev => prev.filter(img => img.id !== imageId));
        setStats(prev => ({
          ...prev,
          pendingImages: prev.pendingImages - 1,
          approvedToday: action === 'approve' ? prev.approvedToday + 1 : prev.approvedToday,
          rejectedToday: action === 'reject' ? prev.rejectedToday + 1 : prev.rejectedToday,
        }));
      }
    } catch (error) {
      console.error('Error moderating image:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading moderation queue...</div>
      </div>
    );
  }

  const totalPending = stats.flaggedMythologies + stats.pendingImages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/teacher/dashboard"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Shield className="w-10 h-10" />
                Content Moderation
              </h1>
              <p className="text-gray-300 mt-1">Review and manage flagged content</p>
            </div>
          </div>
          <button
            onClick={fetchModerationData}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border ${totalPending > 0 ? 'border-yellow-500/50' : 'border-white/20'}`}>
            <p className="text-gray-400 text-sm">Needs Review</p>
            <p className={`text-3xl font-bold ${totalPending > 0 ? 'text-yellow-300' : 'text-white'}`}>
              {totalPending}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
            <p className="text-red-400 text-sm">Flagged Mythologies</p>
            <p className="text-3xl font-bold text-red-300">{stats.flaggedMythologies}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
            <p className="text-purple-400 text-sm">Pending Images</p>
            <p className="text-3xl font-bold text-purple-300">{stats.pendingImages}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
            <p className="text-green-400 text-sm">Approved Today</p>
            <p className="text-3xl font-bold text-green-300">{stats.approvedToday}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'flagged'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Flag className="w-4 h-4" />
            Flagged ({stats.flaggedMythologies})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'images'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images ({stats.pendingImages})
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {totalPending === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">All Clear! 🎉</h3>
                <p className="text-gray-300">No content needs moderation right now.</p>
              </div>
            ) : (
              <>
                {/* Flagged Mythologies Quick View */}
                {stats.flaggedMythologies > 0 && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Flagged Mythologies
                      </h2>
                      <button
                        onClick={() => setActiveTab('flagged')}
                        className="text-sm text-purple-300 hover:text-white flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {flaggedMythologies.slice(0, 3).map((myth) => (
                        <div
                          key={myth.id}
                          className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                        >
                          <div>
                            <p className="text-white font-medium">{myth.name}</p>
                            <p className="text-gray-400 text-sm">
                              By {myth.creator?.display_name} • {myth.flagged_reason}
                            </p>
                          </div>
                          <Link
                            href={`/teacher/mythologies/${myth.id}`}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
                          >
                            Review
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Images Quick View */}
                {stats.pendingImages > 0 && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-400" />
                        Pending Images
                      </h2>
                      <button
                        onClick={() => setActiveTab('images')}
                        className="text-sm text-purple-300 hover:text-white flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {pendingImages.slice(0, 4).map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.image_url}
                            alt="Pending"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleImageAction(img.id, 'approve')}
                              disabled={actionLoading === img.id}
                              className="p-2 bg-green-500 hover:bg-green-600 rounded-full"
                            >
                              <CheckCircle className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={() => handleImageAction(img.id, 'reject')}
                              disabled={actionLoading === img.id}
                              className="p-2 bg-red-500 hover:bg-red-600 rounded-full"
                            >
                              <XCircle className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/teacher/images"
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Full Image Moderation
                </h3>
                <p className="text-gray-400 text-sm">
                  View all images with advanced filtering and bulk actions
                </p>
              </Link>
              <Link
                href="/teacher/mythologies"
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> All Mythologies
                </h3>
                <p className="text-gray-400 text-sm">
                  Browse and review all student mythologies
                </p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'flagged' && (
          <div className="space-y-4">
            {flaggedMythologies.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Flagged Content</h3>
                <p className="text-gray-400">All mythologies are in good standing.</p>
              </div>
            ) : (
              flaggedMythologies.map((myth) => (
                <div
                  key={myth.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{myth.name}</h3>
                      <p className="text-gray-400 flex items-center gap-2 mt-1">
                        <User className="w-4 h-4" />
                        {myth.creator?.display_name || 'Unknown'}
                        <span className="text-gray-600">•</span>
                        <Clock className="w-4 h-4" />
                        {formatDate(myth.updated_at)}
                      </p>
                      {myth.flagged_reason && (
                        <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <p className="text-red-300 text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <strong>Reason:</strong> {myth.flagged_reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/teacher/mythologies/${myth.id}`}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </Link>
                      <button
                        onClick={() => handleMythologyAction(myth.id, 'unflag')}
                        disabled={actionLoading === myth.id}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" /> Clear Flag
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            {pendingImages.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Pending Images</h3>
                <p className="text-gray-400">All images have been reviewed.</p>
                <Link
                  href="/teacher/images"
                  className="inline-block mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
                >
                  View All Images
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pendingImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={img.image_url}
                        alt="Pending review"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/80 text-yellow-900 rounded text-xs font-medium">
                        Pending
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {img.entity_type}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {img.profiles?.display_name || 'Unknown'} • {formatDate(img.created_at)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleImageAction(img.id, 'approve')}
                          disabled={actionLoading === img.id}
                          className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleImageAction(img.id, 'reject')}
                          disabled={actionLoading === img.id}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
