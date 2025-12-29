'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedImage {
  id: string;
  entity_type: string;
  entity_id: string;
  image_url: string;
  style_preset: string;
  student_addition?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  is_featured: boolean;
  created_at: string;
}

interface ImageGalleryProps {
  entityType?: string;
  entityId?: string;
  showAll?: boolean;
  maxImages?: number;
  onImageClick?: (image: GeneratedImage) => void;
}

const STATUS_BADGES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
};

export default function ImageGallery({
  entityType,
  entityId,
  showAll = false,
  maxImages = 20,
  onImageClick,
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (entityType) params.set('entityType', entityType);
        if (entityId) params.set('entityId', entityId);
        if (!showAll) params.set('status', 'approved');
        params.set('limit', maxImages.toString());

        const response = await fetch(`/api/images/gallery?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setImages(data.images);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [entityType, entityId, showAll, maxImages]);

  const handleImageClick = (image: GeneratedImage) => {
    if (onImageClick) {
      onImageClick(image);
    } else {
      setSelectedImage(image);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/images/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });

      const data = await response.json();
      if (data.success) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        setSelectedImage(null);
      } else {
        alert(data.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl block mb-2">🎨</span>
        <p>No images generated yet.</p>
        <p className="text-sm mt-1">Create your first artwork!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      {showAll && (
        <div className="flex gap-2 mb-4">
          {(['all', 'approved', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === f
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-1 text-xs">
                  ({images.filter(img => img.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
            onClick={() => handleImageClick(image)}
          >
            <Image
              src={image.image_url}
              alt="Generated mythology image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            
            {/* Overlay with status */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGES[image.status].color}`}>
                  {STATUS_BADGES[image.status].icon} {STATUS_BADGES[image.status].label}
                </span>
                {image.is_featured && (
                  <span className="text-yellow-400">⭐</span>
                )}
              </div>
            </div>

            {/* Pending/Rejected indicator always visible */}
            {image.status !== 'approved' && (
              <div className="absolute top-2 right-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGES[image.status].color}`}>
                  {STATUS_BADGES[image.status].icon}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox modal */}
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
              className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={selectedImage.image_url}
                  alt="Generated mythology image"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>

              {/* Info panel */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${STATUS_BADGES[selectedImage.status].color}`}>
                    {STATUS_BADGES[selectedImage.status].icon} {STATUS_BADGES[selectedImage.status].label}
                  </span>
                  {selectedImage.is_featured && (
                    <span className="text-sm text-yellow-600">⭐ Featured</span>
                  )}
                </div>

                {selectedImage.student_addition && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Custom touch:</strong> {selectedImage.student_addition}
                  </p>
                )}

                {selectedImage.rejection_reason && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-2">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Feedback:</strong> {selectedImage.rejection_reason}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Created {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <a
                    href={selectedImage.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg text-sm font-medium transition-colors"
                  >
                    View Full Size
                  </a>
                  {selectedImage.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(selectedImage.id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
