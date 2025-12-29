'use client';

import { useState, useEffect } from 'react';
import ImageGenModal from './ImageGenModal';

interface ImageGenButtonProps {
  entityType: 'character' | 'creature' | 'realm' | 'story' | 'mythology' | 'map';
  entityId: string;
  entityName: string;
  entityDescription?: string;
  mythologyName?: string;
  mythologyStyle?: string;
  onImageGenerated?: (imageUrl: string, imageId: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'icon';
  disabled?: boolean;
}

export default function ImageGenButton({
  entityType,
  entityId,
  entityName,
  entityDescription,
  mythologyName,
  mythologyStyle,
  onImageGenerated,
  className = '',
  variant = 'default',
  disabled = false,
}: ImageGenButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canGenerate, setCanGenerate] = useState<boolean | null>(null);
  const [tokensOrFree, setTokensOrFree] = useState<number>(0);

  // Check if user can generate (for showing locked state)
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/images/generate');
        const data = await response.json();
        if (data.success) {
          setCanGenerate(data.stats.canGenerate);
          setTokensOrFree(data.stats.freeImagesRemaining || data.stats.imageTokens);
        }
      } catch {
        // Silently fail - button will just work normally
      }
    };
    
    checkStatus();
  }, []);

  const handleImageGenerated = (imageUrl: string, imageId: string) => {
    if (onImageGenerated) {
      onImageGenerated(imageUrl, imageId);
    }
    // Update our local state
    setTokensOrFree(prev => Math.max(0, prev - 1));
  };

  // Variant-specific styling
  const getButtonContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <span className="text-lg" title="Generate AI Image">
            🎨
          </span>
        );
      case 'compact':
        return (
          <>
            <span>🎨</span>
            <span className="ml-1">Generate</span>
          </>
        );
      default:
        return (
          <>
            <span className="text-lg">🎨</span>
            <span>Generate Image</span>
            {canGenerate === false && (
              <span className="ml-1">🔒</span>
            )}
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center gap-1 transition-all rounded-lg font-medium';
    
    const variantClasses = {
      default: 'px-4 py-2 text-sm',
      compact: 'px-3 py-1.5 text-xs',
      icon: 'p-2',
    };

    const stateClasses = disabled
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : canGenerate === false
      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-sm hover:shadow';

    return `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`;
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        className={getButtonClasses()}
        title={canGenerate === false ? 'Earn tokens to generate images' : `Generate AI image for ${entityName}`}
      >
        {getButtonContent()}
      </button>

      <ImageGenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
        entityDescription={entityDescription}
        mythologyName={mythologyName}
        mythologyStyle={mythologyStyle}
        onImageGenerated={handleImageGenerated}
      />
    </>
  );
}
