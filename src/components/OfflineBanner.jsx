'use client';

import React, { useState, useEffect } from 'react';

/**
 * Offline Connection Indicator Banner.
 * Monitors the browser's connectivity status dynamically and displays a styled warning
 * if the traveler drops off the cellular/Wi-Fi grid.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Check initial status
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    // 2. Define listener handlers
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // 3. Attach event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 4. Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down">
      <div className="bg-amber-600 text-white px-4 py-3 shadow-md border-b border-amber-700 flex items-start space-x-3 max-w-md mx-auto rounded-b-2xl">
        {/* Warning Icon */}
        <div className="flex-shrink-0 mt-0.5 bg-amber-500 p-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        
        {/* Banner Text */}
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-100">Offline Mode Active</h4>
          <p className="text-xs text-white leading-relaxed mt-0.5">
            You are viewing a cached version of today's itinerary. Emergency contacts remain fully functional.
          </p>
        </div>
      </div>
      
      {/* Dynamic Slide Down CSS Keyframes */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
