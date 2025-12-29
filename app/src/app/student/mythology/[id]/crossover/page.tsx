'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// Types
interface Mythology {
  id: string;
  name: string;
  description: string;
  timeframe?: string;
  genre?: string;
  geography_type?: string;
  cultural_inspiration?: string;
  view_count: number;
  created_at: string;
  owner?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  characterCount?: number;
  creatureCount?: number;
  storyCount?: number;
}

interface CrossoverRequest {
  id: string;
  request_type: string;
  status: string;
  message?: string;
  response_message?: string;
  created_at: string;
  responded_at?: string;
  requester_mythology?: { id: string; name: string };
  target_mythology?: { id: string; name: string };
  requester?: { id: string; display_name: string };
  target_user?: { id: string; display_name: string };
}

interface Alliance {
  id: string;
  relationship_type: string;
  alliance_name?: string;
  description?: string;
  created_at: string;
  partner_mythology?: Mythology;
}

interface CrossoverStory {
  id: string;
  title: string;
  story_type: string;
  status: string;
  word_count: number;
  created_at: string;
  mythology_1?: { id: string; name: string };
  mythology_2?: { id: string; name: string };
  author_1?: { id: string; display_name: string };
  author_2?: { id: string; display_name: string };
}

type Tab = 'browse' | 'requests' | 'alliances' | 'stories';

const REQUEST_TYPES = [
  { value: 'battle', label: '⚔️ Battle Challenge', description: 'Challenge their champion to combat' },
  { value: 'alliance', label: '🤝 Alliance', description: 'Form a friendly alliance' },
  { value: 'story', label: '📖 Collaborative Story', description: 'Co-write a crossover story' },
  { value: 'trade', label: '💫 Cultural Exchange', description: 'Trade knowledge and artifacts' },
  { value: 'conflict', label: '⚡ Declare Rivalry', description: 'Establish mythological rivalry' },
];

