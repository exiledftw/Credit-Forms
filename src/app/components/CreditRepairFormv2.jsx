'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Lock,
  ChevronRight,
  Check
} from 'lucide-react';

// --- DATA STRUCTURES ---
const goalOptions = [
  { id: 'buy_house', label: 'Buy a House', icon: Home, desc: 'Qualify for a mortgage' },
  { id: 'buy_car', label: 'Buy a Car', icon: Car, desc: 'Get better auto rates' },
  { id: 'get_credit_card', label: 'Credit Cards', icon: CreditCard, desc: 'Unlock premium cards' },
  { id: 'get_a_loan', label: 'Get a Loan', icon: Briefcase, desc: 'Personal or business' },
  { id: 'general_improvement', label: 'Improve Score', icon: TrendingUp, desc: 'Overall financial health' },
  { id: 'other', label: 'Other', icon: PlusCircle, desc: 'Custom specific goal' },
];

const scoreOptions = [
  { id: 'excellent', label: 'Excellent', desc: '720 - 850', icon: Star, color: 'text-emerald-500' },
  { id: 'good', label: 'Good', desc: '680 - 719', icon: ThumbsUp, color: 'text-blue-500' },
  { id: 'fair', label: 'Fair', desc: '620 - 679', icon: MinusCircle, color: 'text-yellow-500' },
  { id: 'poor', label: 'Poor', desc: 'Under 620', icon: AlertTriangle, color: 'text-red-500' },
  { id: 'unsure', label: "I'm not sure", desc: 'Need help checking', icon: HelpCircle, color: 'text-slate-400' },
];

const negativeItemOptions = [
  "Late Payments", "Collections", "Charge-offs",
  "Bankruptcies", "Tax Liens", "Hard Inquiries", "Identity Theft/Fraud"
];

// Dynamic Side Panel Content
const stepContent = {
  1: { title: "Let's align on your goals.", subtitle: "What are we aiming for? Knowing your destination helps us map the fastest route." },
  2: { title: "Tell us a bit more.", subtitle: "The more context we have, the better tailored your game plan will be." },
  3: { title: "Where do you stand?", subtitle: "An estimate is perfectly fine. We'll help you get the exact numbers later." },
  4: { title: "Identify the roadblocks.", subtitle: "Don't worry about the past. Identifying these helps us know exactly what to dispute." },
  5: { title: "The details matter.", subtitle: "Any extra context gives our experts a head start on your profile." },
  6: { title: "Let's make it official.", subtitle: "Secure your spot. We'll set up a time to review your custom strategy." }
};

