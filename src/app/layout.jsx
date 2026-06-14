import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair' 
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

export const metadata = {
  title: 'Sri Lanka Women\'s Trip',
  description: 'Companion app for the Sri Lanka Women\'s Trip 2026',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sri Lanka Trip',
  },
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon512_maskable.png" />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-stone-50 text-teal-900`}>
        {children}
      </body>
    </html>
  );
}
