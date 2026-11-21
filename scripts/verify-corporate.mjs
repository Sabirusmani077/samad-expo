const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
const INGEST_TOKEN = process.env.TEST_INGEST_TOKEN;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !INGEST_TOKEN) {
  throw new Error("Set TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, and TEST_INGEST_TOKEN before running corporate checks.");
}

function assert(condition, message) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

async function json(response) {
  return response.json();
}

async function run() {
  const unauthorizedWebsites = await fetch(`${BASE_URL}/api/corporate/websites`);
  const unauthorizedAnalytics = await fetch(`${BASE_URL}/api/corporate/analytics`);
  const unauthorizedMedia = await fetch(`${BASE_URL}/api/admin/media`);
  assert(unauthorizedWebsites.status === 401, "Website management API must reject anonymous reads.");
  assert(unauthorizedAnalytics.status === 401, "Corporate analytics API must reject anonymous reads.");
  assert(unauthorizedMedia.status === 401, "Media library must reject anonymous reads.");

  const login = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  assert(login.ok, "Bootstrap administrator must be able to sign in.");
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "Login must set the admin session cookie.");
  const adminHeaders = { Cookie: cookie, "Content-Type": "application/json" };

  const marker = Date.now().toString(36);
  const businessName = `Corporate QA ${marker}`;
  const businessSlug = `corporate-qa-${marker}`;
  const businessCreate = await fetch(`${BASE_URL}/api/corporate/businesses`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      name: businessName, slug: businessSlug, category: "QA", logo: "", banner: "",
      description: "Temporary isolated integration test record.", shortDescription: "QA business",
      objectives: [], productsAndServices: [], websiteIds: [], contactEmail: "", contactPhone: "",
      status: "active", sortOrder: 0,
    }),
  });
  const businessResult = await json(businessCreate);
  assert(businessCreate.status === 201 && businessResult.item?.id, "Business division creation must work.");

  const websiteName = `Platform ${marker}`;
  const websiteSlug = `platform-${marker}`;
  const websiteCreate = await fetch(`${BASE_URL}/api/corporate/websites`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      name: websiteName, slug: websiteSlug, category: "Web Applications", url: "https://example.com",
      logo: "", banner: "", screenshots: [], description: "Temporary isolated test listing.",
      shortDescription: "QA website", features: [], productsAndServices: [], launchDate: "",
      status: "under_development", businessDivisionId: businessResult.item.id,
      ownershipType: "external_partnership", showOwnershipPublicly: false, analyticsEnabled: true,
      isPublic: true, sortOrder: 0,
    }),
  });
  const websiteResult = await json(websiteCreate);
  assert(websiteCreate.status === 201 && websiteResult.item?.id, "Website listing creation must work.");

  const duplicateWebsite = await fetch(`${BASE_URL}/api/corporate/websites`, {
    method: "POST", headers: adminHeaders,
    body: JSON.stringify({ ...websiteResult.item, id: undefined }),
  });
  assert(duplicateWebsite.status === 409, "Duplicate website slugs must be rejected.");

  const search = await json(await fetch(`${BASE_URL}/api/corporate/search?q=${encodeURIComponent(marker)}`));
  assert(search.results?.some((item) => item.id === websiteResult.item.id), "Global ecosystem search must include public website listings.");
  assert(search.results?.some((item) => item.id === businessResult.item.id), "Global ecosystem search must include active business divisions.");

  const publicProfile = await fetch(`${BASE_URL}/websites/${websiteSlug}`);
  const publicProfileHtml = await publicProfile.text();
  assert(publicProfile.status === 200 && publicProfileHtml.includes(websiteName), "Website listing must have a public profile page.");
  assert(!publicProfileHtml.toLowerCase().includes("external partnership"), "Unapproved ownership details must stay private.");
  const publicBusiness = await fetch(`${BASE_URL}/businesses/${businessSlug}`);
  assert(publicBusiness.status === 200, "Business division must have a public profile page.");

  const pageView = await fetch(`${BASE_URL}/api/corporate/analytics/page-view`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: `/websites/${websiteSlug}`, referrerHost: "search.example" }),
  });
  assert(pageView.status === 202, "Parent-site page-view events must be recorded.");

  const deniedIngest = await fetch(`${BASE_URL}/api/corporate/analytics/ingest`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ websiteSlug, path: "/" }),
  });
  assert(deniedIngest.status === 401, "Connected analytics ingestion must require its server token.");
  const ingested = await fetch(`${BASE_URL}/api/corporate/analytics/ingest`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${INGEST_TOKEN}` },
    body: JSON.stringify({ websiteSlug, path: "/", referrerHost: "search.example" }),
  });
  assert(ingested.status === 202, "Enabled websites must be able to send connected analytics events.");

  const analytics = await json(await fetch(`${BASE_URL}/api/corporate/analytics`, { headers: adminHeaders }));
  assert(analytics.totalWebsites >= 1 && analytics.mainWebsiteAnalytics.totalPageViews >= 1, "Analytics dashboard must report registered websites and real page views.");
  assert(analytics.connectedWebsiteAnalytics.properties.some((site) => site.websiteId === websiteResult.item.id && site.totalPageViews === 1), "Connected website reporting must use recorded events.");
  assert(analytics.mainWebsiteAnalytics.uniqueVisitors.status === "not_collected", "Analytics must disclose unavailable unique-visitor statistics.");

  const invalidProfile = await fetch(`${BASE_URL}/api/corporate/company`, {
    method: "PUT", headers: adminHeaders,
    body: JSON.stringify({ contactEmail: "not-an-email" }),
  });
  assert(invalidProfile.status === 400, "Company profile validation must reject invalid contact email.");
  const companyRead = await fetch(`${BASE_URL}/api/corporate/company`, { headers: adminHeaders });
  const companyData = await json(companyRead);
  assert(companyRead.ok && companyData.companyProfile?.businessName, "Company profile admin read must return the persisted profile.");

  const adminOverview = await fetch(`${BASE_URL}/admin/corporate`, { headers: adminHeaders });
  const integrationPage = await fetch(`${BASE_URL}/admin/corporate/integrations`, { headers: adminHeaders });
  const analyticsPage = await fetch(`${BASE_URL}/admin/corporate/analytics`, { headers: adminHeaders });
  assert(adminOverview.ok && integrationPage.ok && analyticsPage.ok, "Corporate admin, integrations, and reporting pages must render for admins.");

  const deleteWebsite = await fetch(`${BASE_URL}/api/corporate/websites/${websiteResult.item.id}`, { method: "DELETE", headers: adminHeaders });
  const deleteBusiness = await fetch(`${BASE_URL}/api/corporate/businesses/${businessResult.item.id}`, { method: "DELETE", headers: adminHeaders });
  assert(deleteWebsite.ok && deleteBusiness.ok, "Corporate test records must be removable through the admin APIs.");

  console.log("✓ Anonymous access is blocked for corporate administration and media.");
  console.log("✓ Business and website CRUD, relationship validation, public profiles, and global search work.");
  console.log("✓ Parent and connected analytics record real page-view events and disclose unavailable visitor metrics.");
  console.log("✓ Company profile validation and corporate reporting/integration pages work.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
