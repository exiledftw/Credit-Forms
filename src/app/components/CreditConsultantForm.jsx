'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, ChevronDown, User, Lock, MapPin, ShieldCheck, ArrowLeft, FileText, CreditCard } from 'lucide-react';

const monitoringProviders = [
  { value: 'identity_iq', label: 'IdentityIQ' },
  { value: 'smart_credit', label: 'SmartCredit' },
  { value: 'myscore_iq', label: 'MyScoreIQ' },
  { value: 'privacy_guard', label: 'PrivacyGuard' },
  { value: 'annual_credit_report', label: 'AnnualCreditReport.com' },
  { value: 'other', label: 'Other (Specify in notes)' },
];

const disputeRounds = [
  { value: 'round_1', label: 'Round 1 (Initial Dispute)' },
  { value: 'round_2', label: 'Round 2 (Follow-up / Escalation)' },
  { value: 'round_3', label: 'Round 3 (Warning / CFPB Intent)' },
  { value: 'stall_tactic', label: 'Stall Tactic Response' },
  { value: 'inquiry_removal', label: 'Hard Inquiry Removal Focus' },
  { value: 'personal_info', label: 'Personal Info Sweep Only' },
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
        className="w-full flex justify-between items-center rounded-md border border-gray-300 px-4 py-3 text-left bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
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
              className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-indigo-50 hover:text-indigo-900 transition-colors ${
                value === option.value ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-gray-900'
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

export default function CreditConsultantForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swipeState, setSwipeState] = useState('idle'); // 'idle' | 'in' | 'out'
  const [transitionType, setTransitionType] = useState(null); // 'submit' | 'reset' | null
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialFormState = {
    // Client Demographics
    clientFirstName: '',
    clientLastName: '',
    dob: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Credit Monitoring
    monitoringProvider: '',
    monitoringUser: '',
    monitoringPass: '',
    monitoringPin: '',

    // Processing Strategy
    selectedPackage: '',
    disputeRound: '',
    processorInstructions: '',
    priorityProcessing: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
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
      API ROUTE INTEGRATION (Processor / CRM / Webhook)
      ========================================================================
      try {
        const response = await fetch('/api/processor-handoff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) { ... }
      } catch (error) { ... }
      ========================================================================
    */

    setTimeout(() => {
      console.log("Payload ready for Processing Team:", formData);
      
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

  const handleResetForm = () => {
    setTransitionType('reset');
    setSwipeState('in');

    setTimeout(() => {
      setFormData(initialFormState); // Clear form for next client
      setIsSuccess(false); 
      setSwipeState('out');

      setTimeout(() => {
        setSwipeState('idle');
        setTransitionType(null);
      }, 700);
    }, 700);
  };

  const packageOptions = ["Standard", "Pro", "Elite"];

  return (
    <>
      {/* Full Screen Swipe Transition Overlay (Indigo Theme) */}
      {mounted && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ visibility: swipeState === 'idle' ? 'hidden' : 'visible' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#4f46e5', // Indigo-600
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: swipeState === 'idle' ? 'translateX(-100%)' : swipeState === 'in' ? 'translateX(0)' : 'translateX(100%)',
              transition: swipeState === 'idle' ? 'none' : 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="text-white flex flex-col items-center animate-pulse">
              <FileText className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-semibold tracking-tight">
                {transitionType === 'reset' ? 'Loading fresh workspace...' : 'Transferring to Processing Team...'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {isSuccess ? (
        /* SUCCESS SCREEN (Consultant Internal View) */
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4 sm:p-6">
          <div className="max-w-xl w-full relative bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up text-center">
            
            <div className="mx-auto relative w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center group cursor-default mb-6">
              <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
              <CheckCircle2 className="w-10 h-10 text-indigo-600 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
              
            <h2 className="text-3xl font-bold text-slate-900">Case Submitted</h2>
            <p className="text-slate-600 mb-8">
              The client file for <strong>{formData.clientFirstName} {formData.clientLastName}</strong> has been successfully securely routed to the processing team queue. Letters will be generated based on your instructions.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8 text-sm text-slate-500 flex flex-col gap-2">
               <div className="flex justify-between">
                 <span>Processing Priority:</span>
                 <span className={formData.priorityProcessing ? "text-amber-600 font-semibold" : "text-slate-700 font-medium"}>
                   {formData.priorityProcessing ? "High Priority (Rush)" : "Standard"}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span>Requested Action:</span>
                 <span className="text-slate-700 font-medium">
                   {disputeRounds.find(r => r.value === formData.disputeRound)?.label || "Unspecified"}
                 </span>
               </div>
            </div>

            <button
              onClick={handleResetForm}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Start Next Client File
            </button>
          </div>
        </div>
      ) : (
        /* PRIMARY FORM SCREEN (Consultant Internal View) */
        <div className="flex min-h-screen font-sans bg-slate-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 space-y-8">
        
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  Processor Handoff Portal
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Submit client details and credit monitoring credentials to the dispute team.
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  Internal Secure Mode
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
              
              {/* SECTION 1: Client Demographics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> Client Information
                </h3>
                
                <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="clientFirstName" className="block text-sm font-medium text-slate-700">First Name</label>
                    <input
                      type="text"
                      id="clientFirstName"
                      name="clientFirstName"
                      required
                      value={formData.clientFirstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientLastName" className="block text-sm font-medium text-slate-700">Last Name</label>
                    <input
                      type="text"
                      id="clientLastName"
                      name="clientLastName"
                      required
                      value={formData.clientLastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="ssn" className="block text-sm font-medium text-slate-700">Social Security Number</label>
                    <input
                      type="text"
                      id="ssn"
                      name="ssn"
                      required
                      placeholder="XXX-XX-XXXX"
                      value={formData.ssn}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6 mt-4">
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700">Current Address</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-slate-300 pl-9 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-sm font-medium text-slate-700">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      maxLength="2"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm uppercase"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Credit Monitoring */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" /> Credit Monitoring Access
                </h3>
                
                <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="monitoringProvider" className="block text-sm font-medium text-slate-700">Monitoring Provider</label>
                    <CustomDropdown
                      name="monitoringProvider"
                      value={formData.monitoringProvider}
                      onChange={handleCustomSelectChange}
                      placeholder="Select Provider (e.g., IdentityIQ)"
                      options={monitoringProviders}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="monitoringUser" className="block text-sm font-medium text-slate-700">Username</label>
                    <input
                      type="text"
                      id="monitoringUser"
                      name="monitoringUser"
                      required
                      value={formData.monitoringUser}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="monitoringPass" className="block text-sm font-medium text-slate-700">Password</label>
                    <div className="mt-1 relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        id="monitoringPass"
                        name="monitoringPass"
                        required
                        value={formData.monitoringPass}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-slate-300 pl-9 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="monitoringPin" className="block text-sm font-medium text-slate-700">Security Word / PIN (If applicable)</label>
                    <input
                      type="text"
                      id="monitoringPin"
                      name="monitoringPin"
                      value={formData.monitoringPin}
                      onChange={handleInputChange}
                      placeholder="e.g. Mother's maiden name or 4-digit PIN"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Processing & Strategy */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Dispute Strategy & Instructions
                </h3>

                <div>
                  <label htmlFor="disputeRound" className="block text-sm font-medium text-slate-700">Requested Action / Round</label>
                  <CustomDropdown
                    name="disputeRound"
                    value={formData.disputeRound}
                    onChange={handleCustomSelectChange}
                    placeholder="Select Processing Phase"
                    options={disputeRounds}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Package Selection
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {packageOptions.map((pkg) => (
                      <label key={pkg} className={`flex items-center justify-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors ${formData.selectedPackage === pkg ? 'border-indigo-500 bg-indigo-50' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                        <input
                          type="radio"
                          name="selectedPackage"
                          value={pkg}
                          checked={formData.selectedPackage === pkg}
                          onChange={handleInputChange}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span className={`text-sm font-medium ${formData.selectedPackage === pkg ? 'text-indigo-900' : 'text-slate-700'}`}>{pkg}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="processorInstructions" className="block text-sm font-medium text-slate-700">Instructions for Processing Team</label>
                  <textarea
                    id="processorInstructions"
                    name="processorInstructions"
                    rows={4}
                    value={formData.processorInstructions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all sm:text-sm resize-none"
                    placeholder="E.g., Client claims identity theft on the 3 Capital One accounts. Focus heavily on hard inquiries this round."
                  />
                </div>
              </div>

              {/* Priority Flag */}
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start space-x-3 mt-6">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="priorityProcessing"
                    name="priorityProcessing"
                    type="checkbox"
                    checked={formData.priorityProcessing}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-600"
                  />
                </div>
                <div className="text-sm text-amber-800 leading-relaxed">
                  <label htmlFor="priorityProcessing" className="font-semibold cursor-pointer">
                    Flag for Rush Processing (24hr Turnaround)
                  </label>{' '}
                  <p className="mt-1 opacity-80">Only select this if the client has paid for expedited processing. Standard SLA is 3-5 business days.</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending to Processor...
                    </span>
                  ) : (
                    "Submit to Processing Team"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
