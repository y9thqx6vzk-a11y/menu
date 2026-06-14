import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Sri Lanka Trip Portal</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        This is the companion app for our 10-day journey. If you are already logged in and on the trip, you can head directly to the live dashboard.
      </p>
      
      <Link 
        href="/live" 
        className="bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition"
      >
        Go to Live Dashboard
      </Link>
    </div>
  );
}
