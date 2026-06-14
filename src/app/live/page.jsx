'use client';

import React, { useState, useEffect, useRef } from 'react';
import itineraryData from '../../data/itinerary.json';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary.js';
import SosModal from '../../components/SosModal.jsx';
import OfflineBanner from '../../components/OfflineBanner.jsx';

/**
 * Mobile-First Live Trip Dashboard Component.
 * Styled to feel like a native mobile app for travelers on the ground in Sri Lanka.
 */
export default function LiveDashboard() {
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isCulinaryOpen, setIsCulinaryOpen] = useState(false);
  const dayTabScrollRef = useRef(null);

  // 1. Calculate active trip day based on current date (Aug 30 - Sep 8, 2026)
  useEffect(() => {
    const calculateCurrentTripDay = () => {
      const now = new Date();
      const start = new Date(itineraryData.startDate);
      const end = new Date(itineraryData.endDate);

      // If we are currently within the trip dates
      if (now >= start && now <= end) {
        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Math.min(Math.max(diffDays, 1), itineraryData.days.length);
      }
      
      // Default to Day 1 if outside dates (e.g. testing or viewing ahead)
      return 1;
    };

    const currentDay = calculateCurrentTripDay();
    setSelectedDayNum(currentDay);
  }, []);

  // 2. Scroll the selected day button into view inside the horizontal header list
  useEffect(() => {
    if (dayTabScrollRef.current) {
      const selectedButton = dayTabScrollRef.current.querySelector(`[data-day="${selectedDayNum}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedDayNum]);

  // Extract selected day configuration
  const currentDayData = itineraryData.days.find(d => d.dayNumber === selectedDayNum) || itineraryData.days[0];

  // Map dates to friendly display strings
  const getFriendlyDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex justify-center selection:bg-teal-100">
      
      {/* Device frame container: centers and scales layout like a native phone screen */}
      <main className="w-full max-w-md min-h-screen bg-white shadow-xl relative flex flex-col pb-24 border-x border-slate-100 overflow-hidden">
        
        {/* Offline Connection Status Indicator Banner */}
        <OfflineBanner />

        {/* 1. Hero Cover Header */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-200">
          {currentDayData.imageUrl && (
            <img 
              src={getOptimizedCloudinaryUrl(currentDayData.imageUrl, 600)} 
              alt={currentDayData.title}
              className="w-full h-full object-cover transition-all duration-500 transform scale-105"
              loading="eager"
            />
          )}
          {/* Rich overlay gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          {/* Top Header Label */}
          <div className="absolute top-6 left-5 right-5 flex justify-between items-center text-white z-10">
            <span className="text-xs font-bold tracking-widest uppercase bg-teal-600/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
              📍 {currentDayData.location}
            </span>
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              Sri Lanka Live
            </span>
          </div>

          {/* Title and Day Counter Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h1 className="text-xs font-extrabold uppercase tracking-widest text-teal-300">
              Day {currentDayData.dayNumber} of {itineraryData.days.length} • {getFriendlyDateString(currentDayData.date)}
            </h1>
            <h2 className="text-xl font-bold leading-tight mt-1 text-white">
              {currentDayData.title}
            </h2>
          </div>
        </div>

        {/* 2. Interactive Horizontal Day Selector Tab Row */}
        <div 
          ref={dayTabScrollRef}
          className="flex overflow-x-auto scrollbar-none space-x-2.5 px-5 py-4 bg-slate-50 border-b border-slate-100 sticky top-0 z-20 shadow-sm"
        >
          {itineraryData.days.map((day) => {
            const isActive = day.dayNumber === selectedDayNum;
            return (
              <button
                key={day.dayNumber}
                data-day={day.dayNumber}
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-100 active:scale-95'
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>

        {/* Dashboard Main Content Body */}
        <div className="px-5 py-5 space-y-5 flex-1 overflow-y-auto">
          
          {/* A. Hotel Accommodation Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-start space-x-3.5">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Overnight Hotel</span>
              <h3 className="font-bold text-slate-800 leading-tight mt-0.5">{currentDayData.hotel}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <span className="mr-1">📍</span> {currentDayData.location}
              </p>
            </div>
          </div>

          {/* B. Meal Inclusions Badge Row */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Meals Included Today</h4>
            <div className="flex flex-wrap gap-2">
              {currentDayData.meals.map((meal) => {
                let badgeColor = 'bg-teal-50 text-teal-700 border-teal-100';
                if (meal === 'Breakfast') badgeColor = 'bg-orange-50 text-orange-700 border-orange-100';
                if (meal === 'Lunch') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
                if (meal === 'Dinner') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                return (
                  <span 
                    key={meal} 
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${badgeColor}`}
                  >
                    🍽️ {meal}
                  </span>
                );
              })}
            </div>
          </div>

          {/* C. Smart Reminders Widget */}
          <div className="bg-gradient-to-tr from-teal-50/50 to-teal-50/10 rounded-2xl p-4 border border-teal-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <h3 className="text-xs font-extrabold text-teal-800 tracking-wider uppercase flex items-center space-x-2">
              <span>🛡️</span>
              <span>Smart Packing & Culture Reminders</span>
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed">
              {/* Clothing Rule */}
              <div className="flex space-x-3 items-start">
                <span className="text-sm mt-0.5">👗</span>
                <div>
                  <h4 className="font-bold text-slate-800">Clothing & Dress Code</h4>
                  <p className="text-slate-600 mt-0.5">
                    {currentDayData.reminders.clothing}
                  </p>
                </div>
              </div>
              
              {/* Footwear Rule */}
              <div className="flex space-x-3 items-start border-t border-teal-100/30 pt-3">
                <span className="text-sm mt-0.5">👟</span>
                <div>
                  <h4 className="font-bold text-slate-800">Recommended Footwear</h4>
                  <p className="text-slate-600 mt-0.5">
                    {currentDayData.reminders.footwear}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* E. Culinary Menu Expandable Widget */}
          {currentDayData.culinary && (
            <div className="bg-white rounded-2xl border border-amber-200/70 shadow-[0_3px_12px_rgba(217,119,6,0.04)] overflow-hidden">
              <button
                onClick={() => setIsCulinaryOpen(!isCulinaryOpen)}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-50 to-amber-50/20 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-amber-800 border-b border-amber-100"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🍽️</span>
                  <span>Today's Gastronomic Menu</span>
                </div>
                <span className="text-base text-amber-600 transform transition-transform duration-200">
                  {isCulinaryOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isCulinaryOpen && (
                <div className="p-4 space-y-4 animate-fade-in">
                  <p className="text-xs italic text-slate-500 leading-normal border-l-2 border-amber-300 pl-3">
                    {currentDayData.culinary.concept}
                  </p>
                  
                  {currentDayData.culinary.meals.map((mealItem, mIndex) => (
                    <div key={mIndex} className="space-y-3 pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                      <h4 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-1 flex items-center">
                        <span className="mr-1.5">🌟</span> {mealItem.type}
                      </h4>
                      
                      <div className="space-y-3">
                        {mealItem.sections.map((sec, sIndex) => (
                          <div key={sIndex} className="space-y-1.5">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{sec.name}</h5>
                            <ul className="space-y-1 text-xs text-slate-600 pl-1 list-none">
                              {sec.items.map((item, iIndex) => {
                                const splitItem = item.split(':');
                                return (
                                  <li key={iIndex} className="leading-relaxed pl-2.5 relative">
                                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                    {splitItem.length > 1 ? (
                                      <>
                                        <strong className="text-slate-800">{splitItem[0]}:</strong>
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

          {/* D. Vertical Timeline Section */}
          <div className="space-y-3.5 pt-1">
            <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase flex items-center space-x-2">
              <span>🕒</span>
              <span>Today's Timeline</span>
            </h3>

            {/* Vertical timeline line container */}
            <div className="relative border-l-2 border-slate-100 ml-3.5 pl-6 space-y-7 py-1">
              {currentDayData.timeline.map((item, index) => {
                const isFirst = index === 0;
                
                return (
                  <div key={index} className="relative group">
                    {/* Timeline Node Bullet */}
                    <span className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-300 ${
                      isFirst 
                        ? 'border-teal-600 scale-110 ring-4 ring-teal-50' 
                        : 'border-slate-300 group-hover:border-teal-500'
                    }`} />
                    
                    {/* Event details */}
                    <div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isFirst 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.time}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-normal mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 5. SOS Emergency Floating Red Action Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="fixed bottom-24 right-6 md:right-[calc(50vw-220px+24px)] z-40 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-red-600/30 transition-transform active:scale-90 flex items-center justify-center animate-bounce"
          aria-label="Trigger SOS Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </button>

        {/* 6. Sticky Mobile Bottom Navigation Dock */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around py-3.5 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          {/* Essentials Tab */}
          <a href="/essentials" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-teal-600 transition-colors">
            <span className="text-lg">🎒</span>
            <span className="text-[10px] font-bold">Essentials</span>
          </a>

          {/* Discover Tab */}
          <a href="/discovery" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-teal-600 transition-colors">
            <span className="text-lg">🧭</span>
            <span className="text-[10px] font-bold">Discover</span>
          </a>

          {/* Live Tab (Active) */}
          <a href="/live" className="flex flex-col items-center space-y-1 text-teal-600 transition-colors">
            <span className="text-lg">📅</span>
            <span className="text-[10px] font-extrabold">Live Trip</span>
          </a>

          {/* Memories Tab */}
          <a href="/memories" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-teal-600 transition-colors">
            <span className="text-lg">📸</span>
            <span className="text-[10px] font-bold">Memories</span>
          </a>
        </nav>

        {/* SOS Dialog Modal overlay */}
        <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      </main>
      
      {/* Hide horizontal scrollbars and culinary animations */}
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
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
