import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  createSessionCookie, 
  verifySessionCookie, 
  syncUserRole, 
  auth 
} from '../../../../lib/firebase-admin.js';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

/**
 * POST /api/auth/session
 * Creates an HTTP-only session cookie after verifying the client-side ID Token,
 * and ensures the user's custom claims are synchronized with their Firestore role.
 */
export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // 1. Verify the ID Token to get the user's UID
    const decodedIdToken = await auth.verifyIdToken(idToken);
    const uid = decodedIdToken.uid;

    // 2. Sync Firestore role with Auth Custom Claims before issuing the session cookie.
    // This ensures the first session cookie issued already has the correct custom claim!
    const { activeRole } = await syncUserRole(uid);

    // 3. Create the session cookie
    const sessionCookie = await createSessionCookie(idToken, SESSION_EXPIRY);

    // 4. Set the HTTP-only cookie on the response
    const response = NextResponse.json({ 
      status: 'success', 
      role: activeRole,
      uid 
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: SESSION_EXPIRY / 1000, // in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Session API Error during Login:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Destroys the active session cookie and revokes the session in Firebase Auth.
 */
export async function DELETE() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const response = NextResponse.json({ status: 'logged_out' });
    
    // Clear the session cookie immediately
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      maxAge: 0,
      path: '/'
    });

    if (sessionCookie) {
      try {
        // Verify the cookie to retrieve UID and revoke the session on Firebase server
        const decodedToken = await verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decodedToken.sub);
      } catch (err) {
        // If the cookie was already expired or invalid, we ignore and proceed with logout
        console.warn('Could not revoke refresh tokens on logout (cookie may have been invalid/expired)');
      }
    }

    return response;

  } catch (error) {
    console.error('Session API Error during Logout:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message }, 
      { status: 500 }
    );
  }
}
