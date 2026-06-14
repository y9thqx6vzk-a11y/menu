import React, { useEffect } from 'react';

/**
 * SOS Emergency Modal Component.
 * Implements a slide-up drawer layout optimized for mobile screens.
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Close callback function
 */
export default function SosModal({ isOpen, onClose }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop overlay with fade animation */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Modal container with slide-up mobile-app-drawer animation */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 pb-8 z-10 transition-transform duration-300 ease-out border-t border-red-100 max-h-[85vh] overflow-y-auto">
        
        {/* Mobile Pull Tab Indicator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" onClick={onClose} />

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SOS Emergency Support</h2>
            <p className="text-xs text-gray-500">Instant dial help and embassy support</p>
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          
          {/* 1. Trip Coordinators */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 pl-1">Trip Leaders</span>
            
            {/* Naomi */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Naomi</h3>
                <p className="text-xs text-gray-500">+94 77 111 2222</p>
              </div>
              <a 
                href="tel:+94771112222" 
                className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 01-9.352-9.352c-.155-.44-.012-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            </div>

            {/* Eyal */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Eyal</h3>
                <p className="text-xs text-gray-500">+94 77 333 4444</p>
              </div>
              <a 
                href="tel:+94773334444" 
                className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 01-9.352-9.352c-.155-.44-.012-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            </div>

            {/* Aliza */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Aliza</h3>
                <p className="text-xs text-gray-500">+94 77 555 6666</p>
              </div>
              <a 
                href="tel:+94775556666" 
                className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 01-9.352-9.352c-.155-.44-.012-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Sri Lanka Tourist Police */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-500">Local Emergency</span>
              <h3 className="font-semibold text-gray-900 text-base">Sri Lanka Tourist Police</h3>
              <p className="text-xs text-gray-500">011-2421052 (Colombo HQ)</p>
            </div>
            <a 
              href="tel:+94112421052" 
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 01-9.352-9.352c-.155-.44-.012-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
          </div>

          {/* 3. Israeli Embassy (New Delhi) */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Consular Assistance</span>
                <h3 className="font-semibold text-gray-900 text-base">Embassy of Israel (New Delhi)</h3>
                <p className="text-xs text-gray-500">+91-11-30414500</p>
              </div>
              <a 
                href="tel:+911130414500" 
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 01-9.352-9.352c-.155-.44-.012-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            </div>
            
            {/* Clear Embassy Disclaimer */}
            <div className="p-3 bg-white/80 rounded-xl border border-blue-100 flex items-start space-x-2">
              <span className="text-lg leading-none mt-0.5">ℹ️</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Important Notice:</strong> Israel does not maintain a physical embassy building in Sri Lanka. Consular jurisdiction and emergency operations are coordinated remotely through the embassy in New Delhi, India.
              </p>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-gray-800 font-semibold rounded-2xl transition-colors text-center text-sm"
        >
          Close Panel
        </button>

      </div>
    </div>
  );
}
