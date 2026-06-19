// Quick API check script
const http = require('http');

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); } catch { resolve(responseData); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // Test signup
  console.log('--- Testing Signup ---');
  try {
    const signup = await makeRequest('POST', '/api/auth/signup', {
      email: 'qatest_e2e@test.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    });
    console.log('Signup result:', JSON.stringify(signup, null, 2));
  } catch (e) {
    console.log('Signup error:', e.message);
  }

  // Test login
  console.log('\n--- Testing Login ---');
  try {
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'qatest_e2e@test.com',
      password: 'TestPass123!',
    });
    console.log('Login result:', JSON.stringify(login, null, 2));
  } catch (e) {
    console.log('Login error:', e.message);
  }

  // Test Google auth URL
  console.log('\n--- Testing Google Auth URL ---');
  try {
    const google = await makeRequest('GET', '/api/auth/google');
    console.log('Google result type:', typeof google);
  } catch (e) {
    console.log('Google auth error:', e.message);
  }
}

main().catch(console.error);
