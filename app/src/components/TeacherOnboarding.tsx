'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Your Teaching Hub! 🎓",
    description: "Let's take a quick tour of what makes this platform revolutionary. Unlike Google Classroom, we focus on igniting curiosity and fooling kids into learning!",
    icon: "🎓"
  },
  {
    title: "View Your Students 👥",
    description: "See all enrolled students, track their progress, and provide meaningful narrative feedback. No more arbitrary grades - focus on growth!",
    target: "students-card",
    icon: "👥"
  },
  {
    title: "Create Assignments ✍️",
    description: "Build curiosity-driven assignments with multi-age differentiation. One assignment works for ages 8, 10, and 16!",
    target: "assignments-card",
    icon: "✍️"
  },
  {
    title: "Review Mythologies 📚",
    description: "Provide narrative feedback, not just grades. Help students understand their strengths and how to grow.",
    target: "mythologies-card",
    icon: "📚"
  },
  {
    title: "Cross-Curricular Magic 🧬",
    description: "Convert ANY mythology into science, civics, or math lessons. Use their water god to teach the water cycle. Use their pantheon to teach the Constitution!",
    icon: "🧬"
  },
  {
    title: "AI Verification, Not Replacement 🤖",
    description: "AI checks factual accuracy in science/history, suggests feedback, and saves you time. But YOU'RE always the teacher, not the AI.",
    icon: "🤖"
  },
  {
    title: "You're Ready! 🚀",
    description: "Start by inviting students, creating your first assignment, or exploring student mythologies. Have fun - that's what education should be!",
    icon: "🚀"
  }
];

export default function TeacherOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenTeacherOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTeacherOnboarding', 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTeacherOnboarding', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-5xl border-2 border-white/20">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-lg text-center mb-8 leading-relaxed">
              {step.description}
            </p>

            {/* Step indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep 
                      ? 'w-8 bg-white' 
                      : idx < currentStep 
                        ? 'w-2 bg-green-400' 
                        : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleSkip}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Skip tour
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <>
                    Get Started
                    <Sparkles className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Fun fact footer */}
        <div className="mt-4 text-center">
          <p className="text-gray-300 text-sm">
            💡 <strong>Did you know?</strong> This entire platform was built in just over a week. Imagine what students can create!
          </p>
        </div>
      </div>
    </div>
  );
}
