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

const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Pre-populated default memories
const DEFAULT_MEMORIES = [
  {
    id: 'def-1',
    author: 'Shani',
    caption: 'Rising above the jungle canopy at sunrise on Sigiriya Rock! 🌄🧗‍♀️',
    imageUrl: 'https://res.cloudinary.com/dsgvsqnjp/image/upload/f_auto,q_auto,w_600,c_fill/sigiriya_view',
    date: 'August 31, 2026',
    rotation: 'rotate-1'
  },
  {
    id: 'def-2',
    author: 'Adi',
    caption: 'Beautiful Shabbat preparations by the white sands of Pasikudah Bay. 🕯️🌊',
    imageUrl: 'https://res.cloudinary.com/dsgvsqnjp/image/upload/f_auto,q_auto,w_600,c_fill/pasikudah_shabbat',
    date: 'September 4, 2026',
    rotation: '-rotate-1'
  }
];

export default function MemoriesPage() {
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [author, setAuthor] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load custom memories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sri_lanka_custom_memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMemories([...parsed, ...DEFAULT_MEMORIES]);
      } catch (e) {
        console.error('Failed to parse memories', e);
      }
    }
  }, []);

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Memory
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author || !caption || !imagePreview) return;

    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const newMemory = {
      id: `custom-${Date.now()}`,
      author,
      caption,
      imageUrl: imagePreview,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rotation: randomRotation
    };

    const updatedCustom = [newMemory, ...memories.filter(m => m.id.startsWith('custom-'))];
    localStorage.setItem('sri_lanka_custom_memories', JSON.stringify(updatedCustom));
    
    setMemories([newMemory, ...memories]);
    setAuthor('');
    setCaption('');
    setImageFile(null);
    setImagePreview('');
    setIsFormOpen(false);
  };

  return (
    <div className="w-full h-screen bg-brand-dark/95 text-stone-800 flex justify-center selection:bg-brand-orange/20 relative overflow-hidden">
      {/* Decorative desktop ambient blurs */}
      <div className="absolute top-[-20%] left-[-30%] w-[80%] h-[60%] rounded-full bg-brand-teal/10 blur-[150px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-[-20%] right-[-30%] w-[80%] h-[60%] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-0 hidden md:block" />

      {/* Main app container shell */}
      <main className="w-full max-w-md h-full bg-brand-sand shadow-2xl relative flex flex-col z-10 border-x border-stone-200/40 overflow-hidden">
        
        {/* Header Cover Banner */}
        <div className="relative h-44 bg-brand-dark flex items-end p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-brand-teal/20 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 text-white w-full flex justify-between items-end">
            <div>
              <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-orange mb-1">Live Feed</h1>
              <h2 className="text-3xl font-serif font-bold text-white leading-tight">Shared Journal</h2>
            </div>
            
            {/* Float Add Memory button */}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-brand-orange hover:bg-brand-orange/95 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform shrink-0"
              aria-label="Add new memory"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Memory Slide-Down Drawer Form */}
        {isFormOpen && (
          <div className="px-5 pt-5 pb-6 border-b border-stone-200/50 bg-white space-y-4 animate-fade-in shadow-inner">
            <h3 className="font-serif font-bold text-lg text-brand-dark">Capture a Moment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Shani"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Caption / Quote</label>
                  <textarea
                    required
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe the moment..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-teal resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Select Photo</label>
                  <div className="flex items-center space-x-4">
                    <label className="bg-stone-100 hover:bg-stone-200 border border-stone-300/60 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="w-12 h-12 rounded-lg border border-stone-200 overflow-hidden shrink-0 shadow-sm">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-dark text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-98 transition-all"
                >
                  Post Memory 🚀
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Polaroid memories grid */}
        <div className="px-6 pt-6 pb-28 space-y-8 flex-1 overflow-y-auto scrollbar-thin">
          {memories.map((memory) => (
            <div 
              key={memory.id}
              className={`bg-white p-4 pb-6 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.08)] border border-stone-200/30 mx-auto max-w-[290px] transition-transform duration-300 hover:scale-102 hover:rotate-0 ${memory.rotation}`}
            >
              {/* Image Frame */}
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative border border-stone-100 rounded-sm mb-4">
                <img 
                  src={memory.imageUrl} 
                  alt={memory.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption details */}
              <div className="space-y-1">
                <p className="font-serif italic text-sm text-stone-800 leading-relaxed font-medium">
                  "{memory.caption}"
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-sans tracking-wide">
                  <span className="font-bold text-brand-teal uppercase">By {memory.author}</span>
                  <span>{memory.date}</span>
                </div>
              </div>
            </div>
          ))}
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

          <Link href="/live" className="flex flex-col items-center space-y-1 text-stone-400 hover:text-brand-orange transition-colors">
            <CalendarIcon />
            <span className="text-[9px] font-bold tracking-wide uppercase">Live Trip</span>
          </Link>

          <Link href="/memories" className="flex flex-col items-center space-y-1 text-brand-orange transition-colors relative">
            <CameraIcon />
            <span className="text-[9px] font-extrabold tracking-wide uppercase">Memories</span>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-brand-orange rounded-full" />
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
