'use client';

import { useState } from 'react';

interface DeleteMythologyModalProps {
  mythologyId: string;
  mythologyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type DeleteStep = 'confirm' | 'type-name' | 'final-warning';

export default function DeleteMythologyModal({
  mythologyId,
  mythologyName,
  isOpen,
  onClose,
  onSuccess,
}: DeleteMythologyModalProps) {
  const [step, setStep] = useState<DeleteStep>('confirm');
  const [typedName, setTypedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('confirm');
    setTypedName('');
    setError(null);
    onClose();
  };

  const handleFirstConfirm = () => {
    setStep('type-name');
  };

  const handleSecondConfirm = () => {
    if (typedName.trim().toLowerCase() !== 'yes delete') {
      setError('Please type exactly: yes delete');
      return;
    }
    setError(null);
    setStep('final-warning');
  };

  const handleFinalDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/mythology/${mythologyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete mythology');
      }

      // Success!
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete mythology');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900/90 via-purple-900/90 to-pink-900/90 rounded-2xl border-2 border-red-500/50 max-w-lg w-full p-8 shadow-2xl">
        {/* Step 1: Initial Confirmation */}
        {step === 'confirm' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-3xl font-bold text-white mb-2">Delete Mythology?</h2>
              <p className="text-red-200 text-lg">
                You are about to delete <span className="font-bold text-white">"{mythologyName}"</span>
              </p>
            </div>

            <div className="bg-red-950/50 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm mb-2 font-semibold">⚠️ This will permanently delete:</p>
              <ul className="text-red-300 text-sm space-y-1 list-disc list-inside">
                <li>All characters and gods</li>
                <li>All creatures and monsters</li>
                <li>All stories and narratives</li>
                <li>All realms and locations</li>
                <li>All images and collectibles</li>
                <li>All relationships and battles</li>
              </ul>
            </div>

            <p className="text-yellow-200 text-center mb-6 font-medium">
              ⚠️ This action CANNOT be undone! ⚠️
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Cancel (Keep Safe)
              </button>
              <button
                onClick={handleFirstConfirm}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
              >
                I Understand
              </button>
            </div>
          </>
        )}

        {/* Step 2: Type Confirmation Phrase */}
        {step === 'type-name' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Type to Confirm</h2>
              <p className="text-red-200 mb-3">
                You are about to permanently delete:
              </p>
              <p className="text-2xl font-bold text-yellow-300 mb-4 break-words px-4">
                {mythologyName.split('**')[0].trim()}
              </p>
              <p className="text-white text-lg mb-2">
                To confirm, please type exactly:
              </p>
              <p className="text-3xl font-bold text-green-300 mb-4">
                yes delete
              </p>
            </div>

            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value);
                setError(null);
              }}
              placeholder="Type: yes delete"
              className="w-full px-4 py-3 bg-white/10 border-2 border-red-500/50 rounded-xl text-white placeholder-white/40 text-lg text-center focus:outline-none focus:border-red-400 mb-4"
              autoFocus
            />

            {error && (
              <div className="bg-red-950/50 border border-red-500 rounded-xl p-3 mb-4">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSecondConfirm}
                disabled={!typedName.trim()}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Step 3: Final Warning */}
        {step === 'final-warning' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-3xl font-bold text-white mb-4">FINAL WARNING!</h2>
              <p className="text-red-200 text-lg mb-4">
                This is your <span className="font-bold text-yellow-300">LAST CHANCE</span> to stop!
              </p>
              <div className="bg-red-950/70 border-2 border-red-500 rounded-xl p-6 mb-4">
                <p className="text-white font-bold text-xl mb-2">
                  "{mythologyName}"
                </p>
                <p className="text-red-200">
                  will be <span className="font-bold text-white">PERMANENTLY DELETED</span>
                </p>
                <p className="text-red-300 text-sm mt-2">
                  Along with ALL of its content
                </p>
              </div>
              <p className="text-yellow-200 font-bold">
                Are you 100% ABSOLUTELY SURE?
              </p>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500 rounded-xl p-3 mb-4">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
                disabled={isDeleting}
              >
                ✅ NO! Keep It Safe
              </button>
              <button
                onClick={handleFinalDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
              >
                {isDeleting ? 'Deleting...' : '❌ YES, Delete Forever'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
