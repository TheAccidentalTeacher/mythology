'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingImage {
  id: string;
  entity_type: string;
  entity_id: string;
  image_url: string;
  prompt: string;
  style_preset: string;
  student_addition?: string;
  flagged_reason?: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface ModerationCounts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function TeacherImageModeration() {
  const [images, setImages] = useState<PendingImage[]>([]);
  const [counts, setCounts] = useState<ModerationCounts>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<PendingImage | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const fetchImages = async (status: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/images/moderate?status=${status}`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(statusFilter);
  }, [statusFilter]);

  const handleAction = async (imageId: string, action: 'approve' | 'reject' | 'feature' | 'unfeature' | 'delete', reason?: string) => {
    setActionInProgress(imageId);
    
    try {
      const method = action === 'delete' ? 'DELETE' : 'PATCH';
      const response = await fetch('/api/images/moderate', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, action, reason }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove from current list if it would no longer match the filter
        if (action === 'approve' || action === 'reject' || action === 'delete') {
          setImages(prev => prev.filter(img => img.id !== imageId));
          setCounts(prev => ({
            ...prev,
            pending: action === 'approve' || action === 'reject' || action === 'delete' 
              ? Math.max(0, prev.pending - 1) 
              : prev.pending,
            approved: action === 'approve' ? prev.approved + 1 : prev.approved,
            rejected: action === 'reject' ? prev.rejected + 1 : prev.rejected,
          }));
          setSelectedImage(null);
        }
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('Action failed');
    } finally {
      setActionInProgress(null);
      setShowRejectDialog(false);
      setRejectionReason('');
    }
  };

  const quickRejectReasons = [
    'Content not appropriate for classroom',
    'Please try again with different settings',
    'Image quality not suitable',
    'Does not match the mythology theme',
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎨 Image Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and approve student-generated images
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { key: 'pending', label: 'Pending', icon: '⏳', color: 'bg-yellow-100 text-yellow-800' },
          { key: 'approved', label: 'Approved', icon: '✅', color: 'bg-green-100 text-green-800' },
          { key: 'rejected', label: 'Rejected', icon: '❌', color: 'bg-red-100 text-red-800' },
          { key: 'total', label: 'Total', icon: '📊', color: 'bg-gray-100 text-gray-800' },
        ].map(({ key, label, icon, color }) => (
          <div
            key={key}
            className={`p-4 rounded-xl ${color} ${key !== 'total' ? 'cursor-pointer hover:opacity-80' : ''}`}
            onClick={() => key !== 'total' && setStatusFilter(key as 'pending' | 'approved' | 'rejected')}
          >
            <div className="text-2xl">{icon}</div>
            <div className="text-2xl font-bold">{counts[key as keyof ModerationCounts]}</div>
            <div className="text-sm opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              statusFilter === status
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl block mb-2">
            {statusFilter === 'pending' ? '✨' : '📭'}
          </span>
          <p>
            {statusFilter === 'pending' 
              ? 'No images waiting for review!' 
              : `No ${statusFilter} images yet.`}
          </p>
        </div>
      ) : (
        /* Image grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-shadow bg-gray-100 dark:bg-gray-800"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.image_url}
                alt="Student generated image"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />
              
              {/* Student info overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium truncate">
                    {image.profiles?.full_name || 'Unknown Student'}
                  </p>
                  <p className="text-white/80 text-xs">
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Flagged indicator */}
              {image.flagged_reason && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  ⚠️ Flagged
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail/Action Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image side */}
              <div className="md:w-1/2 relative aspect-square">
                <Image
                  src={selectedImage.image_url}
                  alt="Student generated image"
                  fill
                  className="object-contain bg-gray-100 dark:bg-gray-900"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Details side */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex-1">
                  {/* Student info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      {selectedImage.profiles?.avatar_url ? (
                        <Image
                          src={selectedImage.profiles.avatar_url}
                          alt={selectedImage.profiles.full_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedImage.profiles?.full_name || 'Unknown Student'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedImage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Flagged warning */}
                  {selectedImage.flagged_reason && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        ⚠️ <strong>Auto-flagged:</strong> {selectedImage.flagged_reason}
                      </p>
                    </div>
                  )}

                  {/* Image details */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-xs text-gray-500">Entity Type</span>
                      <p className="text-sm text-gray-900 dark:text-white capitalize">
                        {selectedImage.entity_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Style</span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedImage.style_preset.replace(/-/g, ' ')}
                      </p>
                    </div>
                    {selectedImage.student_addition && (
                      <div>
                        <span className="text-xs text-gray-500">Student&apos;s Custom Addition</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          &quot;{selectedImage.student_addition}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Full prompt (collapsed by default) */}
                  <details className="text-sm mb-4">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                      View full prompt
                    </summary>
                    <p className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {selectedImage.prompt}
                    </p>
                  </details>
                </div>

                {/* Action buttons */}
                {statusFilter === 'pending' && (
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(selectedImage.id, 'approve')}
                        disabled={actionInProgress === selectedImage.id}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        disabled={actionInProgress === selectedImage.id}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                      >
                        ❌ Reject
                      </button>
                    </div>
                    <button
                      onClick={() => handleAction(selectedImage.id, 'delete')}
                      disabled={actionInProgress === selectedImage.id}
                      className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                    >
                      🗑️ Delete Permanently
                    </button>
                  </div>
                )}

                {statusFilter !== 'pending' && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection reason dialog */}
      <AnimatePresence>
        {showRejectDialog && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowRejectDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Provide Feedback (Optional)</h3>
              
              {/* Quick reasons */}
              <div className="space-y-2 mb-4">
                {quickRejectReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      rejectionReason === reason
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Custom reason */}
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Or write a custom message to the student..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
                rows={3}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(selectedImage.id, 'reject', rejectionReason)}
                  disabled={actionInProgress === selectedImage.id}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Reject Image
                </button>
                <button
                  onClick={() => setShowRejectDialog(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
