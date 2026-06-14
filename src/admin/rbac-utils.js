import { auth, db } from '../lib/firebase-admin.js';

/**
 * Updates a user's role in both Firestore and Firebase Auth Custom Claims.
 * This is the canonical administrative function to change traveler roles.
 * 
 * @param {string} uid - The user's UID
 * @param {'PRE_TRIP' | 'ACTIVE_TRIP' | 'ALUMNA'} role - The new role to assign
 */
export async function setUserRole(uid, role) {
  const validRoles = ['PRE_TRIP', 'ACTIVE_TRIP', 'ALUMNA'];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
  }

  console.log(`Setting role of user ${uid} to: ${role}...`);

  // 1. Update Firestore user document
  const userRef = db.collection('users').doc(uid);
  
  // Use set with merge: true to avoid overwriting existing properties like name/email
  await userRef.set({
    role,
    roleUpdatedAt: new Date().toISOString()
  }, { merge: true });
  console.log(`- Firestore document '/users/${uid}' updated successfully.`);

  // 2. Update Firebase Auth Custom Claims
  await auth.setCustomUserClaims(uid, { role });
  console.log(`- Firebase Auth custom claim { role: "${role}" } set successfully.`);

  console.log(`User ${uid} successfully migrated to ${role}.\n`);
}

/**
 * Batch updates a list of user IDs to a specific role.
 * Useful for transitioning entire tour groups at once.
 * 
 * @param {string[]} uids - Array of user UIDs
 * @param {'PRE_TRIP' | 'ACTIVE_TRIP' | 'ALUMNA'} role - The target role
 */
export async function batchMigrateRoles(uids, role) {
  console.log(`--- Starting Batch Migration for ${uids.length} users to ${role} ---`);
  const results = { success: [], failure: [] };

  for (const uid of uids) {
    try {
      await setUserRole(uid, role);
      results.success.push(uid);
    } catch (error) {
      console.error(`Failed to update user ${uid}:`, error.message);
      results.failure.push({ uid, error: error.message });
    }
  }

  console.log(`--- Migration Finished ---`);
  console.log(`Successful migrations: ${results.success.length}`);
  console.log(`Failed migrations: ${results.failure.length}`);
  return results;
}

/**
 * Example wrapper: Transition travelers to ACTIVE_TRIP at the start of the trip.
 * @param {string[]} uids 
 */
export async function startTripForTravelers(uids) {
  return await batchMigrateRoles(uids, 'ACTIVE_TRIP');
}

/**
 * Example wrapper: Transition travelers to ALUMNA post-trip.
 * This automatically revokes access to the `/live` route.
 * @param {string[]} uids 
 */
export async function endTripForTravelers(uids) {
  return await batchMigrateRoles(uids, 'ALUMNA');
}
