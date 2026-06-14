import admin from 'firebase-admin';

// Safely parse service account private key (replacing escaped newlines if passed via single-line environment variable)
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : null;

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * Handles both environment-based service account configuration and local emulation/default credentials.
 */
function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  // 1. If explicit credentials are provided in env, use them
  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  // 2. Otherwise, check if a full service account JSON string is available
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', err);
    }
  }

  // 3. Fallback: Initialize using Application Default Credentials (e.g. running on Google Cloud/Vercel with integrations)
  // or using the FIREBASE_AUTH_EMULATOR_HOST / FIRESTORE_EMULATOR_HOST configuration.
  return admin.initializeApp();
}

// Ensure Admin SDK is initialized
initAdmin();

const auth = admin.auth();
const db = admin.firestore();

/**
 * Creates a Firebase session cookie from an ID token.
 * 
 * @param {string} idToken - The client-side ID token
 * @param {number} expiresIn - Expiration duration in milliseconds (e.g. 5 days)
 * @returns {Promise<string>} The generated session cookie
 */
export async function createSessionCookie(idToken, expiresIn = 60 * 60 * 24 * 5 * 1000) {
  try {
    return await auth.createSessionCookie(idToken, { expiresIn });
  } catch (error) {
    console.error('Error creating Firebase session cookie:', error);
    throw error;
  }
}

/**
 * Verifies a Firebase session cookie.
 * 
 * @param {string} sessionCookie - The active session cookie
 * @param {boolean} checkRevoked - Verify whether the cookie has been revoked
 * @returns {Promise<admin.auth.DecodedIdToken>} Verified decoded token
 */
export async function verifySessionCookie(sessionCookie, checkRevoked = false) {
  try {
    return await auth.verifySessionCookie(sessionCookie, checkRevoked);
  } catch (error) {
    console.error('Error verifying Firebase session cookie:', error);
    throw error;
  }
}

/**
 * Sets a custom role claim on a Firebase User.
 * 
 * @param {string} uid - The user's UID
 * @param {'PRE_TRIP' | 'ACTIVE_TRIP' | 'ALUMNA'} role - The traveler role to assign
 */
export async function setUserRoleClaim(uid, role) {
  try {
    // We set the role inside custom claims. This is packed into the user's JWT.
    await auth.setCustomUserClaims(uid, { role });
  } catch (error) {
    console.error(`Error setting custom role claim for user ${uid}:`, error);
    throw error;
  }
}

/**
 * Fetches the user's profile document from Firestore.
 * 
 * @param {string} uid - The user's UID
 * @returns {Promise<Record<string, any> | null>} The Firestore user data or null
 */
export async function getUserFirestoreData(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error(`Error fetching Firestore data for user ${uid}:`, error);
    throw error;
  }
}

/**
 * Syncs the user's custom claim role with their Firestore record role.
 * If they differ, the Firestore record takes precedence, and the claim is updated.
 * 
 * @param {string} uid - The user's UID
 * @returns {Promise<{ claimsUpdated: boolean, activeRole: string }>} Sync result
 */
export async function syncUserRole(uid) {
  try {
    // 1. Get current Firestore data
    const userData = await getUserFirestoreData(uid);
    const firestoreRole = userData?.role || 'PRE_TRIP'; // default to PRE_TRIP if not in DB

    // 2. Get current Auth claims
    const userRecord = await auth.getUser(uid);
    const authRole = userRecord.customClaims?.role;

    // 3. Update claim if it's out of sync
    if (authRole !== firestoreRole) {
      await setUserRoleClaim(uid, firestoreRole);
      return { claimsUpdated: true, activeRole: firestoreRole };
    }

    return { claimsUpdated: false, activeRole: authRole || 'PRE_TRIP' };
  } catch (error) {
    console.error(`Error syncing user role for ${uid}:`, error);
    throw error;
  }
}

export { auth, db };
