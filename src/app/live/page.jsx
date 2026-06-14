'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import itineraryData from '../../data/itinerary.json';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary.js';
import OfflineBanner from '../../components/OfflineBanner.jsx';

// Premium SVG Icons
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const HotelIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const UtensilsIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a9.003 9.003 0 0 0-6-6.083m6 6.083H6M6 18.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-.94 3.198-.002.031c0 .225.012.447.037.666A11.944 11.944 0 0 0 12 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0 0 18 18.719m-12 0a9.003 9.003 0 0 1 6-6.083m-6 6.083h12m-6-6.083v-1.125m0-3.375a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75Z" />
  </svg>
);

const ShirtIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h3a2.25 2.25 0 0 1 2.25 2.25V9M3 9h18m-18 0v10.5A2.25 2.25 0 0 0 5.25 21.75h13.5A2.25 2.25 0 0 0 21 19.5V9m-18 0h18" />
  </svg>
);

const FootwearIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.916 2.25a2.44 2.44 0 0 0-3.277-.077l-5.903 5.17A1.242 1.242 0 0 0 11.25 8.3v1.642c0 .324-.124.636-.347.87L9.435 12.3a1.242 1.242 0 0 0-.347.87v2.83h7.5c.34 0 .67-.066.976-.196l4.238-1.802A2.438 2.438 0 0 0 21.75 14.2V4.5c0-.858-.45-1.657-1.183-2.1a2.44 2.44 0 0 0-.65-.15Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.088 16H3v2.5A2.25 2.25 0 0 0 5.25 20.75h13.5A2.25 2.25 0 0 0 21 18.5V16h-4.25c-.443 0-.877.065-1.29.196L12.5 17.5l-3.412-1.5Z" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904ZM18 5.25l-.457 2.228-2.228.457 2.228.457.457 2.228.457-2.228 2.228-.457-2.228-.457L18 5.25ZM20.25 10.5l-.343 1.671-1.671.343 1.671.343.343 1.671.343-1.671 1.671-.343-1.671-.343-.343-1.671Z" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

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

