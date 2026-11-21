# MDK Enterprises — Complete E-Commerce Platform

**Tagline:** *"Quality Products. Trusted Service. Smarter Shopping."*

A complete, production-ready, full-stack e-commerce web application built for **MDK Enterprises** using **Next.js (App Router), TypeScript, and Tailwind CSS**.

---

## 1. Brand Identity & Strict Design System

- **Primary Brand Color:** `#CAFFA6` (Light Lime Green)
- **Derived Interactive Hover Shade:** `#B4F288`
- **Primary Background Color:** `#FFFFFF` (Pure White)
- **Typography & Contrast:** Near-black / Dark Charcoal (`#0F172A`) ensuring high WCAG contrast across every button, badge, navigation link, form control, and chat bubble.
- **Visual Direction:** Inspired by the owner's Pinterest reference (`https://pin.it/12bKfWJNf`), featuring a clean upper navigation bar, a bold split hero with `#CAFFA6` architectural backdrop and vertical slide selectors (`01`–`04`), a 4-pillar trust strip, an asymmetric 5-card Bento category showcase, filterable New Arrivals product cards, a 3-step `MDK15` promotional banner, and floating WhatsApp + MDK Assistant controls.

---

## 2. Complete Website Pages (20+ Routes)

| # | Page | URL Route | Description |
|---|------|-----------|-------------|
| 1 | **Home** | `/` | Hero showcase, 4-column service bar, 5-card Bento category grid, New Arrivals with category tabs, `MDK15` promo banner, Featured Products, Why Shop With Us, Verified Reviews, and FAQ preview |
| 2 | **Shop All Products** | `/shop` | Search, category filter, max price filter, in-stock filter, sorting (Newest, Price Asc/Desc, Popularity), and pagination |
| 3 | **Product Categories** | `/categories` | Category directory with live item counts and product previews |
| 4 | **Individual Product Details** | `/product/[slug]` | Multi-image gallery, SKU, variant selector, live stock, Add to Cart, Buy Now, Wishlist, Share link, WhatsApp Direct Product Inquiry shortcut, specifications table, verified purchase reviews, related products, and JSON-LD `Product` schema |
| 5 | **Search Results** | `/search` | Dedicated instant search page with popular search chips |
| 6 | **Shopping Cart** | `/cart` | Quantity controls, promo code validation (`MDK15`, `WELCOME200`), server-calculated subtotal, 18% GST, shipping fee, and free-shipping progress bar |
| 7 | **Checkout** | `/checkout` | Guest & registered customer checkout, saved address auto-fill, server-side stock/price verification, and Sandbox/Live Payment Gateway Modal |
| 8 | **Payment Result** | `/payment/result` | Handles verified `paid`, `pending`, `failed`, and `cancelled` states with one-click payment retry |
| 9 | **Order Confirmation** | `/order-confirmation/[orderNumber]` | Verified transaction status, itemized receipt, GST breakdown, honest email notification status, and printable invoice view |
| 10 | **Login & Password Reset** | `/login` | Customer & Admin login with HttpOnly session cookies and password recovery workflow |
| 11 | **Customer Registration** | `/register` | Account registration with PBKDF2 password hashing and explicit privacy consent |
| 12 | **Customer Profile** | `/profile` | Personal details, saved delivery addresses, password update, and self-service account deletion |
| 13 | **My Orders** | `/orders` | Authenticated customer's complete order history |
| 14 | **Order Tracking** | `/track-order` | Privacy-protected order lookup requiring both Order Reference (`MDK-...`) and checkout Email/Phone |
| 15 | **Wishlist** | `/wishlist` | Saved favorite products with one-click Move to Cart |
| 16 | **About Us** | `/about` | Brand identity, values, and transparency commitment |
| 17 | **Contact Us** | `/contact` | Validated customer inquiry form saved to database + WhatsApp click-to-chat CTA |
| 18 | **FAQs** | `/faq` | Searchable, categorized Frequently Asked Questions |
| 19 | **Privacy Policy** | `/privacy-policy` | Data minimization, payment security, and customer privacy rights |
| 20 | **Terms & Conditions** | `/terms` | Storefront usage, server-validated pricing, and order acceptance terms |
| 21 | **Shipping & Delivery Policy** | `/shipping-policy` | Live shipping fee (`₹99`) and free shipping threshold (`₹999+`) |
| 22 | **Returns & Refund Policy** | `/returns-policy` | 7-day return eligibility and traceable refund reference workflow |
| 23 | **Admin Dashboard** | `/admin` | Role-protected staff portal for products, categories, stock, orders, refunds, discount codes, inquiries, social links, WhatsApp config, and MDK Assistant FAQs |

---

## 3. Local Setup & Running Instructions

### Prerequisites
- **Node.js** `v18.18+` or `v20+` / `v24+`
- **npm** `v9+`

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Copy environment variable template
cp .env.example .env.local

# 3. Start the development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Verification
```bash
npm run build
npm run start
```

### Automated End-to-End Customer Journey Test Suite
With the server running on `http://localhost:3000`, run:
```bash
npm run test:e2e
```

