'use client';

import React, { useState, useEffect } from 'react';
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

const ChevronIcon = ({ className = "w-4 h-4", direction = "down" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className={`${className} transition-transform duration-300 ${direction === 'up' ? 'rotate-180' : ''}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// Packing Checklist Data
const CHECKLIST_ITEMS = [
  { id: 'sarong', text: 'Sarong / modest scarf (covering shoulders & knees)', category: 'clothing' },
  { id: 'shabbat-white', 'text': 'White dress or shirt for Shabbat Pasikudah', category: 'clothing' },
  { id: 'linen-pants', text: 'Lightweight linen/cotton pants (breathable)', category: 'clothing' },
  { id: 'tshirts', text: 'Comfy cotton t-shirts (for long bus rides)', category: 'clothing' },
  { id: 'fleece', text: 'Warm fleece or sweater (Nuwara Eliya gets cold ~14°C)', category: 'clothing' },
  
  { id: 'hiking-shoes', text: 'Sturdy hiking boots or trail sneakers (Sigiriya)', category: 'gear' },
  { id: 'water-shoes', text: 'Water shoes (Rafting & Canyoning Kithulgala)', category: 'gear' },
  { id: 'swimwear', text: 'Swimwear & rash guard (SUP Pasikudah & snorkeling)', category: 'gear' },
  { id: 'poncho', text: 'Rain poncho or compact travel umbrella', category: 'gear' },
  { id: 'insect-repellent', text: 'DEET mosquito repellent & high SPF sunscreen', category: 'gear' },
  
  { id: 'passport', text: 'Passport (valid for at least 6 months)', category: 'docs' },
  { id: 'visa', text: 'Sri Lanka ETA Visa approval printout', category: 'docs' },
  { id: 'insurance', text: 'Travel insurance certificate & emergency numbers', category: 'docs' },
  { id: 'usd-cash', text: 'US Dollars cash (clean, uncreased bills for local exchange)', category: 'docs' },
  { id: 'intl-license', text: 'International Driver\'s License (optional)', category: 'docs' },
];

export default function EssentialsPage() {
  const [activeCategory, setActiveCategory] = useState('clothing');
  const [checkedItems, setCheckedItems] = useState({});
  const [isSimCardOpen, setIsSimCardOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isVaccinesOpen, setIsVaccinesOpen] = useState(false);

  // Load checklist from localStorage on client mount
  useEffect(() => {
    const saved = localStorage.getItem('sri_lanka_packing_checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse checklist', e);
      }
    }
  }, []);

  // Toggle item status
  const handleToggle = (itemId) => {
    const updated = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    };
    setCheckedItems(updated);
    localStorage.setItem('sri_lanka_packing_checklist', JSON.stringify(updated));
  };

  // Compute stats
  const totalItems = CHECKLIST_ITEMS.length;
  const totalPacked = Object.values(checkedItems).filter(Boolean).length;
  const percentPacked = totalItems > 0 ? Math.round((totalPacked / totalItems) * 100) : 0;

  // Filtered items
  const filteredItems = CHECKLIST_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="w-full h-screen bg-brand-dark/95 text-stone-800 flex justify-center selection:bg-brand-orange/20 relative overflow-hidden">
      {/* Decorative desktop ambient blurs */}
      <div className="absolute top-[-20%] left-[-30%] w-[80%] h-[60%] rounded-full bg-brand-teal/10 blur-[150px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-[-20%] right-[-30%] w-[80%] h-[60%] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-0 hidden md:block" />

      {/* Main app container shell */}
      <main className="w-full max-w-md h-full bg-brand-sand shadow-2xl relative flex flex-col z-10 border-x border-stone-200/40 overflow-hidden">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pb-28">
        
        {/* Header Cover Banner */}
        <div className="relative h-44 bg-brand-dark flex items-end p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-brand-teal/20 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 text-white w-full">
            <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-orange mb-1">Preparation</h1>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">Trip Essentials</h2>
          </div>
        </div>

        {/* Global Progress Board Card */}
        <div className="px-5 mt-[-24px] z-10 relative">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/40 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Packing Progress</span>
                <h3 className="font-serif font-bold text-lg text-brand-dark leading-tight mt-0.5">Ready to Roll?</h3>
              </div>
              <span className="text-2xl font-serif font-bold text-brand-teal">{percentPacked}%</span>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/20">
              <div 
                className="h-full bg-gradient-to-r from-brand-teal to-brand-amber rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${percentPacked}%` }}
              />
            </div>
            
            <p className="text-[10px] text-stone-400 mt-2.5">
              Packed {totalPacked} of {totalItems} total recommended items
            </p>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="px-5 mt-6">
          <div className="bg-white/80 border border-stone-200/40 p-1 rounded-xl flex justify-between shadow-sm">
            <button
              onClick={() => setActiveCategory('clothing')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'clothing' 
                  ? 'bg-brand-dark text-white shadow-sm' 
                  : 'text-stone-500 hover:text-brand-dark'
              }`}
            >
              👕 Clothes
            </button>
            <button
              onClick={() => setActiveCategory('gear')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'gear' 
                  ? 'bg-brand-dark text-white shadow-sm' 
                  : 'text-stone-500 hover:text-brand-dark'
              }`}
            >
              👟 Gear
            </button>
            <button
              onClick={() => setActiveCategory('docs')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'docs' 
                  ? 'bg-brand-dark text-white shadow-sm' 
                  : 'text-stone-500 hover:text-brand-dark'
              }`}
            >
              🛂 Docs & Cash
            </button>
          </div>
        </div>

        {/* Interactive Checklist Cards */}
        <div className="px-5 mt-4 space-y-2 flex-1">
          {filteredItems.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div 
                key={item.id} 
                onClick={() => handleToggle(item.id)}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-center space-x-3.5 cursor-pointer select-none ${
                  isChecked 
                    ? 'bg-brand-teal/5 border-brand-teal/30 opacity-75' 
                    : 'bg-white border-stone-200/50 hover:bg-stone-50'
                }`}
              >
                {/* Custom Checkbox */}
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isChecked 
                    ? 'bg-brand-teal border-brand-teal text-white' 
                    : 'border-stone-300 bg-white'
                }`}>
                  {isChecked && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs leading-normal transition-all ${
                  isChecked ? 'line-through text-stone-400 font-medium' : 'text-stone-700 font-medium'
                }`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pre-Trip Traveler Intel (Collapsible widgets) */}
        <div className="px-5 mt-8 space-y-3">
          <h3 className="text-xs font-bold text-stone-400 tracking-[0.25em] uppercase pl-1">TRAVEL INTEL</h3>
          
          {/* SIM Cards Info */}
          <div className="bg-white rounded-xl border border-stone-200/40 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsSimCardOpen(!isSimCardOpen)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-stone-700"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">📱</span>
                <span>Mobile SIM & Data</span>
              </div>
              <ChevronIcon className="text-stone-400" direction={isSimCardOpen ? 'up' : 'down'} />
            </button>
            {isSimCardOpen && (
              <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed space-y-2 border-t border-stone-100 pt-3 bg-stone-50/50">
                <p>
                  <strong>Dialog</strong> or <strong>Mobitel</strong> are the primary operators on the island with excellent 4G/LTE coverage.
                </p>
                <p>
                  You can purchase a tourist SIM card directly at Colombo Airport (CMB) arrival lounge for approx. $10-$15 USD (includes ~50GB data). Ensure your phone is network-unlocked!
                </p>
              </div>
            )}
          </div>

          {/* Currency Info */}
          <div className="bg-white rounded-xl border border-stone-200/40 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-stone-700"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">💵</span>
                <span>Currency & Cash Exchange</span>
              </div>
              <ChevronIcon className="text-stone-400" direction={isCurrencyOpen ? 'up' : 'down'} />
            </button>
            {isCurrencyOpen && (
              <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed space-y-2 border-t border-stone-100 pt-3 bg-stone-50/50">
                <p>
                  Sri Lanka operates on **Sri Lankan Rupee (LKR)**.
                </p>
                <p>
                  Bring clean, uncreased US Dollar bills ($50 or $100 notes offer the best exchange rates). You can convert USD to LKR at airport counters or hotel receptions.
                </p>
                <p>
                  Visa and Mastercard are accepted in hotels, but local street food, markets, and safari guides require cash Rupees.
                </p>
              </div>
            )}
          </div>

          {/* Health & Vaccines */}
          <div className="bg-white rounded-xl border border-stone-200/40 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsVaccinesOpen(!isVaccinesOpen)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-stone-700"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">💉</span>
                <span>Health & Vaccinations</span>
              </div>
              <ChevronIcon className="text-stone-400" direction={isVaccinesOpen ? 'up' : 'down'} />
            </button>
            {isVaccinesOpen && (
              <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed space-y-2 border-t border-stone-100 pt-3 bg-stone-50/50">
                <p>
                  No specific mandatory vaccines are required unless entering from a yellow fever zone. Standard Hep A, Hep B, and Tetanus updates are recommended.
                </p>
                <p>
                  **Malaria** risk is extremely low. However, **Dengue fever** exists; use DEET mosquito sprays generously, especially during jungle treks and evenings.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

        {/* Sticky Mobile Bottom Navigation Dock */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-200/50 flex justify-around py-3 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
          <Link href="/essentials" className="flex flex-col items-center space-y-1 text-brand-orange transition-colors relative">
            <BackpackIcon />
            <span className="text-[9px] font-extrabold tracking-wide uppercase">Essentials</span>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-brand-orange rounded-full" />
          </Link>

          <Link href="/discovery" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CompassIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Discover</span>
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