export default function CreditRepairFormv2() {
  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const otherInputRef = useRef(null);

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
    // Force native scroll safely
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    if (step === 2 && mounted) {
      setTimeout(() => otherInputRef.current?.focus(), 100);
    }
  }, [step, mounted]);

  // --- HANDLERS ---
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const nextStep = () => {
    scrollToTop();
    setStep((prev) => {
      if (prev === 1 && formData.primaryGoal !== 'other') return 3;
      return Math.min(prev + 1, totalSteps);
    });
  };

  const prevStep = () => {
    scrollToTop();
    setStep((prev) => {
      if (prev === 3 && formData.primaryGoal !== 'other') return 1;
      return Math.max(prev - 1, 1);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNegativeItemToggle = (item) => {
    setFormData(prev => {
      const items = prev.negativeItems;
      return {
        ...prev,
        negativeItems: items.includes(item) ? items.filter(i => i !== item) : [...items, item]
      };
    });
  };

  const handleGoalSelect = (id) => {
    setFormData(prev => ({ ...prev, primaryGoal: id }));
    setTimeout(() => {
      scrollToTop();
      setStep(id === 'other' ? 2 : 3);
    }, 300);
  };

  const handleScoreSelect = (id) => {
    setFormData(prev => ({ ...prev, estimatedScore: id }));
    setTimeout(nextStep, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // MOCK SUBMISSION
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      scrollToTop();
    }, 1500);
  };

  const handleOtherInputKeyPress = (e) => {
    if (e.key === 'Enter' && formData.otherGoalReason.trim()) {
      e.preventDefault();
      nextStep();
    }
  };

  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  if (!mounted) return null;

  return (
    <>
      <style>{`
        /* Custom Smooth Animations */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Subtle mesh gradient background */
        .bg-mesh {
          background-color: #f8fafc;
          background-image: 
            radial-gradient(at 0% 0%, hsla(160, 84%, 90%, 1) 0px, transparent 50%),
            radial-gradient(at 100% 0%, hsla(160, 84%, 95%, 1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, hsla(210, 50%, 95%, 1) 0px, transparent 50%);
        }
        
        /* Hide scrollbars elegantly */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      {isSuccess ? (
        /* --- SUCCESS / BOOKING SCREEN --- */
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col animate-slide-up">
            
            {/* Success Header */}
            <div className="bg-emerald-600 text-white px-8 py-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              <button 
                onClick={() => { setIsSuccess(false); setStep(6); }}
                className="absolute top-6 left-6 text-emerald-100 hover:text-white transition-colors flex items-center text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Profile Secured!</h1>
                <p className="text-emerald-100 max-w-lg mx-auto text-lg">
                  You're one step away from financial freedom. Select a time below for your free strategy session.
                </p>
              </div>
            </div>

            {/* Booking iframe Container */}
            <div className="p-4 sm:p-8 bg-slate-50 grow">
              <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[600px] relative">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York"
                  title="Book a Consultation"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="camera; microphone; autoplay; encrypted-media; fullscreen"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (

        /* --- SURVEY SCREEN --- */
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px] border border-white/60">
            
            {/* LEFT PANEL - Branding & Dynamic Context */}
            <div className="lg:w-2/5 bg-emerald-600 relative p-8 sm:p-12 text-white flex flex-col justify-between overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500 blur-3xl opacity-50 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-emerald-700 blur-3xl opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-16">
                  {/* Lionheart Logo */}
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/lionheart.webp" 
                      alt="Lionheart Consultant Logo" 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className="text-xl font-bold tracking-wide">Lionheart<span className="text-emerald-200">Consultant</span></span>
                </div>

                <div className="animate-slide-up" key={`header-${step}`}>
                  <div className="inline-flex items-center space-x-2 bg-emerald-500/30 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                    <span>Step {step} of {totalSteps}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                    {stepContent[step]?.title}
                  </h2>
                  <p className="text-emerald-100 text-lg leading-relaxed max-w-sm">
                    {stepContent[step]?.subtitle}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-12 hidden lg:block">
                {/* Visual Progress Timeline */}
                <div className="flex space-x-2">
                  {[...Array(totalSteps)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                        i + 1 === step ? 'bg-white scale-y-125' : 
                        i + 1 < step ? 'bg-emerald-300' : 'bg-emerald-800/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - The Form */}
            <div className="lg:w-3/5 p-6 sm:p-10 lg:p-14 flex flex-col bg-slate-50 relative">
              
              {/* Fixed Back Button (Top Right) */}
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="absolute top-6 right-6 lg:top-10 lg:right-10 group flex items-center px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full border border-slate-200 transition-all focus:outline-none shadow-sm z-20"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="text-sm font-bold">Back</span>
                </button>
              )}

              {/* Mobile Progress Bar (Shortened slightly to prevent overlap with button) */}
              <div className="lg:hidden w-2/3 sm:w-3/4 bg-slate-200 rounded-full h-1.5 mb-8 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Form Content - justify-start anchors it to the top */}
              <div className="flex-grow flex flex-col justify-start max-w-xl mx-auto w-full pt-2 sm:pt-4">
                
                {/* --- STEP 1 --- */}
                {step === 1 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Primary Objective</h3>
                    <p className="text-slate-500 mb-8">Select the main reason you are looking to build your credit.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {goalOptions.map((goal) => {
                        const Icon = goal.icon;
                        const isSelected = formData.primaryGoal === goal.id;
                        return (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalSelect(goal.id)}
                            className={`group relative flex flex-col p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-4 ring-emerald-500/10'
                                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${
                              isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-lg font-semibold mb-1 transition-colors ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                              {goal.label}
                            </span>
                            <span className="text-sm text-slate-500">{goal.desc}</span>
                            
                            {/* Checkmark indicator */}
                            <div className={`absolute top-5 right-5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- STEP 2 --- */}
                {step === 2 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Custom Goal</h3>
                    <p className="text-slate-500 mb-8">Please describe what you are looking to achieve.</p>
                    
                    <div className="relative">
                      <input
                        ref={otherInputRef}
                        type="text"
                        name="otherGoalReason"
                        value={formData.otherGoalReason}
                        onChange={handleInputChange}
                        onKeyDown={handleOtherInputKeyPress}
                        className="block w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-lg text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm outline-none"
                        placeholder="E.g., I want to lower my mortgage interest rate..."
                      />
                    </div>
                    
                    <div className="mt-8">
                      <button
                        onClick={nextStep}
                        disabled={!formData.otherGoalReason.trim()}
                        className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* --- STEP 3 --- */}
                {step === 3 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Estimated Score</h3>
                    <p className="text-slate-500 mb-8">Choose the range that best represents your current standing.</p>
                    
                    <div className="flex flex-col space-y-3">
                      {scoreOptions.map((score) => {
                        const Icon = score.icon;
                        const isSelected = formData.estimatedScore === score.id;
                        return (
                          <button
                            key={score.id}
                            onClick={() => handleScoreSelect(score.id)}
                            className={`group flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-4 ring-emerald-500/10'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                              isSelected ? 'bg-emerald-500 text-white' : `bg-slate-100 ${score.color}`
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-start flex-grow">
                              <span className={`text-lg font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                                {score.label}
                              </span>
                              <span className="text-slate-500 text-sm">
                                {score.desc}
                              </span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- STEP 4 --- */}
                {step === 4 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Negative Items</h3>
                    <p className="text-slate-500 mb-8">Select any items currently impacting your report (Select all that apply).</p>
                    
                    <div className="flex flex-wrap gap-3 mb-10">
                      {negativeItemOptions.map((item) => {
                        const isSelected = formData.negativeItems.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => handleNegativeItemToggle(item)}
                            className={`flex items-center px-5 py-3 rounded-full border-2 text-sm sm:text-base font-medium transition-all duration-200 shadow-sm ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                            ) : (
                              <div className="w-4 h-4 mr-2 rounded-full border-2 border-slate-300" />
                            )}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={nextStep}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* --- STEP 5 --- */}
                {step === 5 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Additional Context</h3>
                    <p className="text-slate-500 mb-8">Feel free to share any other details about your financial situation. (Optional)</p>
                    
                    <textarea
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="block w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none outline-none text-lg shadow-sm"
                      placeholder="e.g., I have a few late payments from last year due to medical bills..."
                    />
                    
                    <div className="mt-8">
                      <button
                        onClick={nextStep}
                        className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <span>Final Step</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* --- STEP 6 --- */}
                {step === 6 && (
                  <div className="animate-slide-up w-full">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Details</h3>
                    <p className="text-slate-500 mb-8">Enter your information so we can provide your personalized assessment.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-2 border-slate-200 bg-white pl-11 px-4 py-3.5 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-2 border-slate-200 bg-white pl-11 px-4 py-3.5 text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-start space-x-3">
                        <div className="flex items-center h-5 mt-0.5">
                          <input
                            id="tcpaConsent"
                            name="tcpaConsent"
                            type="checkbox"
                            required
                            checked={formData.tcpaConsent}
                            onChange={handleInputChange}
                            className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer transition-all"
                          />
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed">
                          <label htmlFor="tcpaConsent" className="font-bold text-emerald-900 cursor-pointer block mb-0.5 text-sm">
                            Terms & Consent
                          </label>
                          By checking this box, you agree to receive text messages, phone calls, and emails regarding your consultation. Consent is not a condition of purchase. Message & data rates may apply.
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/30 text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Securing Profile...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Request Free Consultation
                              <ChevronRight className="ml-2 w-5 h-5" />
                            </span>
                          )}
                        </button>
                        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-400 mt-5">
                          <Lock className="w-4 h-4" />
                          <span>256-bit SSL encrypted & secure</span>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
