import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  verifySessionCookie, 
  syncUserRole, 
  createSessionCookie,
  auth
} from '../../../../lib/firebase-admin.js';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

/**
 * POST /api/auth/sync
 * Verifies the user's current session cookie, checks their role in Firestore,
 * and if it has changed, updates their custom claims and re-issues a fresh session cookie.
 */
export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    // 1. Verify the current session cookie
    let decodedToken;
    try {
      decodedToken = await verifySessionCookie(sessionCookie);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // 2. Synchronize Custom Claims with Firestore record
    const { claimsUpdated, activeRole } = await syncUserRole(uid);

    const response = NextResponse.json({
      status: 'success',
      synced: claimsUpdated,
      role: activeRole
    });

    // 3. If claims were updated, we must issue a new session cookie to embed the updated claims!
    if (claimsUpdated) {
      // Create a fresh ID token using the Admin SDK's createCustomToken helper
      // client-side refresh is normally preferred, but we can issue a new session cookie directly:
      // To issue a session cookie, we need an ID token. Since the server does not have the user's password/credentials
      // to sign in and get a raw client ID token, we can instruct the client to refresh its token.
      // Alternatively, we can let the client know that "synced: true" and it should re-exchange its refreshed ID token.
      // Let's return "synced: true, action: 'REFRESH_REQUIRED'" so the client-side auth context can perform
      // user.getIdToken(true) and POST to `/api/auth/session` to get a fresh cookie.
      // This is the cleanest and most robust flow! Let's specify that.
      
      return NextResponse.json({
        status: 'sync_required',
        synced: true,
        role: activeRole,
        message: 'Claims updated in Firebase Auth. Client must refresh ID token and call session endpoint.'
      });
    }

    return response;

  } catch (error) {
    console.error('Session sync error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message }, 
      { status: 500 }
    );
  }
}
