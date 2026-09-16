const http = require('http');
const assert = require('assert');
const app = require('../server');

const PORT = 5055;
const server = app.listen(PORT, async () => {
  console.log(`🧪 Testing SRA Fact-Checking API on port ${PORT}...`);
  try {
    // 1. Test Health API
    const healthRes = await fetchJSON(`http://localhost:${PORT}/api/health`);
    assert.strictEqual(healthRes.status, 'UP', 'Health check should return UP');
    console.log('✅ Health Check endpoint PASSED');

    // 2. Test News List
    const newsRes = await fetchJSON(`http://localhost:${PORT}/api/news`);
    assert.strictEqual(newsRes.success, true);
    assert.ok(Array.isArray(newsRes.data), 'News data should be array');
    console.log(`✅ News Endpoint PASSED (Retrieved ${newsRes.data.length} news items)`);

    // 3. Test AI Fact-Checking Engine (False Claim Detection)
    const falseClaimRes = await postJSON(`http://localhost:${PORT}/api/factcheck/verify`, {
      text: 'Viral claim that RBI is issuing new 5000 rupee notes next month',
      method: 'text'
    });
    assert.strictEqual(falseClaimRes.success, true);
    assert.strictEqual(falseClaimRes.data.verdict, 'False', '5000 note claim should be classified as False');
    assert.ok(falseClaimRes.data.confidence >= 90, 'Confidence should be >= 90%');
    console.log(`✅ AI Fact-Checking (False Claim Test) PASSED: Verdict = ${falseClaimRes.data.verdict} (${falseClaimRes.data.confidence}%)`);

    // 4. Test AI Fact-Checking Engine (True Claim Detection)
    const trueClaimRes = await postJSON(`http://localhost:${PORT}/api/factcheck/verify`, {
      text: 'Ministry announced budget for highway expansion infrastructure',
      method: 'text'
    });
    assert.strictEqual(trueClaimRes.success, true);
    assert.strictEqual(trueClaimRes.data.verdict, 'True');
    console.log(`✅ AI Fact-Checking (True Claim Test) PASSED: Verdict = ${trueClaimRes.data.verdict} (${trueClaimRes.data.confidence}%)`);

    // 5. Test Ticket Submission
    const ticketRes = await postJSON(`http://localhost:${PORT}/api/tickets/submit`, {
      claimText: 'Test ticket for unverified social post',
      method: 'video',
      submittedBy: 'test_student'
    });
    assert.strictEqual(ticketRes.success, true);
    console.log(`✅ Ticket Submission PASSED (Ticket ID: ${ticketRes.data.id})`);

    // 6. Test Analytics
    const analyticsRes = await fetchJSON(`http://localhost:${PORT}/api/analytics`);
    assert.strictEqual(analyticsRes.success, true);
    assert.ok(analyticsRes.data.totalClaimsVerified > 0);
    console.log(`✅ Analytics Endpoint PASSED (Total Verified: ${analyticsRes.data.totalClaimsVerified})`);

    console.log('\n🎉 ALL SRA BACKEND API TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const urlObj = new URL(url);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}
