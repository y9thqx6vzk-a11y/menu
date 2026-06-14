import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-brand-dark text-stone-100 font-sans flex items-center justify-center p-6 selection:bg-brand-orange/20 relative overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[60%] rounded-full bg-brand-teal/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[60%] rounded-full bg-brand-amber/10 blur-[120px] pointer-events-none z-0" />

      {/* Main glass card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Logo / Branding */}
        <div className="text-center space-y-2">
          <span className="text-3xl animate-float inline-block">🌿</span>
          <h1 className="text-2xl font-serif font-bold tracking-wider text-white">Savtot Travel Club</h1>
          <p className="text-xs text-stone-400">Enter credentials to unlock your companion app</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-stone-500 focus:outline-none focus:border-brand-amber focus:bg-white/[0.08] transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Security Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-stone-500 focus:outline-none focus:border-brand-amber focus:bg-white/[0.08] transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Link 
              href="/live"
              className="block w-full bg-gradient-to-r from-brand-orange to-brand-amber hover:from-brand-orange/95 hover:to-brand-amber/95 text-white py-3.5 rounded-xl font-bold text-xs shadow-md active:scale-[0.98] transition-all text-center border border-white/10"
            >
              Sign In
            </Link>
          </div>
        </form>

        {/* Footnote */}
        <div className="pt-4 border-t border-white/5 text-center space-y-2">
          <p className="text-[10px] text-stone-500 leading-normal">
            Bypassed during developer evaluation mode. Feel free to click "Sign In" directly to access the dashboard.
          </p>
          <Link href="/" className="inline-block text-[10px] text-brand-teal hover:text-brand-orange transition-colors font-bold uppercase tracking-wider">
            ← Back to Welcome Screen
          </Link>
        </div>

      </div>
    </div>
  );
}
