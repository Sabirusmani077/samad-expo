const http = require('http');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const BASE_URL = 'http://localhost:3000';

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          text: buffer.toString('utf8'),
          buffer
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Homepage & Header ---');
  const homeRes = await request(BASE_URL + '/');
  console.log('Homepage status:', homeRes.statusCode);
  const hasLogin = homeRes.text.includes('Login / Sign Up') || homeRes.text.includes('Sign In');
  console.log('Header has Login/Sign Up replacement:', hasLogin ? 'PASS' : 'FAIL');

  console.log('\n--- 2. Testing Preserved Project Live URLs ---');
  const ageRes = await request(BASE_URL + '/sites/mdk-chrono-age-calculator');
  console.log('MDK Chrono Age Calculator status:', ageRes.statusCode, '(Content-Type:', ageRes.headers['content-type'] + ')');

  console.log('\n--- 3. Testing Global Ecosystem Search for Deployed Projects ---');
  const searchRes = await request(BASE_URL + '/api/corporate/search?q=chrono');
  console.log('Search status:', searchRes.statusCode);
  const searchJson = JSON.parse(searchRes.text);
  console.log('Search results count:', searchJson.results.length);
  const found = searchJson.results.some(r => r.title.toLowerCase().includes('chrono') || r.type === 'Deployed website');
  console.log('Found Deployed project in Global Search:', found ? 'PASS' : 'FAIL');

  console.log('\n--- 4. Testing User Registration ---');
  const testEmail = `dev_${Date.now()}@samadgroups-test.com`;
  const regPayload = JSON.stringify({
    name: 'Test Engineer',
    email: testEmail,
    password: 'Password123!',
    phone: '+91 99999 88888'
  });
  const regRes = await request(BASE_URL + '/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(regPayload)
    }
  }, regPayload);
  console.log('Register status:', regRes.statusCode);
  const regJson = JSON.parse(regRes.text);
  console.log('User registered:', regJson.user ? regJson.user.email : 'Failed');
  const cookieHeader = regRes.headers['set-cookie'];
  const sessionCookie = cookieHeader ? cookieHeader[0].split(';')[0] : '';
  console.log('Received session cookie:', sessionCookie ? 'YES' : 'NO');

  console.log('\n--- 5. Testing ZIP Archive Creation & Upload ---');
  const testZip = new AdmZip();
  testZip.addFile('index.html', Buffer.from(`<!DOCTYPE html><html><head><title>My Test Site</title><link rel="stylesheet" href="style.css"></head><body><h1>Hello from Samad Groups Hosting!</h1><p id="msg">Live Static Platform Verified</p></body></html>`));
  testZip.addFile('style.css', Buffer.from(`body { background: #000; color: #FFF33D; font-family: sans-serif; text-align: center; padding: 50px; }`));
  const zipBuffer = testZip.toBuffer();

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  let formBody = [];
  
  // Field: projectName
  formBody.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="projectName"\r\n\r\nAutomated Test Platform\r\n`));
  // Field: description
  formBody.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nNext-generation deployment test site.\r\n`));
  // Field: visibility
  formBody.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="visibility"\r\n\r\npublic\r\n`));
  // Field: file
  formBody.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="website.zip"\r\nContent-Type: application/zip\r\n\r\n`));
  formBody.push(zipBuffer);
  formBody.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  const totalFormBody = Buffer.concat(formBody);

  const uploadRes = await request(BASE_URL + '/api/projects/upload', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': totalFormBody.length,
      'Cookie': sessionCookie
    }
  }, totalFormBody);
  console.log('Upload status:', uploadRes.statusCode);
  const uploadJson = JSON.parse(uploadRes.text);
  console.log('Upload response:', uploadJson.success ? 'SUCCESS' : 'FAILED', uploadJson.url || uploadJson.error);

  if (uploadJson.success && uploadJson.project) {
    const slug = uploadJson.project.slug;
    console.log('\n--- 6. Testing Deployed Site Live Retrieval ---');
    const siteRes = await request(`${BASE_URL}/sites/${slug}`);
    console.log(`GET /sites/${slug} status:`, siteRes.statusCode);
    console.log('Site contains expected HTML:', siteRes.text.includes('Hello from Samad Groups Hosting!') ? 'PASS' : 'FAIL');

    console.log('\n--- 7. Testing Sub-Asset Streaming ---');
    const assetRes = await request(`${BASE_URL}/sites/${slug}/style.css`);
    console.log(`GET /sites/${slug}/style.css status:`, assetRes.statusCode);
    console.log('Asset Content-Type:', assetRes.headers['content-type']);
    console.log('Asset content matches CSS:', assetRes.text.includes('background: #000') ? 'PASS' : 'FAIL');
  }

  console.log('\n=== ALL AUTOMATED TESTS COMPLETED ===');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
});
