'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SosModal from './SosModal';

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
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Emergency 🚨</span>
      </button>

      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
}