const RELATIONSHIP_COLORS: Record<string, string> = {
  alliance: 'bg-green-100 text-green-800 border-green-300',
  trade_partners: 'bg-blue-100 text-blue-800 border-blue-300',
  rivalry: 'bg-orange-100 text-orange-800 border-orange-300',
  conflict: 'bg-red-100 text-red-800 border-red-300',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function CrossoverHubPage() {
  const params = useParams();
  const mythologyId = params.id as string;
  
  // State
  const [currentMythology, setCurrentMythology] = useState<Mythology | null>(null);
  const [browseMythologies, setBrowseMythologies] = useState<Mythology[]>([]);
  const [requests, setRequests] = useState<CrossoverRequest[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [crossoverStories, setCrossoverStories] = useState<CrossoverStory[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Request modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMythology, setSelectedMythology] = useState<Mythology | null>(null);
  const [requestType, setRequestType] = useState('battle');
  const [requestMessage, setRequestMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [classroomOnly, setClassroomOnly] = useState(false);

  // Fetch current mythology
  useEffect(() => {
    async function fetchCurrentMythology() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('mythologies')
        .select('id, name, description, view_count, created_at')
        .eq('id', mythologyId)
        .single();
      
      if (error) {
        setError('Failed to load mythology');
        return;
      }
      setCurrentMythology(data);
    }
    
    fetchCurrentMythology();
  }, [mythologyId]);

  // Fetch browsable mythologies
  const fetchBrowseMythologies = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        excludeMythologyId: mythologyId,
        classroomOnly: classroomOnly.toString(),
      });
      if (searchQuery) params.set('search', searchQuery);
      
      const response = await fetch(`/api/crossovers/browse?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setBrowseMythologies(data.mythologies || []);
      }
    } catch (err) {
      console.error('Error fetching mythologies:', err);
    }
  }, [mythologyId, searchQuery, classroomOnly]);

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/crossovers/requests');
      const data = await response.json();
      
      if (response.ok) {
        // Filter to requests involving this mythology
        const relevantRequests = (data.requests || []).filter((r: CrossoverRequest) =>
          r.requester_mythology?.id === mythologyId || r.target_mythology?.id === mythologyId
        );
        setRequests(relevantRequests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  }, [mythologyId]);

  // Fetch alliances
  const fetchAlliances = useCallback(async () => {
    try {
      const response = await fetch(`/api/crossovers/alliances?mythologyId=${mythologyId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAlliances(data.alliances || []);
      }
    } catch (err) {
      console.error('Error fetching alliances:', err);
    }
  }, [mythologyId]);

  // Fetch crossover stories
  const fetchCrossoverStories = useCallback(async () => {
    try {
      const response = await fetch(`/api/crossovers/stories?mythologyId=${mythologyId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCrossoverStories(data.stories || []);
      }
    } catch (err) {
      console.error('Error fetching crossover stories:', err);
    }
  }, [mythologyId]);

  // Initial data load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([
        fetchBrowseMythologies(),
        fetchRequests(),
        fetchAlliances(),
        fetchCrossoverStories(),
      ]);
      setLoading(false);
    }
    loadData();
  }, [fetchBrowseMythologies, fetchRequests, fetchAlliances, fetchCrossoverStories]);

  // Re-fetch browse results when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrowseMythologies();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, classroomOnly, fetchBrowseMythologies]);

  // Send crossover request
  async function sendRequest() {
    if (!selectedMythology) return;
    
    setSending(true);
    try {
      const response = await fetch('/api/crossovers/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterMythologyId: mythologyId,
          targetMythologyId: selectedMythology.id,
          requestType,
          message: requestMessage || null,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowRequestModal(false);
        setSelectedMythology(null);
        setRequestMessage('');
        fetchRequests();
        alert('Request sent successfully!');
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch {
      alert('Failed to send request');
    } finally {
      setSending(false);
    }
  }

  // Respond to request
  async function respondToRequest(requestId: string, action: 'accept' | 'decline', responseMessage?: string) {
    try {
      const response = await fetch(`/api/crossovers/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, responseMessage }),
      });
      
      if (response.ok) {
        fetchRequests();
        fetchAlliances();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to respond to request');
      }
    } catch {
      alert('Failed to respond to request');
    }
  }

  // Open request modal
  function openRequestModal(mythology: Mythology) {
    setSelectedMythology(mythology);
    setRequestType('battle');
    setRequestMessage('');
    setShowRequestModal(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Crossover Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href={`/student/mythology/${mythologyId}`}
              className="text-purple-300 hover:text-white mb-2 inline-flex items-center gap-2"
            >
              ← Back to {currentMythology?.name || 'Mythology'}
            </Link>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              🌐 Crossover Hub
            </h1>
            <p className="text-purple-200 mt-2">
              Connect with other mythologies for battles, alliances, and collaborative stories
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-lg w-fit">
          {[
            { id: 'browse' as Tab, label: '🔍 Browse Mythologies', count: browseMythologies.length },
            { id: 'requests' as Tab, label: '📬 Requests', count: requests.filter(r => r.status === 'pending').length },
            { id: 'alliances' as Tab, label: '🤝 Alliances', count: alliances.length },
            { id: 'stories' as Tab, label: '📖 Stories', count: crossoverStories.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-white/20'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search & Filters */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-50">
                <input
                  type="text"
                  placeholder="Search mythologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={classroomOnly}
                  onChange={(e) => setClassroomOnly(e.target.checked)}
                  className="rounded bg-white/10 border-white/20"
                />
                Classroom only
              </label>
            </div>

            {/* Mythology Grid */}
            {browseMythologies.length === 0 ? (
              <div className="text-center py-16 text-purple-200">
                <p className="text-6xl mb-4">🌌</p>
                <p className="text-xl">No other mythologies found</p>
                <p className="text-sm mt-2">Check back later or adjust your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {browseMythologies.map(myth => (
                  <div
                    key={myth.id}
                    className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{myth.name}</h3>
                      <span className="text-2xl">
                        {myth.genre === 'fantasy' ? '🏰' :
                         myth.genre === 'scifi' ? '🚀' :
                         myth.genre === 'cyberpunk' ? '🤖' :
                         myth.geography_type === 'ocean' ? '🌊' :
                         myth.geography_type === 'arctic' ? '❄️' :
                         myth.geography_type === 'desert' ? '🏜️' : '🌍'}
                      </span>
                    </div>
                    
                    <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                      {myth.description || 'A mysterious mythology awaits...'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      {myth.timeframe && (
                        <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                          📅 {myth.timeframe}
                        </span>
                      )}
                      {myth.cultural_inspiration && (
                        <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
                          🎭 {myth.cultural_inspiration}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-4 text-sm text-purple-300 mb-4">
                      <span>👤 {myth.characterCount || 0}</span>
                      <span>🐉 {myth.creatureCount || 0}</span>
                      <span>📜 {myth.storyCount || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-linear-to-r from-purple-500 to-pink-500" />
                        <span className="text-purple-200 text-sm">
                          {myth.owner?.display_name || 'Unknown'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => openRequestModal(myth)}
                        className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium text-sm transition-all"
                      >
                        Connect ✨
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-16 text-purple-200">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-xl">No crossover requests yet</p>
                <p className="text-sm mt-2">Browse mythologies to send your first request!</p>
              </div>
            ) : (
              <>
                {/* Pending Requests (Received) */}
                {requests.filter(r => r.status === 'pending' && r.target_mythology?.id === mythologyId).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      📥 Incoming Requests
                    </h2>
                    <div className="space-y-4">
                      {requests
                        .filter(r => r.status === 'pending' && r.target_mythology?.id === mythologyId)
                        .map(request => (
                          <div
                            key={request.id}
                            className="bg-yellow-500/20 backdrop-blur rounded-xl p-6 border border-yellow-500/30"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">
                                    {REQUEST_TYPES.find(t => t.value === request.request_type)?.label.split(' ')[0]}
                                  </span>
                                  <h3 className="text-lg font-bold text-white">
                                    {request.requester_mythology?.name}
                                  </h3>
                                  <span className="text-purple-300">wants to</span>
                                  <span className="text-yellow-300 font-medium">
                                    {REQUEST_TYPES.find(t => t.value === request.request_type)?.label.split(' ').slice(1).join(' ')}
                                  </span>
                                </div>
                                {request.message && (
                                  <p className="text-purple-200 italic mb-3">&ldquo;{request.message}&rdquo;</p>
                                )}
                                <p className="text-purple-300 text-sm">
                                  From: {request.requester?.display_name} • {new Date(request.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => respondToRequest(request.id, 'accept')}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
                                >
                                  Accept ✓
                                </button>
                                <button
                                  onClick={() => respondToRequest(request.id, 'decline')}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
                                >
                                  Decline ✗
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Sent Requests */}
                {requests.filter(r => r.requester_mythology?.id === mythologyId).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      📤 Sent Requests
                    </h2>
                    <div className="space-y-3">
                      {requests
                        .filter(r => r.requester_mythology?.id === mythologyId)
                        .map(request => (
                          <div
                            key={request.id}
                            className={`bg-white/10 backdrop-blur rounded-xl p-4 border ${
                              request.status === 'pending' ? 'border-yellow-500/30' :
                              request.status === 'accepted' ? 'border-green-500/30' :
                              'border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {REQUEST_TYPES.find(t => t.value === request.request_type)?.label.split(' ')[0]}
                                </span>
                                <div>
                                  <p className="text-white font-medium">
                                    To: {request.target_mythology?.name}
                                  </p>
                                  <p className="text-purple-300 text-sm">
                                    {REQUEST_TYPES.find(t => t.value === request.request_type)?.description}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'pending' ? 'bg-yellow-500/30 text-yellow-200' :
                                request.status === 'accepted' ? 'bg-green-500/30 text-green-200' :
                                'bg-red-500/30 text-red-200'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Received (past) Requests */}
                {requests.filter(r => r.target_mythology?.id === mythologyId && r.status !== 'pending').length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      📋 Past Received Requests
                    </h2>
                    <div className="space-y-3">
                      {requests
                        .filter(r => r.target_mythology?.id === mythologyId && r.status !== 'pending')
                        .map(request => (
                          <div
                            key={request.id}
                            className={`bg-white/10 backdrop-blur rounded-xl p-4 border ${
                              request.status === 'accepted' ? 'border-green-500/30' : 'border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {REQUEST_TYPES.find(t => t.value === request.request_type)?.label.split(' ')[0]}
                                </span>
                                <div>
                                  <p className="text-white font-medium">
                                    From: {request.requester_mythology?.name}
                                  </p>
                                  <p className="text-purple-300 text-sm">
                                    {request.responded_at && new Date(request.responded_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'accepted' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Alliances Tab */}
        {activeTab === 'alliances' && (
          <div>
            {alliances.length === 0 ? (
              <div className="text-center py-16 text-purple-200">
                <p className="text-6xl mb-4">🤝</p>
                <p className="text-xl">No alliances or rivalries yet</p>
                <p className="text-sm mt-2">Accept alliance or conflict requests to establish relationships</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alliances.map(alliance => (
                  <div
                    key={alliance.id}
                    className={`backdrop-blur rounded-xl p-6 border-2 ${
                      RELATIONSHIP_COLORS[alliance.relationship_type] || RELATIONSHIP_COLORS.neutral
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">
                            {alliance.relationship_type === 'alliance' ? '🤝' :
                             alliance.relationship_type === 'trade_partners' ? '💫' :
                             alliance.relationship_type === 'rivalry' ? '⚡' :
                             alliance.relationship_type === 'conflict' ? '⚔️' : '🔘'}
                          </span>
                          <span className="font-bold text-lg capitalize">
                            {alliance.relationship_type.replace('_', ' ')}
                          </span>
                        </div>
                        {alliance.alliance_name && (
                          <p className="text-sm font-medium italic">&ldquo;{alliance.alliance_name}&rdquo;</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-lg font-bold">
                        {alliance.partner_mythology?.name || 'Unknown Mythology'}
                      </p>
                      {alliance.partner_mythology?.description && (
                        <p className="text-sm opacity-80 line-clamp-2 mt-1">
                          {alliance.partner_mythology.description}
                        </p>
                      )}
                    </div>
                    
                    {alliance.description && (
                      <p className="text-sm opacity-80 mb-4 italic">
                        {alliance.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-70">Est. {new Date(alliance.created_at).toLocaleDateString()}</span>
                      <Link
                        href={`/student/mythology/${mythologyId}/crossover-battle?partner=${alliance.partner_mythology?.id}`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
                      >
                        ⚔️ Battle Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div>
            {crossoverStories.length === 0 ? (
              <div className="text-center py-16 text-purple-200">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-xl">No crossover stories yet</p>
                <p className="text-sm mt-2">Accept a collaborative story request to start writing with another mythology</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crossoverStories.map(story => (
                  <Link
                    key={story.id}
                    href={`/student/mythology/${mythologyId}/crossover-story/${story.id}`}
                    className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{story.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        story.status === 'published' ? 'bg-green-500/30 text-green-300' :
                        story.status === 'completed' ? 'bg-blue-500/30 text-blue-300' :
                        story.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-gray-500/30 text-gray-300'
                      }`}>
                        {story.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-purple-200 text-sm mb-4">
                      <span className="bg-purple-500/20 px-2 py-1 rounded">{story.mythology_1?.name}</span>
                      <span>×</span>
                      <span className="bg-pink-500/20 px-2 py-1 rounded">{story.mythology_2?.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-purple-300">
                      <span>✍️ {story.author_1?.display_name} & {story.author_2?.display_name}</span>
                      <span>📝 {story.word_count} words</span>
                    </div>
                    
                    <div className="mt-3 text-xs text-purple-400">
                      {story.story_type.replace('_', ' ')} • Created {new Date(story.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && selectedMythology && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Connect with {selectedMythology.name}
              </h2>
              <p className="text-purple-200 mb-6">
                Choose how you want to interact with this mythology
              </p>
              
              <div className="space-y-3 mb-6">
                {REQUEST_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setRequestType(type.value)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      requestType === type.value
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-white/10 text-purple-200 border-2 border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm opacity-80">{type.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-purple-200 text-sm mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={sendRequest}
                  disabled={sending}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Request ✨'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
