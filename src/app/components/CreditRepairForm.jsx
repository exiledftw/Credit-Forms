'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Home,
  Car,
  CreditCard,
  Briefcase,
  TrendingUp,
  Star,
  ThumbsUp,
  MinusCircle,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  ChevronDown
} from 'lucide-react';

// --- DATA STRUCTURES FOR SURVEY CARDS ---
const goalOptions = [
  { id: 'buy_house', label: 'Buy a House', icon: Home },
  { id: 'buy_car', label: 'Buy a Car', icon: Car },
  { id: 'get_credit_card', label: 'Get Credit Cards', icon: CreditCard },
  { id: 'get_a_loan', label: 'Get a loan', icon: Briefcase },
  { id: 'general_improvement', label: 'General Improvement', icon: TrendingUp },
  { id: 'other', label: 'Other', icon: PlusCircle },
];

const scoreOptions = [
  { id: 'excellent', label: 'Excellent', desc: '720 - 850', icon: Star },
  { id: 'good', label: 'Good', desc: '680 - 719', icon: ThumbsUp },
  { id: 'fair', label: 'Fair', desc: '620 - 679', icon: MinusCircle },
  { id: 'poor', label: 'Poor', desc: 'Under 620', icon: AlertTriangle },
  { id: 'unsure', label: "I'm not sure", desc: 'Need help checking', icon: HelpCircle },
];

const negativeItemOptions = [
  "Late Payments", "Collections", "Charge-offs",
  "Bankruptcies", "Tax Liens", "Hard Inquiries", "Identity Theft/Fraud"
];

