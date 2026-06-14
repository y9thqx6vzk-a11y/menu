import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-teal-200">
      <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl z-10 mb-8">
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img 
              alt="Hero Background" 
              className="object-cover w-full h-full"
              src="https://res.cloudinary.com/dsgvsqnjp/image/upload/f_auto,q_auto,w_1920,c_fill/hero_bg" 
            />
          </div>
          {/* Overlays */}
          <div className="absolute inset-0 bg-teal-900/40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/40 to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 shadow-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wider text-white flex items-center gap-1.5 font-sans">
              August 30 - September 8*
            </span>
          </div>
          
          <p className="text-sm uppercase tracking-[0.4em] mb-4 opacity-80 font-medium">
            The trip of a lifetime
          </p>
          
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 drop-shadow-lg leading-tight">
            Savtot in Sri Lanka<br />Summer 2026
          </h1>
          
          <p className="text-lg md:text-2xl font-light mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Welcome to the companion app for our unforgettable 10-day journey. Access your itinerary, packing lists, and daily schedule right here.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/live" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30">
              Go to Live Dashboard
            </Link>
            <Link href="/essentials" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
              Trip Essentials
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
