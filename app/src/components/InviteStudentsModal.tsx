'use client';

import { useState } from 'react';

interface InviteStudentsModalProps {
  inviteCode: string;
  onClose: () => void;
}

export default function InviteStudentsModal({ inviteCode, onClose }: InviteStudentsModalProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const signupUrl = `${window.location.origin}/signup?invite=${inviteCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(signupUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const emailBody = `Hi!

You're invited to join my mythology class on The Mythology Codex!

To join:
1. Go to: ${signupUrl}
2. Click "Sign Up"
3. Select "Student"
4. Enter this invite code: ${inviteCode}

Create your account and start building your own mythology!

See you in class!`;

  const handleEmailInvite = () => {
    const subject = encodeURIComponent('Join My Mythology Class!');
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl border border-white/20 max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">📧 Invite Students</h2>

        {/* Invite Code Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-6">
          <p className="text-gray-300 text-sm mb-2">Class Invite Code:</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-black/30 text-white text-2xl font-mono font-bold px-6 py-4 rounded-lg">
              {inviteCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Signup Link Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-6">
          <p className="text-gray-300 text-sm mb-2">Direct Signup Link:</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={signupUrl}
              readOnly
              className="flex-1 bg-black/30 text-white px-4 py-3 rounded-lg font-mono text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
            >
              {linkCopied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            This link automatically includes your invite code
          </p>
        </div>

        {/* Sharing Options */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold mb-3">Share via:</h3>
          
          <button
            onClick={handleEmailInvite}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-xl">📧</span>
            Send Email Invite
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                window.open(
                  `https://classroom.google.com/share?url=${encodeURIComponent(signupUrl)}`,
                  '_blank'
                );
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
            >
              Google Classroom
            </button>
            <button
              onClick={() => {
                handleCopyLink();
                alert('Link copied! You can now paste it into Canvas, Schoology, or any other platform.');
              }}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
            >
              Other LMS
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">📝 Student Instructions:</h4>
          <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
            <li>Click the signup link or go to the website</li>
            <li>Click "Sign Up" and select "Student"</li>
            <li>Enter the invite code: <code className="bg-black/30 px-2 py-1 rounded">{inviteCode}</code></li>
            <li>Complete registration</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
