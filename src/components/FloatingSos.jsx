'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SosModal from './SosModal';

const SosIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);

export default function FloatingSos() {
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide completely on login page if desired, or keep it. Let's keep it but adjust position.
  // The bottom navigation dock is present on /live, /essentials, /discovery, /memories
  const hasBottomNav = ['/live', '/essentials', '/discovery', '/memories'].includes(pathname);
  const bottomClass = hasBottomNav ? 'bottom-24' : 'bottom-6';

  return (
    <>
      <button
        onClick={() => setIsSosOpen(true)}
        className={`fixed ${bottomClass} right-5 md:right-[calc(50vw-220px+20px)] z-40 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-red-600/20 transition-all duration-300 active:scale-95 flex items-center space-x-2 group cursor-pointer`}
        aria-label="Trigger SOS Help"
      >
        <SosIcon />
        <span className="text-[10px] font-bold uppercase tracking-wider">Emergency 🚨</span>
      </button>

      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
}
