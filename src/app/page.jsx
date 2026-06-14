import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark text-stone-100 font-sans selection:bg-brand-orange/30 overflow-hidden relative flex flex-col justify-between">
      {/* Decorative background blur shapes */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] rounded-full bg-brand-teal/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] rounded-full bg-brand-amber/15 blur-[120px] pointer-events-none z-0" />

      {/* Hero Background Image with Premium Multi-layer Overlay */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <img 
          alt="Sri Lanka landscape" 
          className="object-cover w-full h-full scale-105 animate-[pulse_8s_ease-in-out_infinite]"
          src="https://res.cloudinary.com/dsgvsqnjp/image/upload/f_auto,q_auto,w_1920,c_fill/hero_bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
      </div>

      {/* Top Header Branding */}
      <header className="relative z-10 px-6 pt-8 max-w-md mx-auto w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🌿</span>
          <span className="font-serif font-bold text-lg tracking-wider text-stone-200">SAVTOT</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-brand-amber font-semibold bg-brand-amber/10 border border-brand-amber/20 px-3 py-1 rounded-full">
          Summer 2026
        </div>
      </header>

      {/* Center content */}
      <div className="relative z-10 max-w-md mx-auto w-full px-6 flex-1 flex flex-col justify-center py-12">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 shadow-lg self-start">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse-ring relative flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
          </span>
          <span className="text-xs font-medium tracking-wider text-stone-300 font-sans">
            August 30 - September 8
          </span>
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-brand-teal mb-3 font-semibold">
          The Journey of a Lifetime
        </p>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight drop-shadow-md">
          Savtot in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-amber">
            Sri Lanka
          </span>
        </h1>

        <p className="text-sm md:text-base font-light mb-8 text-stone-300 leading-relaxed max-w-sm">
          Welcome to the exclusive companion app for our unforgettable 10-day expedition. Access live itineraries, travel essentials, and capture memories.
        </p>

        {/* Premium Glassmorphic Card Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8 shadow-xl">
          <h3 className="text-xs font-semibold text-brand-amber uppercase tracking-wider mb-3 flex items-center">
            <span className="mr-1.5">🗺️</span> Trip Quick Intel
          </h3>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="opacity-75">Starting point:</span>
              <span className="font-semibold text-white">Colombo (CMB)</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="opacity-75">Destinations:</span>
              <span className="font-semibold text-white">Sigiriya • Ella • Pasikudah</span>
            </li>
            <li className="flex justify-between">
              <span className="opacity-75">Group Lead:</span>
              <span className="font-semibold text-white">Naomi, Eyal & Aliza</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3.5">
          <Link 
            href="/live" 
            className="w-full bg-gradient-to-r from-brand-orange to-brand-amber hover:from-brand-orange/95 hover:to-brand-amber/95 text-white py-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-orange/20 text-center active:scale-[0.98] border border-white/10"
          >
            Enter Live Dashboard
          </Link>
          <Link 
            href="/essentials" 
            className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 py-4 rounded-xl font-semibold text-sm transition-all text-center active:scale-[0.98]"
          >
            View Trip Essentials
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-[10px] text-stone-500 uppercase tracking-widest max-w-md mx-auto w-full border-t border-white/5">
        Designed for Savtot • Private Travel Companion
      </footer>
    </main>
  );
}
