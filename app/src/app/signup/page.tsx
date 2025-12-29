'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Role = 'teacher' | 'student';

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('🚀 Starting signup process...', { role, displayName, email });

    if (!role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    // For students, verify invite code first
    let classroomId = null;
    if (role === 'student') {
      console.log('👨‍🎓 Student signup - validating invite code:', inviteCode);
      const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .select('id')
        .eq('invite_code', inviteCode)
        .single();

      if (classroomError || !classroom) {
        console.error('❌ Invalid invite code:', classroomError);
        setError('Invalid invite code. Please check with your teacher.');
        setLoading(false);
        return;
      }
      console.log('✅ Invite code valid. Classroom ID:', classroom.id);
      classroomId = classroom.id;
    }

    // Sign up with Supabase Auth (profile will be auto-created by database trigger)
    console.log('🔐 Calling Supabase auth.signUp...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          display_name: displayName,
        },
      },
    });

    if (signUpError) {
      console.error('❌ Auth signup error:', signUpError);
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      console.error('❌ No user returned from signup');
      setError('Signup failed. Please try again.');
      setLoading(false);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Wait longer for the trigger to create the profile
    console.log('⏳ Waiting 2 seconds for database trigger to create profile...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Wait complete');

    // If teacher, create a classroom via API route (needs service role)
    if (role === 'teacher') {
      const generatedInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      console.log('👨‍🏫 Teacher signup - creating classroom with invite code:', generatedInviteCode);
      
      const response = await fetch('/api/classrooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${displayName}'s Class`,
          teacher_id: authData.user.id,
          invite_code: generatedInviteCode,
          school_year: '2025-2026',
          school_name: schoolName,
          grade_level: gradeLevel || null,
        }),
      });

      console.log('📡 Classroom API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Classroom creation failed:', errorData);
        setError('Failed to create classroom: ' + (errorData.error || 'Unknown error'));
        setLoading(false);
        return;
      }

      const { data: classroomData } = await response.json();
      console.log('✅ Classroom created:', classroomData);
      classroomId = classroomData.id;
    }

    // Update the profile with additional fields
    console.log('📝 Updating profile with classroom_id:', classroomId);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        classroom_id: classroomId,
        school_name: role === 'teacher' ? schoolName : null,
        grade_level: role === 'teacher' ? gradeLevel : null,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('⚠️ Profile update error:', profileError);
      // Don't fail the signup if profile update fails
    } else {
      console.log('✅ Profile updated successfully');
    }

    // Redirect based on role
    console.log('🎉 Signup complete! Redirecting to dashboard...');
    if (role === 'teacher') {
      console.log('➡️ Redirecting to /teacher/dashboard');
      router.push('/teacher/dashboard');
    } else {
      console.log('➡️ Redirecting to /student/dashboard');
      router.push('/student/dashboard');
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-2xl w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-300">Are you a teacher or a student?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <button
              onClick={() => setRole('teacher')}
              className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 hover:border-purple-400 transition-all transform hover:scale-105 group"
            >
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-white mb-2">Teacher</h3>
              <p className="text-gray-300">
                Manage classrooms, guide students, and explore mythology together
              </p>
            </button>

            <button
              onClick={() => setRole('student')}
              className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 hover:border-blue-400 transition-all transform hover:scale-105 group"
            >
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-2">Student</h3>
              <p className="text-gray-300">
                Create your own mythology world and bring it to life
              </p>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div>
          <button
            onClick={() => setRole(null)}
            className="text-gray-300 hover:text-white mb-4"
          >
            ← Back
          </button>
          <h2 className="text-center text-3xl font-bold text-white mb-2">
            {role === 'teacher' ? 'Teacher Signup' : 'Student Signup'}
          </h2>
          <p className="text-center text-gray-300">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your.email@school.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {role === 'teacher' && (
            <>
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-200 mb-2">
                  School Name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Lincoln Middle School"
                />
              </div>

              <div>
                <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-200 mb-2">
                  Grade Level (Optional)
                </label>
                <select
                  id="gradeLevel"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option value="">Select grade level (optional)</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="6-8">6-8th Grade</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          {role === 'student' && (
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-200 mb-2">
                Classroom Invite Code
              </label>
              <input
                id="inviteCode"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ABC123"
                maxLength={8}
              />
              <p className="text-sm text-gray-400 mt-2">
                Get this code from your teacher
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
