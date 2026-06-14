import { NextResponse } from 'next/server';
import { verifyTokenEdge } from './src/lib/auth-edge.js';

// Firebase Project ID must be defined in your environment variables.
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';

// The cookie name. Note: Firebase Hosting only supports/forwards cookies named "__session".
const SESSION_COOKIE_NAME = '__session';

// Define route categories
const ROUTE_ESSENTIALS = '/essentials';
const ROUTE_DISCOVERY = '/discovery';
const ROUTE_LIVE = '/live';
const ROUTE_MEMORIES = '/memories';
const ROUTE_LOGIN = '/login';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // --- DEV MODE: Bypass authentication ---
  // Temporarily allowing all requests through so the user can view the site without logging in.
  return NextResponse.next();
  // ----------------------------------------
  
  // 1. Exclude public assets, static files, images, and API routes from middleware intercepts
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // static files like favicon.ico, images
    pathname === ROUTE_LOGIN
  ) {
    return NextResponse.next();
  }

  // 2. Retrieve the Firebase session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    // User is not logged in. Protect all pages and redirect to login.
    const loginUrl = new URL(ROUTE_LOGIN, request.url);
    // Include a redirect parameter to return to their intended path after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 3. Verify the token using the Edge-compatible jose helper
    if (!PROJECT_ID) {
      console.error('Middleware Error: Firebase Project ID is not configured in env.');
      return NextResponse.next();
    }

    const decodedToken = await verifyTokenEdge(sessionCookie, PROJECT_ID);
    
    // Extract user role, defaulting to PRE_TRIP if no claim exists yet
    const role = decodedToken.role || 'PRE_TRIP';

    // 4. Implement Role-Based Access Control Redirects
    
    // --- PRE_TRIP ROLE ---
    if (role === 'PRE_TRIP') {
      // Allowed: /essentials, /discovery
      // Blocked: /live, /memories, / (root)
      const isAllowedPath = pathname.startsWith(ROUTE_ESSENTIALS) || pathname.startsWith(ROUTE_DISCOVERY);
      
      if (!isAllowedPath) {
        // Redirect to /essentials (default landing for pre-trip)
        const essentialsUrl = new URL(ROUTE_ESSENTIALS, request.url);
        return NextResponse.redirect(essentialsUrl);
      }
    }

    // --- ACTIVE_TRIP ROLE ---
    else if (role === 'ACTIVE_TRIP') {
      // Allowed: /live, /essentials, /discovery
      // Blocked: /memories, / (root) - root redirects to mobile-optimized /live dashboard
      const isBlockedPath = pathname === '/' || pathname.startsWith(ROUTE_MEMORIES);
      
      if (isBlockedPath) {
        const liveUrl = new URL(ROUTE_LIVE, request.url);
        return NextResponse.redirect(liveUrl);
      }
    }

    // --- ALUMNA ROLE ---
    else if (role === 'ALUMNA') {
      // Allowed: /memories, /essentials, /discovery
      // Blocked: /live, / (root) - automatically redirects to feedback/gallery /memories page
      const isBlockedPath = pathname === '/' || pathname.startsWith(ROUTE_LIVE);
      
      if (isBlockedPath) {
        const memoriesUrl = new URL(ROUTE_MEMORIES, request.url);
        return NextResponse.redirect(memoriesUrl);
      }
    }

    // If the path is permitted for the user's role, proceed normally
    return NextResponse.next();

  } catch (error) {
    // 5. If verification fails (e.g. cookie expired, tampered, or invalid claims), clear session and redirect to login
    console.warn('Middleware: Session verification failed. Redirecting to login.', error.message);
    
    const response = NextResponse.redirect(new URL(ROUTE_LOGIN, request.url));
    // Clear the invalid session cookie
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

// Intercept all application pages that are part of the traveler lifecycle
export const config = {
  matcher: [
    '/',
    '/live/:path*',
    '/essentials/:path*',
    '/discovery/:path*',
    '/memories/:path*',
  ],
};
