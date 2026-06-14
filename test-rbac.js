import assert from 'assert';
import * as jose from 'jose';

// Setup Mock environment variables for testing before imports are evaluated
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-sri-lanka-project';
process.env.FIREBASE_PROJECT_ID = 'test-sri-lanka-project';

const PROJECT_ID = 'test-sri-lanka-project';
const KEY_ID = 'mock-test-key-id';

// Helper class to mock NextRequest in Node environment
class MockNextRequest {
  constructor(pathname, cookies = {}) {
    this.nextUrl = { pathname };
    this.url = `https://mybrand.com${pathname}`;
    
    // Stub cookies object matching NextRequest API
    this.cookies = {
      get: (name) => {
        return cookies[name] ? { value: cookies[name] } : undefined;
      }
    };
  }
}

async function runTests() {
  const { middleware } = await import('./middleware.js');
  console.log('--- GENERATING TEST RSA KEY PAIR ---');
  // 1. Generate a mock RSA keypair for token signing and verification
  const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
  const publicPem = await jose.exportSPKI(publicKey);

  console.log('--- MOCKING GOOGLE CERTIFICATES FETCH ---');
  // 2. Mock the global fetch to intercept key certificates calls and return our public key
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url.includes('identitytoolkit/v3/relyingparty/publicKeys')) {
      return {
        ok: true,
        headers: {
          get: () => 'max-age=3600'
        },
        json: async () => ({
          [KEY_ID]: publicPem
        })
      };
    }
    return originalFetch(url);
  };

  // 3. Helper to sign a mock Firebase Session Cookie with roles
  async function createMockSessionCookie(role, expired = false) {
    const claims = role ? { role } : {};
    
    return await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', kid: KEY_ID })
      .setIssuer(`https://session.firebase.google.com/${PROJECT_ID}`)
      .setAudience(PROJECT_ID)
      .setSubject('test-uid-123')
      .setIssuedAt()
      .setExpirationTime(expired ? '-1h' : '1h')
      .sign(privateKey);
  }

  // Define test matrix
  const tests = [
    {
      name: 'Unauthenticated User -> Redirected to /login from protected path /live',
      request: new MockNextRequest('/live'),
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302, 'Should return 302 redirect');
        assert.ok(res.redirectUrl.includes('/login?redirect=%2Flive'), 'Should redirect to login with query');
      }
    },
    {
      name: 'Unauthenticated User -> Redirected to /login from protected path /essentials',
      request: new MockNextRequest('/essentials/logistics'),
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.includes('/login?redirect=%2Fessentials%2Flogistics'));
      }
    },
    {
      name: 'PRE_TRIP User -> Access to /essentials allowed',
      request: null, // to be populated with signed cookie
      role: 'PRE_TRIP',
      path: '/essentials/visa',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 200, 'Should allow access (status 200)');
      }
    },
    {
      name: 'PRE_TRIP User -> Access to /discovery allowed',
      request: null,
      role: 'PRE_TRIP',
      path: '/discovery/packing-list',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 200);
      }
    },
    {
      name: 'PRE_TRIP User -> Blocked from /live, redirected to /essentials',
      request: null,
      role: 'PRE_TRIP',
      path: '/live',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.endsWith('/essentials'));
      }
    },
    {
      name: 'PRE_TRIP User -> Blocked from /memories, redirected to /essentials',
      request: null,
      role: 'PRE_TRIP',
      path: '/memories',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.endsWith('/essentials'));
      }
    },
    {
      name: 'ACTIVE_TRIP User -> Access to /live allowed',
      request: null,
      role: 'ACTIVE_TRIP',
      path: '/live/day-1',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 200);
      }
    },
    {
      name: 'ACTIVE_TRIP User -> Access to /essentials allowed',
      request: null,
      role: 'ACTIVE_TRIP',
      path: '/essentials/logistics',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 200);
      }
    },
    {
      name: 'ACTIVE_TRIP User -> Blocked from /memories and /, redirected to /live',
      request: null,
      role: 'ACTIVE_TRIP',
      path: '/',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.endsWith('/live'));
      }
    },
    {
      name: 'ALUMNA User -> Access to /memories allowed',
      request: null,
      role: 'ALUMNA',
      path: '/memories/gallery',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 200);
      }
    },
    {
      name: 'ALUMNA User -> Blocked from /live and /, redirected to /memories',
      request: null,
      role: 'ALUMNA',
      path: '/live',
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.endsWith('/memories'));
      }
    },
    {
      name: 'Expired Cookie -> Redirected to /login, cookie deleted',
      request: null,
      role: 'ACTIVE_TRIP',
      path: '/live',
      expired: true,
      assertResponse: (res) => {
        assert.strictEqual(res.status, 302);
        assert.ok(res.redirectUrl.includes('/login'));
        assert.ok(res.cookies.get('__session'), 'Should have modified the cookie');
        assert.strictEqual(res.cookies.get('__session').action, 'delete', 'Should delete session cookie');
      }
    }
  ];

  console.log('\n--- RUNNING RBAC TEST CASES ---');
  let passedCount = 0;

  for (const test of tests) {
    let req = test.request;
    if (!req) {
      const token = await createMockSessionCookie(test.role, test.expired);
      req = new MockNextRequest(test.path, { __session: token });
    }

    try {
      const response = await middleware(req);
      test.assertResponse(response);
      console.log(`✅ [PASS] ${test.name}`);
      passedCount++;
    } catch (err) {
      console.error(`❌ [FAIL] ${test.name}`);
      console.error(err);
    }
  }

  // Restore fetch
  globalThis.fetch = originalFetch;

  console.log(`\n--- TEST SUMMARY ---`);
  console.log(`Passed: ${passedCount}/${tests.length}`);

  if (passedCount !== tests.length) {
    process.exit(1);
  } else {
    console.log('All tests passed successfully! 🚀\n');
  }
}

runTests().catch(err => {
  console.error('Fatal testing error:', err);
  process.exit(1);
});