export default function LiveDashboard() {
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [isCulinaryOpen, setIsCulinaryOpen] = useState(false);
  const dayTabScrollRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const calculateCurrentTripDay = () => {
      const now = new Date();
      const start = new Date(itineraryData.startDate);
      const end = new Date(itineraryData.endDate);
      if (now >= start && now <= end) {
        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Math.min(Math.max(diffDays, 1), itineraryData.days.length);
      }
      return 1;
    };
    setSelectedDayNum(calculateCurrentTripDay());
  }, []);

  useEffect(() => {
    if (dayTabScrollRef.current) {
      const selectedButton = dayTabScrollRef.current.querySelector(`[data-day="${selectedDayNum}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDayNum]);

  const currentDayData = itineraryData.days.find(d => d.dayNumber === selectedDayNum) || itineraryData.days[0];

  const getFriendlyDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full h-screen bg-brand-dark/95 text-stone-800 flex justify-center selection:bg-brand-orange/20 relative overflow-hidden">
      {/* Decorative desktop ambient blurs */}
      <div className="absolute top-[-20%] left-[-30%] w-[80%] h-[60%] rounded-full bg-brand-teal/10 blur-[150px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-[-20%] right-[-30%] w-[80%] h-[60%] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-0 hidden md:block" />

      {/* Main app container shell (simulating a mobile screen on desktop) */}
      <main className="w-full max-w-md h-full bg-brand-sand shadow-2xl relative flex flex-col z-10 border-x border-stone-200/40 overflow-hidden">
        
        <OfflineBanner />

        {/* Scrollable Container (covers the entire main area except the bottom nav) */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin pb-24"
        >
          {/* Cover Header */}
          <div className="relative h-64 bg-stone-900 overflow-hidden shrink-0">
            {currentDayData.imageUrl && (
              <img 
                src={getOptimizedCloudinaryUrl(currentDayData.imageUrl, 600)} 
                alt={currentDayData.title}
                className="w-full h-full object-cover transition-all duration-700 transform scale-105"
              />
            )}
            {/* Cover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent opacity-90" />
            
            {/* Header Top elements */}
            <div className="absolute top-4 left-5 right-5 flex justify-between items-center z-10">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-brand-orange flex items-center gap-1.5 shadow-sm">
                <MapPinIcon className="w-3.5 h-3.5" />
                <span>{currentDayData.location}</span>
              </span>
              <span className="text-[9px] font-bold tracking-wider uppercase bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-stone-300">
                Trip Live
              </span>
            </div>

            {/* Header Title elements */}
            <div className="absolute left-5 right-5 bottom-5 text-white">
              <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange mb-1.5 drop-shadow">
                Day {currentDayData.dayNumber} of {itineraryData.days.length} • {getFriendlyDateString(currentDayData.date)}
              </h1>
              <h2 className="text-2xl font-serif font-bold leading-tight text-white drop-shadow-md">
                {currentDayData.title}
              </h2>
            </div>
          </div>

          {/* Sticky Day Selector Pill Row */}
          <div 
            ref={dayTabScrollRef}
            className="flex overflow-x-auto scrollbar-none space-x-2 px-5 py-3.5 bg-brand-sand/95 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-20 shadow-sm"
          >
            {itineraryData.days.map((day) => {
              const isActive = day.dayNumber === selectedDayNum;
              return (
                <button
                  key={day.dayNumber}
                  data-day={day.dayNumber}
                  onClick={() => setSelectedDayNum(day.dayNumber)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-orange to-brand-amber text-white shadow-md shadow-brand-orange/20 scale-105'
                      : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  Day {day.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Dashboard Main Content Body */}
          <div className="px-5 py-6 space-y-6">
          
          {/* Hotel Accommodation Card */}
          <div className="bg-white rounded-[1.25rem] p-5 border border-stone-200/40 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-brand-sand text-brand-orange rounded-xl shadow-sm border border-stone-200/40 shrink-0">
              <HotelIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Overnight Hotel</span>
              <h3 className="font-serif font-bold text-base text-brand-dark leading-tight mt-1 truncate">{currentDayData.hotel}</h3>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{currentDayData.location}</span>
              </p>
            </div>
          </div>

          {/* Meal Inclusions Badge Row */}
          <div className="bg-white rounded-[1.25rem] p-5 border border-stone-200/40 shadow-sm space-y-3.5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Meals Included Today</h4>
            <div className="flex flex-wrap gap-2">
              {currentDayData.meals.map((meal) => {
                return (
                  <span 
                    key={meal} 
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-stone-50 text-stone-700 border-stone-200/85 flex items-center gap-1.5"
                  >
                    <UtensilsIcon className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{meal}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Smart Reminders Widget (Jungle Luxury Styled Card) */}
          <div className="bg-brand-dark rounded-[1.5rem] p-6 shadow-xl space-y-5 relative overflow-hidden border border-brand-teal/20">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-brand-teal/15 to-brand-amber/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-stone-300 tracking-[0.15em] uppercase flex items-center space-x-2 relative z-10">
              <SparklesIcon className="text-brand-amber w-4 h-4" />
              <span>Smart Reminders</span>
            </h3>
            
            <div className="space-y-4 text-xs leading-relaxed relative z-10 text-stone-300">
              <div className="flex space-x-3.5 items-start">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-brand-amber shrink-0">
                  <ShirtIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Dress Code</h4>
                  <p className="opacity-80 mt-1 leading-normal">
                    {currentDayData.reminders.clothing}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3.5 items-start border-t border-white/5 pt-4">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-brand-teal shrink-0">
                  <FootwearIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Recommended Footwear</h4>
                  <p className="opacity-80 mt-1 leading-normal">
                    {currentDayData.reminders.footwear}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Culinary Menu Expandable Widget */}
          {currentDayData.culinary && (
            <div className="bg-white rounded-[1.25rem] border border-stone-200/40 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsCulinaryOpen(!isCulinaryOpen)}
                className="w-full px-5 py-4 bg-stone-50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-[0.15em] text-stone-700 border-b border-stone-200/50"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">🍽️</span>
                  <span>Today's Culinary Menu</span>
                </div>
                <ChevronIcon className="text-stone-400 w-4 h-4" direction={isCulinaryOpen ? 'up' : 'down'} />
              </button>
              
              {isCulinaryOpen && (
                <div className="p-5 space-y-6 animate-fade-in bg-white">
                  <p className="text-xs italic text-stone-500 leading-relaxed border-l-2 border-brand-orange/40 pl-3.5">
                    {currentDayData.culinary.concept}
                  </p>
                  
                  {currentDayData.culinary.meals.map((mealItem, mIndex) => (
                    <div key={mIndex} className="space-y-4 pt-4 border-t border-stone-100 first:border-0 first:pt-0">
                      <h4 className="text-xs font-bold tracking-[0.1em] text-brand-dark uppercase border-b border-stone-100 pb-2 flex items-center">
                        <span className="mr-2 text-brand-orange">✦</span> {mealItem.type}
                      </h4>
                      
                      <div className="space-y-4">
                        {mealItem.sections.map((sec, sIndex) => (
                          <div key={sIndex} className="space-y-2">
                            <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-teal">{sec.name}</h5>
                            <ul className="space-y-2 text-xs text-stone-600 pl-1 list-none">
                              {sec.items.map((item, iIndex) => {
                                const splitItem = item.split(':');
                                return (
                                  <li key={iIndex} className="leading-relaxed pl-3.5 relative">
                                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-brand-orange/50 rounded-full" />
                                    {splitItem.length > 1 ? (
                                      <>
                                        <strong className="text-stone-800 font-semibold">{splitItem[0]}:</strong>
                                        <span className="text-stone-600">{splitItem.slice(1).join(':')}</span>
                                      </>
                                    ) : (
                                      item
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vertical Timeline Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-stone-400 tracking-[0.25em] uppercase flex items-center space-x-2">
              <ClockIcon className="text-stone-400" />
              <span>Today's Timeline</span>
            </h3>

            <div className="relative border-l border-stone-200/80 ml-3.5 pl-6 space-y-7 py-2">
              {currentDayData.timeline.map((item, index) => {
                const isFirst = index === 0;
                
                return (
                  <div key={index} className="relative group">
                    {/* Timeline Node Bullet */}
                    <span className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border bg-brand-sand transition-all duration-300 ${
                      isFirst 
                        ? 'border-brand-orange ring-4 ring-brand-orange/15 bg-brand-orange' 
                        : 'border-stone-300 group-hover:border-brand-orange'
                    }`} />
                    
                    {/* Event details */}
                    <div className="space-y-2">
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${
                        isFirst 
                          ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' 
                          : 'bg-stone-200/70 text-stone-600 border border-stone-300/40'
                      }`}>
                        {item.time}
                      </span>
                      <h4 className="font-serif font-bold text-base text-brand-dark leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>



        {/* Sticky Mobile Bottom Navigation Dock */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-200/50 flex justify-around py-3 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
          <Link href="/essentials" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <BackpackIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Essentials</span>
          </Link>

          <Link href="/discovery" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CompassIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Discover</span>
          </Link>

          <Link href="/live" className="flex flex-col items-center space-y-1 text-brand-orange transition-colors relative">
            <CalendarIcon />
            <span className="text-[9px] font-extrabold tracking-wide uppercase">Live Trip</span>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-brand-orange rounded-full" />
          </Link>

          <Link href="/memories" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CameraIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Memories</span>
          </Link>
        </nav>



      </main>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
