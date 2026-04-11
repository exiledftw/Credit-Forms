'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, ChevronDown, Scale, Building2, Send, 
  Mail, CalendarClock, ArrowRight, BookOpen, Truck, Briefcase
} from 'lucide-react';

const disputeMethodologies = [
  { value: 'fcra_factual', label: 'FCRA Factual Dispute (Standard)' },
  { value: 'metro2_compliance', label: 'Metro 2 Compliance Audit' },
  { value: 'fdcpa_validation', label: 'FDCPA Debt Validation (VOD)' },
  { value: 'identity_theft', label: 'Identity Theft Block (FTC Report)' },
  { value: 'goodwill_intervention', label: 'Late Payment Goodwill Intervention' },
  { value: 'inquiry_permissible', label: 'Impermissible Purpose (Inquiries)' },
  { value: 'cfpb_escalation', label: 'CFPB / AG Escalation' }
];

const mailingMethods = [
  { value: 'first_class', label: 'Standard First Class Mail' },
  { value: 'certified', label: 'Certified Mail' },
  { value: 'certified_return', label: 'Certified with Return Receipt' },
  { value: 'online_portal', label: 'Electronic / Online Portal (CFPB)' },
  { value: 'fax', label: 'Fax Transmission' }
];

const caseStatuses = [
  { value: 'letters_sent', label: 'Letters Sent (Awaiting Response)' },
  { value: 'pending_docs', label: 'Pending Client Documents (ID/Utility)' },
  { value: 'needs_review', label: 'Needs Consultant Review' },
  { value: 'stall_received', label: 'Stall Letter Received' }
];