## 4. MD Enterprises Corporate Ecosystem

The existing Next.js application now includes the parent-company homepage at `/`, searchable ecosystem directory at `/websites`, public website profiles at `/websites/[slug]`, and business division pages at `/businesses/[slug]`. The public global search is available at `/ecosystem-search` and `/api/corporate/search`.

Corporate administrators use `/admin/corporate` to manage company information and brand assets, websites, business divisions, founder and leadership profiles, services, portfolio entries, news, inquiries, media, analytics, integrations, and activity history. Corporate mutation APIs require an administrator session. Website and business records validate their slugs, links, statuses, fields, and associations before saving. Public ownership disclosure is opt-in for each website listing.

Uploaded media accepts JPEG, PNG, and WebP images up to 5 MB. Founder and leadership information is left blank until an administrator supplies it; the application does not invent biographies, qualifications, or work history.

### Connected website analytics

Set a private `MD_ANALYTICS_INGEST_TOKEN` in the server environment. Enable **Connected analytics** on each website listing that should send page views. The integration page at `/admin/corporate/integrations` shows enabled website slugs and a server-side request example. Keep the token on the connected website's server. Events store normalized page paths and referrer hostnames; visitor identifiers, cookies, and full referrer URLs are not collected. Unique visitors and service-level interest remain unavailable until separately instrumented.

Parent site analytics are recorded by the site itself. Connected website counts are reported separately and only after the integration receives events. Empty metrics show as awaiting data rather than estimated values.

### Storage and expansion

This project retains its existing JSON-backed data store to preserve current storefront data. `MDK_DB_FILE` can point an isolated test run or deployment at a separate JSON file. The store is suitable for the current single-process application and for maintaining many directory records, but it is not a shared multi-instance database. Before running multiple application instances or collecting sustained high-volume analytics, move persistence to a shared transactional database and keep the existing record types and API boundaries.

Run the corporate API checks against a running server with an isolated test database and temporary credentials:

```powershell
$env:TEST_BASE_URL = "http://localhost:3000"
$env:TEST_ADMIN_EMAIL = "qa-admin@example.test"
$env:TEST_ADMIN_PASSWORD = "use-a-temporary-password"
$env:TEST_INGEST_TOKEN = "use-a-temporary-token"
npm run test:corporate
```

The test creates and removes its temporary website and division records. Run the server with matching bootstrap and analytics environment variables and an isolated `MDK_DB_FILE` when testing a fresh database.

---

## 5. Bootstrap Access and Sandbox Customer

---

## 4. Bootstrap Access and Sandbox Customer

| Role | Email | Password |
|------|-------|----------|
| **Demo Customer** | `customer@mdkenterprises.example.com` | `Customer@MDK2026` |

Set `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` to private values before creating a new database. The application does not ship with a reusable administrator password. Existing administrator accounts in the current data file remain unchanged.

---

## 6. Switching Payment Gateways from Sandbox to Live Mode

1. Complete merchant KYC onboarding with **Razorpay** (`https://dashboard.razorpay.com`) or **Cashfree Payments** (`https://merchant.cashfree.com`).
2. Obtain your **Live Key ID**, **Live Key Secret**, and **Webhook Secret**.
3. Update `.env.local` (or your hosting provider's server environment variables):
   ```env
   PAYMENT_MODE="live"
   PAYMENT_PROVIDER="razorpay"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_your_actual_key_id"
   RAZORPAY_KEY_SECRET="your_actual_live_key_secret"
   RAZORPAY_WEBHOOK_SECRET="your_actual_webhook_secret"
   ```
4. Configure your payment gateway dashboard to send signed payment webhooks to:
   `https://your-domain.com/api/payments/webhook`
5. In the **Admin Dashboard → Store & Social Links**, switch **Payment Mode** from `Sandbox` to `Live Production Mode`.

---

## 7. Outstanding Requirements Before Public Launch

Because MDK Enterprises enforces strict authenticity (no fabricated products, fake reviews, or invented social handles), the business owner should complete the following before going live:

1. **Replace Demonstration Products:** Sign in to `/admin` → **Products** and replace or unpublish the initial `MDK-DEMO-*` items with your actual inventory, SKUs, HSN/GST rates, and product photography.
2. **Configure Official Social Media & WhatsApp Business:** Sign in to `/admin` → **Store & Social Links** and enter your verified WhatsApp Business phone number (with country code, e.g., `919876543210`) and official URLs for Instagram, Facebook, LinkedIn, YouTube, X, or Telegram. Unconfigured platforms remain automatically hidden.
3. **Update Registered Office & GSTIN Details:** Update your physical business address, support phone, and GSTIN in `/admin` → **Store & Social Links**.
4. **Configure Payment Gateway Live Credentials:** Add live Razorpay or Cashfree credentials in server environment variables.
5. **Configure Transactional Email (SMTP / Resend):** Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` in `.env` to enable automated email dispatch.
6. **Optional AI API Key:** Set `GEMINI_API_KEY` or `OPENAI_API_KEY` in `.env` if you wish to augment the built-in deterministic live catalogue & FAQ engine.
