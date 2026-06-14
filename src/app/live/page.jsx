'use client';

import React, { useState, useEffect, useRef } from 'react';
import itineraryData from '../../data/itinerary.json';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary.js';
import SosModal from '../../components/SosModal.jsx';
import OfflineBanner from '../../components/OfflineBanner.jsx';

export default function LiveDashboard() {
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isCulinaryOpen, setIsCulinaryOpen] = useState(false);
  const dayTabScrollRef = useRef(null);

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
    <div className="w-full min-h-screen bg-stone-50 text-stone-800 font-sans flex justify-center selection:bg-orange-200">
      
      <main className="w-full max-w-md min-h-screen bg-stone-50 shadow-2xl relative flex flex-col pb-24 overflow-hidden">
        
        <OfflineBanner />

        {/* Hero Cover Header */}
        <div className="relative h-64 w-full overflow-hidden bg-stone-200">
          {currentDayData.imageUrl && (
            <img 
              src={getOptimizedCloudinaryUrl(currentDayData.imageUrl, 600)} 
              alt={currentDayData.title}
              className="w-full h-full object-cover transition-all duration-500 transform scale-105"
            />
          )}
          {/* Deep Teal Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/60 to-transparent" />
          
          <div className="absolute top-6 left-5 right-5 flex justify-between items-center text-white z-10">
            <span className="text-xs font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md text-orange-400">
              📍 {currentDayData.location}
            </span>
            <span className="text-xs font-semibold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white">
              Live Trip
            </span>
          </div>

          <div className="absolute bottom-6 left-5 right-5 text-white">
            <h1 className="text-xs font-extrabold uppercase tracking-widest text-orange-400 mb-2">
              Day {currentDayData.dayNumber} of {itineraryData.days.length} • {getFriendlyDateString(currentDayData.date)}
            </h1>
            <h2 className="text-2xl font-serif font-bold leading-tight mt-1 text-white drop-shadow-md">
              {currentDayData.title}
            </h2>
          </div>
        </div>

        {/* Interactive Horizontal Day Selector Tab Row */}
        <div 
          ref={dayTabScrollRef}
          className="flex overflow-x-auto scrollbar-none space-x-2.5 px-5 py-4 bg-stone-50 border-b border-stone-200 sticky top-0 z-20 shadow-sm"
        >
          {itineraryData.days.map((day) => {
            const isActive = day.dayNumber === selectedDayNum;
            return (
              <button
                key={day.dayNumber}
                data-day={day.dayNumber}
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 active:scale-95'
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>

        {/* Dashboard Main Content Body */}
        <div className="px-5 py-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Hotel Accommodation Card */}
          <div className="bg-white rounded-[1.5rem] p-5 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-start space-x-4">
            <div className="p-3 bg-stone-50 text-orange-500 rounded-2xl shadow-sm border border-stone-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Overnight Hotel</span>
              <h3 className="font-serif font-bold text-lg text-teal-900 leading-tight mt-1">{currentDayData.hotel}</h3>
              <p className="text-xs text-stone-500 mt-1.5 flex items-center">
                <span className="mr-1 text-orange-400">📍</span> {currentDayData.location}
              </p>
            </div>
          </div>

          {/* Meal Inclusions Badge Row */}
          <div className="bg-white rounded-[1.5rem] p-5 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Meals Included Today</h4>
            <div className="flex flex-wrap gap-2">
              {currentDayData.meals.map((meal) => {
                return (
                  <span 
                    key={meal} 
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-stone-50 text-teal-800 border-stone-200"
                  >
                    🍽️ {meal}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Smart Reminders Widget */}
          <div className="bg-teal-900 rounded-[1.5rem] p-5 shadow-lg space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-teal-100 tracking-[0.1em] uppercase flex items-center space-x-2 relative z-10">
              <span className="text-orange-400">🛡️</span>
              <span>Smart Reminders</span>
            </h3>
            
            <div className="space-y-4 text-xs leading-relaxed relative z-10">
              <div className="flex space-x-3 items-start">
                <span className="text-sm mt-0.5">👗</span>
                <div>
                  <h4 className="font-bold text-white font-serif text-sm">Dress Code</h4>
                  <p className="text-teal-100/80 mt-1">
                    {currentDayData.reminders.clothing}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 items-start border-t border-teal-800 pt-4">
                <span className="text-sm mt-0.5">👟</span>
                <div>
                  <h4 className="font-bold text-white font-serif text-sm">Recommended Footwear</h4>
                  <p className="text-teal-100/80 mt-1">
                    {currentDayData.reminders.footwear}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Culinary Menu Expandable Widget */}
          {currentDayData.culinary && (
            <div className="bg-white rounded-[1.5rem] border border-orange-200 shadow-[0_8px_30px_rgba(249,115,22,0.06)] overflow-hidden">
              <button
                onClick={() => setIsCulinaryOpen(!isCulinaryOpen)}
                className="w-full px-5 py-4 bg-orange-50/50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-[0.1em] text-orange-800 border-b border-orange-100"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🍽️</span>
                  <span>Today's Menu</span>
                </div>
                <span className="text-base text-orange-500 transform transition-transform duration-300">
                  {isCulinaryOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isCulinaryOpen && (
                <div className="p-5 space-y-5 animate-fade-in">
                  <p className="text-xs italic text-stone-600 leading-normal border-l-2 border-orange-300 pl-3">
                    {currentDayData.culinary.concept}
                  </p>
                  
                  {currentDayData.culinary.meals.map((mealItem, mIndex) => (
                    <div key={mIndex} className="space-y-4 pt-3 border-t border-stone-100 first:border-0 first:pt-0">
                      <h4 className="text-sm font-serif font-bold text-teal-900 border-b border-stone-100 pb-2 flex items-center">
                        <span className="mr-2">🌟</span> {mealItem.type}
                      </h4>
                      
                      <div className="space-y-4">
                        {mealItem.sections.map((sec, sIndex) => (
                          <div key={sIndex} className="space-y-2">
                            <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600">{sec.name}</h5>
                            <ul className="space-y-1.5 text-xs text-stone-600 pl-1 list-none">
                              {sec.items.map((item, iIndex) => {
                                const splitItem = item.split(':');
                                return (
                                  <li key={iIndex} className="leading-relaxed pl-3 relative">
                                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-orange-300 rounded-full" />
                                    {splitItem.length > 1 ? (
                                      <>
                                        <strong className="text-stone-800 font-semibold">{splitItem[0]}:</strong>
                                        {splitItem.slice(1).join(':')}
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
            <h3 className="text-xs font-bold text-stone-400 tracking-[0.2em] uppercase flex items-center space-x-2">
              <span>🕒</span>
              <span>Today's Timeline</span>
            </h3>

            <div className="relative border-l-2 border-stone-200 ml-4 pl-6 space-y-8 py-2">
              {currentDayData.timeline.map((item, index) => {
                const isFirst = index === 0;
                
                return (
                  <div key={index} className="relative group">
                    {/* Timeline Node Bullet */}
                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-stone-50 transition-all duration-300 ${
                      isFirst 
                        ? 'border-orange-500 scale-110 ring-4 ring-orange-100 bg-white' 
                        : 'border-stone-300 group-hover:border-orange-400'
                    }`} />
                    
                    {/* Event details */}
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${
                        isFirst 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {item.time}
                      </span>
                      <h4 className="font-serif font-bold text-base text-teal-900 mt-2.5 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-sm text-stone-600 leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* SOS Emergency Floating Red Action Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="fixed bottom-24 right-6 md:right-[calc(50vw-220px+24px)] z-40 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-xl hover:shadow-red-600/30 transition-transform active:scale-90 flex items-center justify-center animate-bounce"
          aria-label="Trigger SOS Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </button>

        {/* Sticky Mobile Bottom Navigation Dock */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 flex justify-around py-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <a href="/essentials" className="flex flex-col items-center space-y-1.5 text-stone-400 hover:text-orange-500 transition-colors">
            <span className="text-xl">🎒</span>
            <span className="text-[10px] font-bold tracking-wide">Essentials</span>
          </a>

          <a href="/discovery" className="flex flex-col items-center space-y-1.5 text-stone-400 hover:text-orange-500 transition-colors">
            <span className="text-xl">🧭</span>
            <span className="text-[10px] font-bold tracking-wide">Discover</span>
          </a>

          <a href="/live" className="flex flex-col items-center space-y-1.5 text-orange-500 transition-colors">
            <span className="text-xl">📅</span>
            <span className="text-[10px] font-extrabold tracking-wide">Live Trip</span>
          </a>

          <a href="/memories" className="flex flex-col items-center space-y-1.5 text-stone-400 hover:text-orange-500 transition-colors">
            <span className="text-xl">📸</span>
            <span className="text-[10px] font-bold tracking-wide">Memories</span>
          </a>
        </nav>

        <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      </main>
      
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