// Reusable Custom Dropdown Component
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
        className="w-full flex justify-between items-center rounded-md border border-slate-300 px-4 py-3 text-left bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all sm:text-sm shadow-sm"
      >
        <span className={selectedOption ? "text-slate-900 font-medium" : "text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-180' : 'rotate-0'}`} 
        />
      </button>

      <div
        className={`absolute z-50 mt-2 w-full rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out origin-top ${
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
              className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-blue-50 hover:text-blue-900 transition-colors ${
                value === option.value ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
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

export default function DisputeExpertPortal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swipeState, setSwipeState] = useState('idle'); // 'idle' | 'in' | 'out'
  const [transitionType, setTransitionType] = useState(null); // 'submit' | 'reset' | null
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialFormState = {
    // Client Lookup
    crcLink: '',
    clientName: '',
    
    // Dispute Strategy
    disputeMethodology: '',
    disputedAccounts: '',
    
    // Bureaus Targeted (Checkboxes)
    bureauEquifax: false,
    bureauExperian: false,
    bureauTransUnion: false,
    bureauInnovis: false,
    bureauLexisNexis: false,
    bureauCreditors: false, // Direct to data furnishers
    targetedFurnishers: '',

    // Mailing & Logistics
    mailingMethod: '',
    trackingNumber: '',
    postageCost: '',
    followUpDate: '',
    
    // Internal Status
    newStatus: '',
    processorNotes: '',
    requiresLegalReview: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCustomSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated API call to save processing logs and update CRM
    setTimeout(() => {
      console.log("Processing Data Logged to CRM:", formData);
      
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
      setFormData(initialFormState);
      setIsSuccess(false); 
      setSwipeState('out');

      setTimeout(() => {
        setSwipeState('idle');
        setTransitionType(null);
      }, 700);
    }, 700);
  };

  return (
    <>
      {/* Full Screen Swipe Transition Overlay (Blue/Cyan Theme for Processor) */}
      {mounted && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ visibility: swipeState === 'idle' ? 'hidden' : 'visible' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#0284c7', // light-blue-600
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: swipeState === 'idle' ? 'translateX(-100%)' : swipeState === 'in' ? 'translateX(0)' : 'translateX(100%)',
              transition: swipeState === 'idle' ? 'none' : 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="text-white flex flex-col items-center animate-pulse">
              <Send className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-semibold tracking-tight">
                {transitionType === 'reset' ? 'Loading next case file...' : 'Finalizing Mailing Batch...'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {isSuccess ? (
        /* SUCCESS SCREEN */
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full relative bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up text-center">
            
            <div className="mx-auto relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group cursor-default mb-6">
              <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
              <CheckCircle2 className="w-10 h-10 text-blue-600 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
              
            <h2 className="text-3xl font-bold text-slate-900">Batch Processed</h2>
            <p className="text-slate-600 mb-8">
              Letters for <strong>{formData.clientName || 'Client'}</strong> have been successfully logged. The CRM has been updated and a follow-up task is scheduled.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-sm text-slate-600 flex flex-col gap-3 text-left">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                 <span className="font-medium">Follow-Up Date:</span>
                 <span className="text-slate-900 font-semibold">{formData.followUpDate || 'Not set'}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                 <span className="font-medium">Mailing Method:</span>
                 <span className="text-slate-900 font-semibold">
                   {mailingMethods.find(m => m.value === formData.mailingMethod)?.label || 'Unspecified'}
                 </span>
               </div>
               {formData.trackingNumber && (
                 <div className="flex justify-between items-center">
                   <span className="font-medium">Tracking Number:</span>
                   <span className="text-blue-600 font-mono font-semibold">{formData.trackingNumber}</span>
                 </div>
               )}
            </div>

            <button
              onClick={handleResetForm}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Process Next Client File
            </button>
          </div>
        </div>
      ) : (
        /* PRIMARY FORM SCREEN */
        <div className="flex min-h-screen font-sans bg-slate-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200 space-y-8">
        
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                  Dispute Processor Hub
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Generate letters, assign methodologies, and log mailing data.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                  Processor Operations
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-10 mt-6">
              
              {/* SECTION 1: Client Verification */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> Target Case File
                </h3>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="crcLink" className="block text-sm font-medium text-slate-700">CRC Client Link</label>
                    <input
                      type="url"
                      id="crcLink"
                      name="crcLink"
                      required
                      placeholder="https://app.creditrepaircloud.com/..."
                      value={formData.crcLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-slate-700">Client Full Name</label>
                    <input
                      type="text"
                      id="clientName"
                      name="clientName"
                      required
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Dispute Architecture */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" /> Dispute Architecture
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Legal Methodology</label>
                    <CustomDropdown
                      name="disputeMethodology"
                      value={formData.disputeMethodology}
                      onChange={handleCustomSelectChange}
                      placeholder="Select Law / Strategy to Apply"
                      options={disputeMethodologies}
                    />
                  </div>

                  <div>
                    <label htmlFor="disputedAccounts" className="block text-sm font-medium text-slate-700 mb-1">
                      Accounts / Items Disputed (This Round)
                    </label>
                    <textarea
                      id="disputedAccounts"
                      name="disputedAccounts"
                      required
                      rows={3}
                      value={formData.disputedAccounts}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm resize-none"
                      placeholder="E.g., 1. Capital One (Acct #1234...) - Late payments&#10;2. Portfolio Recovery - Collection account"
                    />
                  </div>
                </div>

                {/* Bureau Selection Checkboxes */}
                <div className="pt-2">
                  <label className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Destination Entities (Bureaus / Furnishers)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'bureauEquifax', label: 'Equifax' },
                      { id: 'bureauExperian', label: 'Experian' },
                      { id: 'bureauTransUnion', label: 'TransUnion' },
                      { id: 'bureauInnovis', label: 'Innovis' },
                      { id: 'bureauLexisNexis', label: 'LexisNexis' },
                      { id: 'bureauCreditors', label: 'Direct to Creditors' },
                    ].map((bureau) => (
                      <label 
                        key={bureau.id} 
                        className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          formData[bureau.id] 
                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={bureau.id}
                          checked={formData[bureau.id]}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <span className={`ml-3 text-sm font-medium ${formData[bureau.id] ? 'text-blue-900' : 'text-slate-700'}`}>
                          {bureau.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Conditional Data Furnishers Input */}
                  {formData.bureauCreditors && (
                    <div className="mt-4 p-4 bg-slate-50/50 border border-slate-200 rounded-lg transition-all duration-300 ease-in-out">
                      <label htmlFor="targetedFurnishers" className="block text-sm font-medium text-slate-700 mb-1">
                        Specific Data Furnishers Targeted
                      </label>
                      <textarea
                        id="targetedFurnishers"
                        name="targetedFurnishers"
                        rows={2}
                        value={formData.targetedFurnishers}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm resize-none"
                        placeholder="E.g., Portfolio Recovery Associates, Capital One, Chase..."
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        List the specific banks, creditors, or collection agencies receiving direct letters.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Logistics & Tracking */}
              <div className="space-y-5 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" /> Dispatch & Logistics
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Method</label>
                    <CustomDropdown
                      name="mailingMethod"
                      value={formData.mailingMethod}
                      onChange={handleCustomSelectChange}
                      placeholder="Select Dispatch Type"
                      options={mailingMethods}
                    />
                  </div>

                  <div>
                    <label htmlFor="trackingNumber" className="block text-sm font-medium text-slate-700 mb-1">
                      USPS Tracking Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="trackingNumber"
                        name="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={handleInputChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="block w-full rounded-md border border-slate-300 pl-9 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="followUpDate" className="block text-sm font-medium text-slate-700 mb-1">
                      Scheduled Follow-up Date
                    </label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        id="followUpDate"
                        name="followUpDate"
                        required
                        value={formData.followUpDate}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-slate-300 pl-9 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Typically 35-40 days from mailing date.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Update CRM Status</label>
                    <CustomDropdown
                      name="newStatus"
                      value={formData.newStatus}
                      onChange={handleCustomSelectChange}
                      placeholder="Select New Status"
                      options={caseStatuses}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Notes & Escalation */}
              <div className="space-y-4 pt-4">
                <div>
                  <label htmlFor="processorNotes" className="block text-sm font-medium text-slate-700 mb-1">
                    Internal Notes (Visible to Consultant)
                  </label>
                  <textarea
                    id="processorNotes"
                    name="processorNotes"
                    rows={3}
                    value={formData.processorNotes}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all sm:text-sm resize-none"
                    placeholder="Provide any feedback for the consultant or detail specific anomalies..."
                  />
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start space-x-3 mt-4">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="requiresLegalReview"
                      name="requiresLegalReview"
                      type="checkbox"
                      checked={formData.requiresLegalReview}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div className="text-sm text-red-800 leading-relaxed">
                    <label htmlFor="requiresLegalReview" className="font-semibold cursor-pointer">
                      Flag for Legal / Attorney Review
                    </label>
                    <p className="mt-1 opacity-90 text-red-700">
                      Check this box if the creditor is refusing to comply after multiple rounds, or if blatant FCRA/FDCPA violations are present requiring escalation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging Batch Data...
                    </>
                  ) : (
                    <>
                      Log Dispatch & Update CRM <ArrowRight className="w-4 h-4" />
                    </>
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
