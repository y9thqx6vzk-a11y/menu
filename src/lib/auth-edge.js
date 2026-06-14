import * as jose from 'jose';

// Global cache for Google public certificates to avoid refetching on every request at the Edge.
let keyCache = {
  session: { certs: null, expiresAt: 0 },
  idToken: { certs: null, expiresAt: 0 }
};

const SESSION_CERT_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys';
const ID_TOKEN_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

/**
 * Fetches and caches the Google public certificates.
 * @param {'session' | 'idToken'} type
 * @returns {Promise<Record<string, string>>}
 */
async function getGooglePublicKeys(type) {
  const now = Date.now();
  const cache = keyCache[type];

  if (cache.certs && cache.expiresAt > now) {
    return cache.certs;
  }

  const url = type === 'session' ? SESSION_CERT_URL : ID_TOKEN_CERT_URL;
  const response = await fetch(url, {
    next: { revalidate: 3600 } // Next.js specific caching hint
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google public keys for ${type} verification.`);
  }

  // Handle Cache-Control header to determine actual key expiration
  const cacheControl = response.headers.get('cache-control');
  let maxAge = 3600; // default to 1 hour
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/);
    if (match) {
      maxAge = parseInt(match[1], 10);
    }
  }

  const certs = await response.json();
  keyCache[type] = {
    certs,
    expiresAt: now + (maxAge * 1000)
  };

  return certs;
}

/**
 * Verifies a Firebase Session Cookie or Firebase ID Token at the Edge.
 * Supports both statelessly by inspecting the issuer (iss) and matching the certificates.
 * 
 * @param {string} token - The raw JWT token string
 * @param {string} projectId - The Firebase Project ID
 * @returns {Promise<jose.JWTPayload & { role?: string }>} The verified token payload
 */
export async function verifyTokenEdge(token, projectId) {
  if (!token) {
    throw new Error('Token is empty');
  }

  if (!projectId) {
    throw new Error('Firebase Project ID is required for verification');
  }

  // 1. Decode the JWT header to find which public key ID ('kid') was used to sign the token
  let decodedHeader;
  try {
    decodedHeader = jose.decodeProtectedHeader(token);
  } catch (err) {
    throw new Error('Malformed token: failed to decode header');
  }

  const kid = decodedHeader.kid;
  const alg = decodedHeader.alg;

  if (!kid) {
    throw new Error('Token header missing "kid" (Key ID)');
  }
  if (alg !== 'RS256') {
    throw new Error(`Invalid signing algorithm: expected RS256, got ${alg}`);
  }

  // 2. Decode payload without verification to determine token type (ID Token or Session Cookie)
  let decodedPayload;
  try {
    decodedPayload = jose.decodeJwt(token);
  } catch (err) {
    throw new Error('Malformed token: failed to decode payload');
  }

  const iss = decodedPayload.iss;
  let type;
  let expectedIssuer;

  if (iss === `https://session.firebase.google.com/${projectId}`) {
    type = 'session';
    expectedIssuer = `https://session.firebase.google.com/${projectId}`;
  } else if (iss === `https://securetoken.google.com/${projectId}`) {
    type = 'idToken';
    expectedIssuer = `https://securetoken.google.com/${projectId}`;
  } else {
    throw new Error(`Invalid token issuer: ${iss}`);
  }

  // 3. Fetch Google certificates matching the token type
  const certs = await getGooglePublicKeys(type);
  const certPem = certs[kid];

  if (!certPem) {
    // If the key is not found, clear the cache and try refetching once
    keyCache[type] = { certs: null, expiresAt: 0 };
    const freshCerts = await getGooglePublicKeys(type);
    const freshCertPem = freshCerts[kid];
    if (!freshCertPem) {
      throw new Error(`No matching public key found for Key ID: ${kid}`);
    }
  }

  // 4. Import the public key or X509 certificate to Web Crypto CryptoKey format
  let publicKey;
  if (certPem.includes('PUBLIC KEY')) {
    publicKey = await jose.importSPKI(certPem, 'RS256');
  } else {
    publicKey = await jose.importX509(certPem, 'RS256');
  }

  // 5. Verify the token signature and standard JWT claims (exp, iss, aud)
  const { payload } = await jose.jwtVerify(token, publicKey, {
    issuer: expectedIssuer,
    audience: projectId,
    currentDate: new Date()
  });

  // 6. Return the verified payload (containing uid, role, email, etc.)
  return payload;
}
