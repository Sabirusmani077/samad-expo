// Automated Security Verification Test Suite for Samad Expo
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== SAMAD EXPO SECURITY VERIFICATION TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${details ? "— " + details : ""}`);
      failed++;
    }
  }

  // 1. Security Headers Verification
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, "Home page responds with HTTP 200");
    const xContentType = res.headers.get("x-content-type-options");
    const xFrameOptions = res.headers.get("x-frame-options");
    const referrerPolicy = res.headers.get("referrer-policy");
    const permissionsPolicy = res.headers.get("permissions-policy");
    const xssProtection = res.headers.get("x-xss-protection");
    const csp = res.headers.get("content-security-policy");

    assert(xContentType === "nosniff", "Header X-Content-Type-Options: nosniff present", `Got: ${xContentType}`);
    assert(xFrameOptions === "SAMEORIGIN", "Header X-Frame-Options: SAMEORIGIN present", `Got: ${xFrameOptions}`);
    assert(referrerPolicy === "strict-origin-when-cross-origin", "Header Referrer-Policy present", `Got: ${referrerPolicy}`);
    assert(!!permissionsPolicy, "Header Permissions-Policy present", `Got: ${permissionsPolicy}`);
    assert(xssProtection === "1; mode=block", "Header X-XSS-Protection present", `Got: ${xssProtection}`);
    assert(!!csp && csp.includes("default-src 'self'"), "Content-Security-Policy (CSP) present", `Got: ${csp}`);
  } catch (e) {
    assert(false, "Security headers check", e.message);
  }

  // 2. Direct Admin Route Access Protection (RBAC)
  try {
    const res = await fetch(`${BASE_URL}/admin/corporate`, { redirect: "manual" });
    assert(res.status === 307 || res.status === 302, "Unauthenticated access to /admin/corporate is blocked and redirected", `Status: ${res.status}`);
    const location = res.headers.get("location");
    assert(!!location && location.includes("/login"), "Redirect location points to /login", `Location: ${location}`);
  } catch (e) {
    assert(false, "Admin route RBAC check", e.message);
  }

  // 3. Admin API Route Protection
  try {
    const res1 = await fetch(`${BASE_URL}/api/admin/media`);
    assert(res1.status === 401, "Unauthenticated GET /api/admin/media returns HTTP 401 Unauthorized", `Status: ${res1.status}`);

    const res2 = await fetch(`${BASE_URL}/api/admin/export-excel`);
    assert(res2.status === 401, "Unauthenticated GET /api/admin/export-excel returns HTTP 401 Unauthorized", `Status: ${res2.status}`);
  } catch (e) {
    assert(false, "Admin API access control check", e.message);
  }

  // 4. Password Reset Token Tamper-Resistance & Protection
  try {
    // Attempt resetting password with a forged/dummy token
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sabirusmani159@gmail.com",
        token: "forged_malicious_token_12345",
        newPassword: "HackedPassword123!",
      }),
    });
    assert(res.status === 400, "Forged password reset token is strictly rejected with HTTP 400", `Status: ${res.status}`);
    const data = await res.json();
    assert(data.error && data.error.includes("token"), "Rejected with clear security error message", `Error: ${data.error}`);
  } catch (e) {
    assert(false, "Password reset tamper-resistance check", e.message);
  }

  // 5. Valid Password Reset Flow Verification
  try {
    // Request legitimate token
    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "qa_1795240154458@test.com" }),
    });
    const forgotData = await forgotRes.json();
    assert(forgotRes.status === 200, "Forgot password request accepted for registered user", `Status: ${forgotRes.status}`);
    assert(!!forgotData.resetToken, "Cryptographic reset token generated");

    if (forgotData.resetToken) {
      // Use the token to reset password
      const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "qa_1795240154458@test.com",
          token: forgotData.resetToken,
          newPassword: "UpdatedSecurePassword2026!",
        }),
      });
      assert(resetRes.status === 200, "Password updated successfully using legitimate signed token", `Status: ${resetRes.status}`);

      // Attempt REPLAY attack using the same token
      const replayRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "qa_1795240154458@test.com",
          token: forgotData.resetToken,
          newPassword: "ReplayAttackerPassword!",
        }),
      });
      assert(replayRes.status === 400, "Replay attack prevented: Single-use token immediately invalid after password change", `Status: ${replayRes.status}`);
    }
  } catch (e) {
    assert(false, "Full password reset lifecycle check", e.message);
  }

  // 6. Rate Limiting Verification on Login
  try {
    let hitRateLimit = false;
    let rateLimitStatus = 0;
    // Perform rapid failed logins
    for (let i = 0; i < 7; i++) {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@user.com", password: "badpassword" }),
      });
      if (res.status === 429) {
        hitRateLimit = true;
        rateLimitStatus = res.status;
        break;
      }
    }
    assert(hitRateLimit && rateLimitStatus === 429, "Login brute-force rate limiter triggers HTTP 429 Too Many Requests");
  } catch (e) {
    assert(false, "Rate limiting check", e.message);
  }

  // 7. MCP API Protocol Endpoint Verification
  try {
    const res = await fetch(`${BASE_URL}/api/mcp`);
    assert(res.status === 200, "MCP API returns HTTP 200 OK");
    const data = await res.json();
    assert(data.status === "active" && data.version === "1.0.0", "MCP server info and tools metadata active");
  } catch (e) {
    assert(false, "MCP API check", e.message);
  }

  console.log(`\n====================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`====================================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
