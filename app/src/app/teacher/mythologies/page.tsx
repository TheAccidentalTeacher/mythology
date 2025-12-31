'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, User, Calendar, Star, Eye, MessageSquare, Flag, CheckCircle, Clock, Filter, Search, ArrowLeft } from 'lucide-react';

interface Mythology {
  id: string;
  name: string;
  description: string | null;
  genre: string | null;
  geography_type: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  moderation_status: string;
  teacher_grade: string | null;
  teacher_feedback: string | null;
  visibility: string;
  created_by: string;
  creator?: {
    display_name: string;
    email: string;
  };
  character_count?: number;
  creature_count?: number;
  story_count?: number;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'flagged' | 'graded' | 'ungraded';

export default function TeacherMythologiesPage() {
  const [mythologies, setMythologies] = useState<Mythology[]>([]);
  const [filteredMythologies, setFilteredMythologies] = useState<Mythology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'student'>('newest');
  const router = useRouter();

  console.log('📚 Teacher Mythologies Page - Loading');

  useEffect(() => {
    fetchMythologies();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, sortBy, mythologies]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMythologies = async () => {
    console.log('📥 Fetching mythologies...');
    setLoading(true);

    const supabase = createClient();

    try {
      // Get current teacher
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ User error:', userError);
        router.push('/login');
        return;
      }

      // Get teacher's classroom
      const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .select('id')
        .eq('teacher_id', user.id)
        .single();

      if (classroomError || !classroom) {
        console.error('❌ Classroom error:', classroomError);
        router.push('/teacher/dashboard');
        return;
      }

      console.log('🏫 Classroom ID:', classroom.id);

      // Get all mythologies in this classroom with creator info
      const { data: mythologiesData, error: mythError } = await supabase
        .from('mythologies')
        .select(`
          *,
          creator:profiles!mythologies_created_by_fkey(display_name, email)
        `)
        .eq('classroom_id', classroom.id)
        .order('created_at', { ascending: false });

      if (mythError) {
        console.error('❌ Mythologies error:', mythError);
        throw mythError;
      }

      console.log(`✅ Loaded ${mythologiesData?.length || 0} mythologies`);

      // Get counts for each mythology
      const mythologiesWithCounts = await Promise.all(
        (mythologiesData || []).map(async (myth) => {
          const [charResult, creatureResult, storyResult] = await Promise.all([
            supabase.from('characters').select('*', { count: 'exact', head: true }).eq('mythology_id', myth.id),
            supabase.from('creatures').select('*', { count: 'exact', head: true }).eq('mythology_id', myth.id),
            supabase.from('stories').select('*', { count: 'exact', head: true }).eq('mythology_id', myth.id),
          ]);

          return {
            ...myth,
            character_count: charResult.count || 0,
            creature_count: creatureResult.count || 0,
            story_count: storyResult.count || 0,
          };
        })
      );

      setMythologies(mythologiesWithCounts);
    } catch (error) {
      console.error('❌ Error fetching mythologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...mythologies];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.creator?.display_name?.toLowerCase().includes(term) ||
        m.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'pending':
          filtered = filtered.filter(m => m.moderation_status === 'pending');
          break;
        case 'approved':
          filtered = filtered.filter(m => m.moderation_status === 'approved');
          break;
        case 'flagged':
          filtered = filtered.filter(m => m.moderation_status === 'flagged');
          break;
        case 'graded':
          filtered = filtered.filter(m => m.teacher_grade);
          break;
        case 'ungraded':
          filtered = filtered.filter(m => !m.teacher_grade);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'student':
        filtered.sort((a, b) => (a.creator?.display_name || '').localeCompare(b.creator?.display_name || ''));
        break;
    }

    setFilteredMythologies(filtered);
  };

  const getStatusBadge = (status: string, hasGrade: boolean) => {
    if (status === 'flagged') {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs flex items-center gap-1">
          <Flag className="w-3 h-3" /> Flagged
        </span>
      );
    }
    if (status === 'approved') {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (hasGrade) {
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center gap-1">
          <Star className="w-3 h-3" /> Graded
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center gap-1">
        <Clock className="w-3 h-3" /> Pending Review
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading mythologies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/teacher/dashboard"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              Student Mythologies
            </h1>
            <p className="text-gray-300 mt-1">Review and grade student work</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-3xl font-bold text-white">{mythologies.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-yellow-400 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-300">
              {mythologies.filter(m => m.moderation_status === 'pending' && !m.teacher_grade).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-green-400 text-sm">Graded</p>
            <p className="text-3xl font-bold text-green-300">
              {mythologies.filter(m => m.teacher_grade).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-red-400 text-sm">Flagged</p>
            <p className="text-3xl font-bold text-red-300">
              {mythologies.filter(m => m.moderation_status === 'flagged').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, student, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="graded">Graded</option>
                <option value="ungraded">Not Graded</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name' | 'student')}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
              <option value="student">By Student</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-400 mb-4">
          Showing {filteredMythologies.length} of {mythologies.length} mythologies
        </p>

        {/* Mythologies Grid */}
        {filteredMythologies.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Mythologies Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Students haven\'t created any mythologies yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMythologies.map((mythology) => (
              <Link
                key={mythology.id}
                href={`/teacher/mythologies/${mythology.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Cover Image or Placeholder */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {mythology.cover_image_url ? (
                      <img
                        src={mythology.cover_image_url}
                        alt={mythology.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-white/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {mythology.name}
                        </h3>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                          <User className="w-4 h-4" />
                          {mythology.creator?.display_name || 'Unknown Student'}
                        </p>
                      </div>
                      {getStatusBadge(mythology.moderation_status, !!mythology.teacher_grade)}
                    </div>

                    {mythology.description && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {mythology.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(mythology.created_at)}
                      </span>
                      <span>{mythology.character_count} characters</span>
                      <span>{mythology.creature_count} creatures</span>
                      <span>{mythology.story_count} stories</span>
                      {mythology.genre && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                          {mythology.genre}
                        </span>
                      )}
                      {mythology.teacher_grade && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded flex items-center gap-1">
                          <Star className="w-3 h-3" /> {mythology.teacher_grade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="hidden md:flex items-center">
                    <Eye className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
