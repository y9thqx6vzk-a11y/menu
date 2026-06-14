import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Trip</h1>
        
        <p className="text-gray-600 mb-6 text-center text-sm">
          Welcome to the Sri Lanka Women's Trip. Please log in to access your itinerary, packing list, and daily schedule.
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="button" 
            className="mt-4 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          * This is a demo login page. In a real app, this would connect to Firebase Auth and set the `__session` cookie.
        </div>
      </div>
    </div>
  );
}