export default function CreditRepairForm() {
  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swipeState, setSwipeState] = useState('idle');
  const [transitionType, setTransitionType] = useState(null);

  const otherInputRef = useRef(null);
  const carouselRef = useRef(null);
  const frozenHeight = useRef(null);

  // Capture current carousel height right before a step change so we
  // can animate from the old height to the new one.
  const captureCurrentHeight = () => {
    if (carouselRef.current) {
      frozenHeight.current = carouselRef.current.offsetHeight;
    }
  };

  const [formData, setFormData] = useState({
    primaryGoal: '',
    otherGoalReason: '',
    estimatedScore: '',
    negativeItems: [],
    description: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcpaConsent: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Belt-and-suspenders: force native scroll to work on this page.
  // Lenis smooth-scroll sets overflow:hidden on <html>, which kills
  // native scrolling. Even though LenisWrapper is now route-aware,
  // this guarantees scroll works if the user navigates here via
  // client-side routing before Lenis has time to tear down.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Save original values
    const origHtmlOverflow = html.style.overflow;
    const origBodyOverflow = body.style.overflow;

    // Force native scroll
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';

    return () => {
      html.style.overflow = origHtmlOverflow;
      body.style.overflow = origBodyOverflow;
    };
  }, []);

  // Focus the "Other" input automatically when landing on Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otherInputRef.current?.focus();
      }, 400); // Wait for slide animation to finish
    }
  }, [step]);

  // Smooth height animation when switching steps.
  // The carousel container's height is determined by whichever step is
  // `position: relative` (the active one). When we switch steps the
  // old step becomes absolute (height drops out) and the new step
  // becomes relative (new height snaps in). This effect bridges the
  // two heights with a CSS transition so the card resizes smoothly.
  useLayoutEffect(() => {
    const el = carouselRef.current;
    const fromH = frozenHeight.current;
    if (!el || fromH === null || !mounted) return;

    frozenHeight.current = null; // consume

    // Measure only the active step's height. We must NOT use
    // el.scrollHeight because it includes the absolutely-positioned
    // outgoing step, which overshoots when the old step is taller.
    const activeStep = Array.from(el.children).find(
      (child) => getComputedStyle(child).position === 'relative'
    );
    const toH = activeStep ? activeStep.offsetHeight : el.offsetHeight;

    if (fromH === toH) return;

    // Lock at the old height (no transition yet)
    el.style.transition = 'none';
    el.style.height = `${fromH}px`;
    el.offsetHeight; // force reflow

    // Animate to the new height
    el.style.transition = 'height 400ms ease-in-out';
    el.style.height = `${toH}px`;

    // Clean up after the animation finishes so the container can
    // grow naturally again (important for page-level scrolling).
    const cleanup = () => {
      el.style.height = '';
      el.style.transition = '';
    };
    const timer = setTimeout(cleanup, 420);
    return () => clearTimeout(timer);
  }, [step, mounted]);

  // --- HANDLERS ---
  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    captureCurrentHeight();
    setStep((prev) => {
      // If we are on Step 1 and they DID NOT choose "other", skip Step 2 directly to Step 3
      if (prev === 1 && formData.primaryGoal !== 'other') {
        return 3;
      }
      return Math.min(prev + 1, totalSteps);
    });
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    captureCurrentHeight();
    setStep((prev) => {
      // If we are on Step 3 and they DID NOT choose "other" previously, skip Step 2 backward to Step 1
      if (prev === 3 && formData.primaryGoal !== 'other') {
        return 1;
      }
      return Math.max(prev - 1, 1);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNegativeItemToggle = (item) => {
    setFormData(prev => {
      const items = prev.negativeItems;
      if (items.includes(item)) {
        return { ...prev, negativeItems: items.filter(i => i !== item) };
      } else {
        return { ...prev, negativeItems: [...items, item] };
      }
    });
  };

  // Auto-advance for single choice selections
  const handleGoalSelect = (id) => {
    setFormData(prev => ({ ...prev, primaryGoal: id }));

    // Explicitly check the newly selected 'id' right here 
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      captureCurrentHeight();
      if (id === 'other') {
        setStep(2); // Go to custom input
      } else {
        setStep(3); // Skip straight to the estimated score
      }
    }, 350);
  };

  const handleScoreSelect = (id) => {
    setFormData(prev => ({ ...prev, estimatedScore: id }));
    setTimeout(nextStep, 350);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    /* --- GHL WEBHOOK INTEGRATION MOCK --- */
    setTimeout(() => {
      console.log("Payload ready for route.ts -> GHL:", formData);
      setTransitionType('submit');
      setSwipeState('in');

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSwipeState('out');

        setTimeout(() => {
          setSwipeState('idle');
          setTransitionType(null);
        }, 700);
      }, 700);
    }, 1500);
  };

  const handleBackToForm = () => {
    setTransitionType('back');
    setSwipeState('in');

    setTimeout(() => {
      setIsSuccess(false);
      setStep(6); // Return to the contact step (which is now step 6)
      setSwipeState('out');

      setTimeout(() => {
        setSwipeState('idle');
        setTransitionType(null);
      }, 700);
    }, 700);
  };

  // Handle hitting 'Enter' key specifically inside the "Other" input field
  const handleOtherInputKeyPress = (e) => {
    if (e.key === 'Enter' && formData.otherGoalReason.trim()) {
      e.preventDefault();
      nextStep();
    }
  };

  // Calculate Progress
  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  // NATIVE CSS LAYOUT LOGIC
  const getStepClasses = (stepNumber) => {
    const base = "w-full transition-all duration-500 ease-in-out px-1 pb-4";
    if (step === stepNumber) {
      return `${base} relative opacity-100 translate-x-0 scale-100 z-10 pointer-events-auto`;
    } else if (stepNumber < step) {
      // Slide fully offscreen left — overflow:clip on the container hides it
      return `${base} absolute top-0 left-0 opacity-0 -translate-x-full scale-95 z-0 pointer-events-none`;
    } else {
      // Slide fully offscreen right
      return `${base} absolute top-0 left-0 opacity-0 translate-x-full scale-95 z-0 pointer-events-none`;
    }
  };

  return (
    <>
      {/* SAFE SCROLLBAR HIDING STYLES */}
      <style>{`
        /* Hide scrollbar completely everywhere safely without locking document flow */
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        * {
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Full Screen Swipe Transition Overlay */}
      {mounted && (
        <div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          style={{ visibility: swipeState === 'idle' ? 'hidden' : 'visible' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: swipeState === 'idle' ? 'translateX(-100%)' : swipeState === 'in' ? 'translateX(0)' : 'translateX(100%)',
              transition: swipeState === 'idle' ? 'none' : 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="text-white flex flex-col items-center animate-pulse px-6 text-center">
              <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                {transitionType === 'back' ? 'Heading back!' : 'Securing your profile...'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {isSuccess ? (
        /* --- SUCCESS / BOOKING SCREEN --- */
        <div className="flex min-h-screen font-sans bg-gray-50 items-start justify-center px-3 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-24 w-full">
          <div className="max-w-4xl w-full relative bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-6 animate-fade-in-up">

            <button
              onClick={handleBackToForm}
              className="absolute top-4 left-4 sm:top-8 sm:left-8 group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-full border border-gray-100 hover:border-emerald-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 z-10"
              title="Start over"
              aria-label="Start over"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 pt-12 sm:pt-0">
              {/* ANIMATED GREEN CHECKMARK ICON */}
              <div className="mx-auto relative w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center group cursor-default">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You're almost there!</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
                Your profile information has been securely received. Please select a convenient time below to finalize and schedule your strategy session with one of our credit consultants.
              </p>
            </div>

            <div className="w-full bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden min-h-125 h-[80vh] max-h-162.5">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York"
                title="Book a Consultation"
                width="100%"
                height="100%"
                frameBorder="0"
                className="bg-transparent"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              />
            </div>
          </div>
        </div>
      ) : (

        /* --- PRIMARY SURVEY SCREEN --- */
        <div className="flex min-h-screen font-sans bg-gray-50 items-start justify-center px-3 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-24 w-full">
          <div className="w-full max-w-2xl bg-white p-5 sm:p-12 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 relative flex flex-col transition-all duration-500 ease-in-out">

            {/* Header & Logo */}
            <div className="text-center mb-6 sm:mb-8 pt-8 sm:pt-0">
              <div className="mx-auto w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-4">
                <img
                  src="/lionheart.webp"
                  alt="Brand Logo"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900 px-2">
                Meet Your <span className="text-yellow-700">Credit Builder</span> Expert
              </h1>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 mb-6 sm:mb-8 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Seamless Carousel Track Container */}
            <div ref={carouselRef} className="w-full relative" style={{ overflow: 'clip' }}>

              {/* STEP 1: Primary Goal */}
              <div className={getStepClasses(1)}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">What is your primary goal?</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Select the main reason you want to build your credit.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {goalOptions.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = formData.primaryGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => handleGoalSelect(goal.id)}
                        className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                      >
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 transition-colors ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className={`text-sm sm:text-base font-medium transition-colors ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                          {goal.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: "Other" Goal Dedicated Page (Conditional) */}
              <div className={getStepClasses(2)}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">What is your primary goal?</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Please describe your specific goal so we can assist you better.</p>
                </div>
                <div className="flex flex-col w-full pb-2">
                  <input
                    ref={otherInputRef}
                    type="text"
                    id="otherGoalReason"
                    name="otherGoalReason"
                    value={formData.otherGoalReason}
                    onChange={handleInputChange}
                    onKeyDown={handleOtherInputKeyPress}
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 sm:py-4 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none transition-colors shadow-sm"
                    placeholder="E.g., I want to lower my interest rates..."
                  />

                  <div className="pt-4 mt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.otherGoalReason.trim()}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3: Estimated Score */}
              <div className={getStepClasses(3)}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">What is your estimated credit score?</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">It's okay to guess if you aren't exactly sure.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {scoreOptions.map((score) => {
                    const Icon = score.icon;
                    const isSelected = formData.estimatedScore === score.id;
                    return (
                      <button
                        key={score.id}
                        type="button"
                        onClick={() => handleScoreSelect(score.id)}
                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                      >
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className={`text-sm sm:text-base font-semibold ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>
                          {score.label}
                        </span>
                        <span className={`text-xs mt-0.5 sm:mt-1 ${isSelected ? 'text-emerald-700' : 'text-gray-500'}`}>
                          {score.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: Negative Items */}
              <div className={`${getStepClasses(4)} flex flex-col`}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Any negative items on your report?</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Select all that apply. Leave blank if none.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pb-2 sm:pb-4">
                  {negativeItemOptions.map((item) => {
                    const isSelected = formData.negativeItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleNegativeItemToggle(item)}
                        className={`flex items-center px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border-2 text-left transition-all duration-200 ${isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                          }`}
                      >
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border flex items-center justify-center mr-2.5 sm:mr-3 shrink-0 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                          }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs sm:text-sm">{item}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 mt-4 sm:mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white py-3 sm:py-3.5 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STEP 5: Description */}
              <div className={`${getStepClasses(5)} flex flex-col`}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Tell us a bit more.</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Briefly describe your situation (Optional)</p>
                </div>
                <div className="w-full">
                  <textarea
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 focus:outline-none transition-all resize-none text-sm sm:text-base"
                    placeholder="e.g. I have a few late payments from last year I need help removing so I can qualify for a better mortgage rate..."
                  />
                </div>
                <div className="pt-4 mt-4 sm:mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white py-3 sm:py-3.5 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm"
                  >
                    <span>Continue to Final Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STEP 6: Contact / Submit */}
              <div className={`${getStepClasses(6)} flex flex-col`}>
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Tell us about yourself</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Enter your details to request your free consultation.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                  <div className="space-y-3 sm:space-y-4 pb-2 sm:pb-4">
                    <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg sm:rounded-xl border-2 border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg sm:rounded-xl border-2 border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg sm:rounded-xl border-2 border-gray-200 pl-9 sm:pl-10 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg sm:rounded-xl border-2 border-gray-200 pl-9 sm:pl-10 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl border border-emerald-100 flex items-start space-x-2.5 sm:space-x-3 mt-2">
                      <div className="flex items-center h-5 sm:mt-0.5">
                        <input
                          id="tcpaConsent"
                          name="tcpaConsent"
                          type="checkbox"
                          required
                          checked={formData.tcpaConsent}
                          onChange={handleInputChange}
                          className="h-4 w-4 sm:h-4 sm:w-4 rounded border-gray-300 accent-emerald-600 focus:ring-emerald-600 cursor-pointer"
                        />
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                        <label htmlFor="tcpaConsent" className="font-semibold text-emerald-900 cursor-pointer block mb-0.5 sm:mb-1">
                          I agree to receive communications.
                        </label>
                        By checking this box, you agree to receive text messages, phone calls, and emails from our team regarding your credit consultation. Consent is not a condition of purchase. Message & data rates may apply.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 sm:mt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center py-3.5 sm:py-4 px-4 border border-transparent rounded-xl shadow-md text-sm sm:text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Request Free Consultation"
                      )}
                    </button>
                    <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Your information is encrypted and secure.</span>
                    </div>
                  </div>
                </form>
              </div>

            </div>

            {/* Back Navigation Overlay */}
            {step > 1 && (
              <button
                onClick={prevStep}
                className="absolute top-4 left-4 sm:top-8 sm:left-8 group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-full border border-gray-200 transition-all focus:outline-none shadow-sm z-20"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            )}

          </div>
        </div>
      )}
    </>
  );
}