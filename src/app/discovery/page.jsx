'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Custom SVG Icons
const BackpackIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const CompassIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 3 3-6 6-3-3 6zm-3-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const CameraIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>
);

// Curated destinations list
const DESTINATIONS = [
  {
    name: 'Sigiriya Rock Fortress',
    region: 'Cultural Triangle',
    desc: 'An ancient volcanic plug rising 200m from the jungle. Crowned by King Kashyapa in the 5th century, it features legendary frescoes, water gardens, and the imposing Lion Gate.',
    emoji: '🏰',
    tips: 'Hike at sunrise to avoid the midday heat. Wear solid hiking shoes and bring water.'
  },
  {
    name: 'Ella Tea Country',
    region: 'Central Highlands',
    desc: 'A misty mountain town surrounded by endless green tea estates, cascading waterfalls, and pine forests. Famous for the Nine Arch Bridge, Flying Ravana Zipline, and cooler climate.',
    emoji: '🍵',
    tips: 'Nights get cold (~14°C). Bring a warm sweater. Have your camera ready for the train journey.'
  },
  {
    name: 'Pasikudah Bay',
    region: 'Eastern Province',
    desc: 'A calm, horseshoe-shaped bay featuring shallow turquoise waters and white sand. Renowned for stand-up paddleboarding, relaxation, and luxury beachfront resorts.',
    emoji: '🏖️',
    tips: 'Perfect spot for a restful Shabbat. Water remains calm and warm throughout the day.'
  },
  {
    name: 'Trincomalee Reefs',
    region: 'Northeast Coast',
    desc: 'Home to a deep natural harbor and the protected Pigeon Island National Park. Famous for crystal clear waters, turtle sightings, and reef shark snorkeling.',
    emoji: '🤿',
    tips: 'Bring waterproof phone cases. Whale & dolphin watching is available in the morning.'
  }
];

// Sinhala/Tamil vocabulary
const VOCABULARY = [
  { english: 'Hello / Welcome', sinhala: 'Ayubowan', tamil: 'Vanakkam' },
  { english: 'Thank you', sinhala: 'Istuti', tamil: 'Nandri' },
  { english: 'Yes', sinhala: 'Ow', tamil: 'Ama' },
  { english: 'No', sinhala: 'Naa', tamil: 'Illai' },
  { english: 'How much is this?', sinhala: 'Meka keeyada?', tamil: 'Ithu evvalavu?' },
  { english: 'Delicious!', sinhala: 'Hari rasai!', tamil: 'Romba suvaiya!' },
  { english: 'Sorry / Excuse me', sinhala: 'Samavenna', tamil: 'Mannikkavum' }
];

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState('destinations');

  return (
    <div className="w-full min-h-screen bg-brand-dark/95 text-stone-800 font-sans flex justify-center selection:bg-brand-orange/20 relative overflow-hidden">
      {/* Decorative desktop ambient blurs */}
      <div className="absolute top-[-20%] left-[-30%] w-[80%] h-[60%] rounded-full bg-brand-teal/10 blur-[150px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-[-20%] right-[-30%] w-[80%] h-[60%] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-0 hidden md:block" />

      {/* Main app container shell */}
      <main className="w-full max-w-md min-h-screen bg-brand-sand shadow-2xl relative flex flex-col z-10 border-x border-stone-200/40 pb-28">
        
        {/* Header Cover Banner */}
        <div className="relative h-44 bg-brand-dark flex items-end p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-brand-teal/20 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 text-white w-full">
            <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-orange mb-1">Local Guide</h1>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">Discover Sri Lanka</h2>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="px-5 mt-6">
          <div className="bg-white/80 border border-stone-200/40 p-1 rounded-xl flex justify-between shadow-sm">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'destinations' 
                  ? 'bg-brand-dark text-white shadow-sm' 
                  : 'text-stone-500 hover:text-brand-dark'
              }`}
            >
              🧭 Locations
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'language' 
                  ? 'bg-brand-dark text-white shadow-sm' 
                  : 'text-stone-500 hover:text-brand-dark'
              }`}
            >
              🗣️ Language
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-5 mt-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'destinations' ? (
            <>
              {/* Cultural Etiquette Notice Card */}
              <div className="bg-brand-dark rounded-xl p-5 border border-brand-teal/20 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/10 rounded-full blur-xl pointer-events-none"></div>
                <h3 className="text-xs font-bold text-brand-amber uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>ℹ️</span> Respect & Culture Notice
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  When visiting temples, always cover shoulders and knees. Remove footwear and hats before entering sacred spaces. Never pose with your back turned directly to a Buddha statue for photographs.
                </p>
              </div>

              {/* Destination Cards */}
              <div className="space-y-4">
                {DESTINATIONS.map((dest) => (
                  <div key={dest.name} className="bg-white rounded-xl p-5 border border-stone-200/40 shadow-sm space-y-3 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">{dest.region}</span>
                        <h4 className="font-serif font-bold text-lg text-brand-dark leading-tight mt-0.5">{dest.name}</h4>
                      </div>
                      <span className="text-2xl">{dest.emoji}</span>
                    </div>
                    
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {dest.desc}
                    </p>

                    <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 flex items-start space-x-2">
                      <span className="text-sm">💡</span>
                      <p className="text-[11px] text-stone-600 leading-normal font-medium">
                        <strong>Lead Intel:</strong> {dest.tips}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Language Intro */}
              <div className="bg-white rounded-xl p-5 border border-stone-200/40 shadow-sm space-y-2.5">
                <h3 className="font-serif font-bold text-base text-brand-dark">Sinhala & Tamil Guide</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Sri Lanka has two official languages: **Sinhala** (spoken by the majority) and **Tamil** (spoken primarily in the East Coast/Trincomalee areas). English is widely understood in tourist centers, but learning basic phrases shows great respect!
                </p>
              </div>

              {/* Phrase Cards */}
              <div className="bg-white rounded-xl border border-stone-200/40 shadow-sm overflow-hidden divide-y divide-stone-100">
                {VOCABULARY.map((vocab) => (
                  <div key={vocab.english} className="p-4 space-y-1.5 hover:bg-stone-50/50 transition-colors">
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{vocab.english}</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-brand-dark">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">SIN</span>
                        <span>{vocab.sinhala}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded">TAM</span>
                        <span>{vocab.tamil}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Bottom Navigation Dock */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-200/50 flex justify-around py-3 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
          <Link href="/essentials" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <BackpackIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Essentials</span>
          </Link>

          <Link href="/discovery" className="flex flex-col items-center space-y-1 text-brand-orange transition-colors relative">
            <CompassIcon />
            <span className="text-[9px] font-extrabold tracking-wide uppercase">Discover</span>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-brand-orange rounded-full" />
          </Link>

          <Link href="/live" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CalendarIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Live Trip</span>
          </Link>

          <Link href="/memories" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CameraIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Memories</span>
          </Link>
        </nav>

      </main>
    </div>
  );
}
