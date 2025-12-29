'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Student {
  id: string;
  display_name: string;
  email: string;
  points: number;
  level: number;
  current_streak: number;
  created_at: string;
  last_activity_date: string | null;
  mythology_count?: number;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'level' | 'joined'>('name');
  const router = useRouter();

  console.log('👥 Teacher Students Page - Loading students');

  useEffect(() => {
    fetchStudents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortBy, students]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStudents = async () => {
    console.log('📥 Fetching students...');
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
      console.log('👤 Teacher:', user.id);

      // Get teacher's profile to find classroom
      const { data: teacherProfile, error: profileError } = await supabase
        .from('profiles')
        .select('classroom_id, role')
        .eq('id', user.id)
        .single();

      if (profileError || !teacherProfile || teacherProfile.role !== 'teacher') {
        console.error('❌ Not a teacher or no classroom');
        router.push('/teacher/dashboard');
        return;
      }

      console.log('🏫 Classroom ID:', teacherProfile.classroom_id);

      // Get all students in this classroom
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('classroom_id', teacherProfile.classroom_id)
        .eq('role', 'student')
        .order('display_name');

      if (studentsError) {
        console.error('❌ Students error:', studentsError);
        throw studentsError;
      }

      console.log(`✅ Loaded ${studentsData?.length || 0} students`);

      // Get mythology counts for each student
      const studentsWithCounts = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { count } = await supabase
            .from('mythologies')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', student.id);

          return {
            ...student,
            mythology_count: count || 0,
          };
        })
      );

      console.log('✅ Mythology counts added');
      setStudents(studentsWithCounts);
      setFilteredStudents(studentsWithCounts);
    } catch (err: unknown) {
      console.error('💥 Fatal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.display_name.localeCompare(b.display_name);
        case 'points':
          return b.points - a.points;
        case 'level':
          return b.level - a.level;
        case 'joined':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    console.log(`🔍 Filtered to ${filtered.length} students, sorted by ${sortBy}`);
    setFilteredStudents(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">👥 Student Management</h1>
            <Link
              href="/teacher/dashboard"
              className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">{students.length}</div>
            <div className="text-gray-300 text-sm">Total Students</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-2">🏛️</div>
            <div className="text-2xl font-bold text-white">
              {students.reduce((sum, s) => sum + (s.mythology_count || 0), 0)}
            </div>
            <div className="text-gray-300 text-sm">Total Mythologies</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">
              {students.reduce((sum, s) => sum + s.points, 0)}
            </div>
            <div className="text-gray-300 text-sm">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-white">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.points, 0) / students.length) : 0}
            </div>
            <div className="text-gray-300 text-sm">Avg Points/Student</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Search Students</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'points' | 'level' | 'joined')}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="name">Name (A-Z)</option>
                <option value="points">Points (High to Low)</option>
                <option value="level">Level (High to Low)</option>
                <option value="joined">Recently Joined</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-white/60 text-sm">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-white/60 text-lg">No students found</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Student</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Mythologies</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Points</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Level</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Streak</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{student.display_name}</div>
                      <div className="text-white/40 text-xs">
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{student.email}</td>
                    <td className="px-6 py-4 text-center text-white">{student.mythology_count || 0}</td>
                    <td className="px-6 py-4 text-center text-white font-semibold">{student.points}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                        Level {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-white">
                      {student.current_streak > 0 ? `🔥 ${student.current_streak}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => console.log('🚧 View as student - Impersonation coming soon!', student.id)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
