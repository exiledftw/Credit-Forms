'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, ChevronDown, User, Mail, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';

const estimatedScoreOptions = [
  { value: 'excellent', label: 'Excellent (720 - 850)' },
  { value: 'good', label: 'Good (680 - 719)' },
  { value: 'fair', label: 'Fair (620 - 679)' },
  { value: 'poor', label: 'Poor (Under 620)' },
  { value: 'unsure', label: "I'm not sure" },
];

const primaryGoalOptions = [
  { value: 'buy_house', label: 'Buy a House / Mortgage' },
  { value: 'buy_car', label: 'Buy a Car / Auto Loan' },
  { value: 'get_credit_card', label: 'Get Approved for Credit Cards' },
  { value: 'business_funding', label: 'Business Funding / Loans' },
  { value: 'general_improvement', label: 'General Score Improvement' },
];

const CustomDropdown = ({ options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative mt-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center rounded-md border border-gray-300 px-4 py-3 text-left bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-180' : 'rotate-0'}`} 
        />
      </button>

      <div
        className={`absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out origin-top ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul 
          className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm"
          onWheel={(e) => {
            const el = e.currentTarget;
            const hasScrollableContent = el.scrollHeight > el.clientHeight;
            if (!hasScrollableContent) return;
            const isAtTop = el.scrollTop === 0 && e.deltaY < 0;
            const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
            if (!isAtTop && !isAtBottom) {
              e.stopPropagation();
            }
            // Always prevent page scroll when inside a scrollable dropdown
            if (hasScrollableContent) {
              if (isAtTop || isAtBottom) {
                e.preventDefault();
              }
            }
          }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(name, option.value);
                setIsOpen(false);
              }}
              className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${
                value === option.value ? 'bg-emerald-50 text-emerald-900 font-medium' : 'text-gray-900'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function CreditRepairForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swipeState, setSwipeState] = useState('idle'); // 'idle' | 'in' | 'out'
  const [transitionType, setTransitionType] = useState(null); // 'submit' | 'back' | null
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Flat state structure makes it extremely easy to parse in your route.ts
  // and map directly to GoHighLevel Custom Fields.
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    estimatedScore: '',
    primaryGoal: '',
    negativeItems: [],
    description: '',
    tcpaConsent: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = e.target.checked;
      if (name === 'tcpaConsent') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle negative items array
        setFormData(prev => {
          const items = prev.negativeItems;
          if (checked) return { ...prev, negativeItems: [...items, value] };
          return { ...prev, negativeItems: items.filter(item => item !== value) };
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    /* ========================================================================
      NEXT.JS API ROUTE INTEGRATION (GoHighLevel)
      ========================================================================
      Here is exactly how you would connect this to your route.ts:

      try {
        const response = await fetch('/api/ghl-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
           // We will trigger the transition overlay logic below when ok.
        }
      } catch (error) {
        console.error("Submission failed", error);
      }
      ========================================================================
    */

    // Simulating API Call for visual feedback
    setTimeout(() => {
      console.log("Payload ready for route.ts -> GHL:", formData);
      
      // Start the full-screen green swipe entering
      setTransitionType('submit');
      setSwipeState('in');

      // Wait for the green overlay to fully cover the screen (700ms match with CSS duration)
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true); // Swap the UI underneath the overlay
        setSwipeState('out'); // Trigger the overlay to sweep out to the right

        // Reset overlay state after it has fully exited
        setTimeout(() => {
          setSwipeState('idle');
          setTransitionType(null);
        }, 700);
      }, 700);

    }, 1500);
  };

  const negativeItemOptions = [
    "Late Payments", "Collections", "Charge-offs", 
    "Bankruptcies", "Tax Liens", "Hard Inquiries", "Identity Theft/Fraud"
  ];

  const handleBackToForm = () => {
    // Start the full-screen green swipe entering
    setTransitionType('back');
    setSwipeState('in');

    // Wait for the green overlay to fully cover the screen (700ms match with CSS duration)
    setTimeout(() => {
      setIsSuccess(false); // Swap the UI underneath the overlay
      setSwipeState('out'); // Trigger the overlay to sweep out to the right

      // Reset overlay state after it has fully exited
      setTimeout(() => {
        setSwipeState('idle');
        setTransitionType(null);
      }, 700);
    }, 700);
  };

  return (
    <>
      {/* Full Screen Swipe Transition Overlay 
        Uses translation to smoothly sweep across without layout jank.
      */}
      {mounted && (
        <div
          className="fixed inset-0 z-9999 pointer-events-none overflow-hidden"
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
            {/* Subtle loading pulse in the middle of the swipe */}
            <div className="text-white flex flex-col items-center animate-pulse">
              <ShieldCheck className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-semibold tracking-tight">
                {transitionType === 'back' ? 'Heading back!' : 'Securing your profile...'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {isSuccess ? (
        /* SUCCESS / BOOKING SCREEN */
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4 sm:p-6">
          <div className="max-w-4xl w-full relative bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-fade-in-up">
            
            <button 
              onClick={handleBackToForm}
              className="absolute top-4 left-4 sm:top-8 sm:left-8 group flex items-center justify-center w-12 h-12 bg-white hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-full border border-gray-100 hover:border-emerald-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 z-10"
              title="Cancel and return to form"
              aria-label="Cancel and return to form"
            >
              <ArrowLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

            <div className="text-center space-y-4 mb-8 pt-8 sm:pt-0">
              
              {/* ANIMATED GREEN CHECKMARK ICON */}
              <div className="mx-auto relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center group cursor-default">
                {/* Ping animation ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
                {/* Inner icon */}
                <CheckCircle2 className="w-8 h-8 text-emerald-500 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              
            <h2 className="text-3xl font-bold text-gray-900">You're almost there!</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your profile information has been securely received. Please select a convenient time below to finalize and schedule your strategy session with one of our credit consultants.
            </p>
          </div>

          {/* Motion Booking Widget Embed */}
          <div className="w-full bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden" style={{ height: '650px' }}>
            <iframe
              /* TESTING URL APPLIED: 
                I've added a public Google Calendar here just so you can test the UI and see a working calendar.
                REPLACE THIS SRC WITH YOUR ACTUAL MOTION (OR CALENDLY) EMBED LINK BEFORE GOING LIVE.
              */
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
        /* PRIMARY FORM SCREEN */
        <div className="flex min-h-screen font-sans bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100 space-y-8">
        
            {/* Header & Logo */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 mb-6">
                <img 
                  src="/lionheart.webp" 
                  alt="Brand Logo" 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              </div>
              
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Start Your <span className="text-yellow-700">Credit Repair</span> Journey
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Provide some quick details so our consultants can prepare for your meeting.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 pl-10 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 pl-10 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4 my-6"></div>

              {/* Credit Questions */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="estimatedScore" className="block text-sm font-medium text-gray-700">Estimated Credit Score</label>
                  <CustomDropdown
                    name="estimatedScore"
                    value={formData.estimatedScore}
                    onChange={handleCustomSelectChange}
                    placeholder="Select an estimated range"
                    options={estimatedScoreOptions}
                  />
                </div>

                <div>
                  <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700">Primary Goal</label>
                  <CustomDropdown
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleCustomSelectChange}
                    placeholder="What are you trying to achieve?"
                    options={primaryGoalOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What negative items do you suspect are on your report? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {negativeItemOptions.map((item) => (
                      <label key={item} className="flex items-center space-x-3 bg-gray-50 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-emerald-50 transition-colors">
                        <input
                          type="checkbox"
                          name="negativeItems"
                          value={item}
                          checked={formData.negativeItems.includes(item)}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 accent-emerald-700 focus:ring-emerald-700"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Brief Description of Your Situation</label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all sm:text-sm resize-none"
                      placeholder="Tell us a little bit about what you need help with..."
                    />
                  </div>
                </div>
              </div>

              {/* TCPA Consent (CRITICAL FOR US GHL ACCOUNTS) */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-start space-x-3 mt-6">
                <div className="flex items-center h-5 mt-1">
                  <input
                    id="tcpaConsent"
                    name="tcpaConsent"
                    type="checkbox"
                    required
                    checked={formData.tcpaConsent}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-700 focus:ring-emerald-700"
                  />
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  <label htmlFor="tcpaConsent" className="font-medium text-gray-700 cursor-pointer">
                    I agree to receive communications.
                  </label>{' '}
                  By checking this box, you agree to receive text messages, phone calls, and emails from our team regarding your credit consultation. Consent is not a condition of purchase. Message & data rates may apply.
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Request Free Consultation"
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Your information is encrypted and secure.</span>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}