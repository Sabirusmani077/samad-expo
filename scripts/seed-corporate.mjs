import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "mdk-store.json");

if (fs.existsSync(DB_PATH)) {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

  // Seed default business divisions if empty
  if (!db.businessDivisions || db.businessDivisions.length === 0) {
    db.businessDivisions = [
      {
        id: "bdiv_ecom",
        name: "MD E-Commerce & Retail Ventures",
        slug: "md-ecommerce-retail",
        logo: "",
        banner: "",
        category: "E-Commerce & Retail",
        description:
          "Operating direct-to-consumer and curated multi-vendor retail platforms with server-verified cryptographic payments and nationwide fulfillment across India.",
        shortDescription:
          "Specialized direct retail commerce, marketplace infrastructure, and supply-chain logistics.",
        objectives: [
          "Deploy specialized retail storefronts with independent branding",
          "Maintain 100% cryptographic payment verification with Razorpay & Cashfree",
          "Empower independent merchants with automated commission escrow settlements",
        ],
        productsAndServices: [
          "Smart Electronics & Audio",
          "Everyday Carry Gear & Bags",
          "Lifestyle Accessories & Optics",
          "Active Footwear",
        ],
        websiteIds: ["site_mdk_store"],
        contactEmail: "retail@mdenterprises.in",
        contactPhone: "+91 94582 04216",
        status: "active",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bdiv_tech",
        name: "MD Digital Labs & Platform Engineering",
        slug: "md-digital-labs",
        logo: "",
        banner: "",
        category: "Technology & Software",
        description:
          "Architecting cloud-native web applications, centralized APIs, business management platforms, and modular SaaS tools for modern enterprises.",
        shortDescription:
          "High-performance Next.js 15 web applications, distributed APIs, and scalable database systems.",
        objectives: [
          "Build modular, headless web platforms that scale effortlessly",
          "Provide centralized administration and API orchestration",
          "Develop enterprise-ready tooling and developer utilities",
        ],
        productsAndServices: [
          "Custom Web Platform Architecture",
          "API Design & Cloud Hosting",
          "Database Schemas & Migrations",
          "Enterprise Admin Consoles",
        ],
        websiteIds: ["site_admin_hub"],
        contactEmail: "tech@mdenterprises.in",
        contactPhone: "+91 94582 04216",
        status: "active",
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bdiv_media",
        name: "MD Media & Publishing Group",
        slug: "md-media-publishing",
        logo: "",
        banner: "",
        category: "Digital Media & Content",
        description:
          "Delivering insightful digital content, tech publications, educational portals, and multimedia assets across our decentralized web properties.",
        shortDescription:
          "Digital publications, knowledge bases, and multimedia content ecosystems.",
        objectives: [
          "Publish authoritative insights on technology and commerce",
          "Produce high-quality documentation and user guides",
          "Grow engaged digital communities around our platforms",
        ],
        productsAndServices: [
          "Tech Editorial & Research",
          "Interactive Learning Guides",
          "Corporate Press & Announcements",
        ],
        websiteIds: [],
        contactEmail: "media@mdenterprises.in",
        contactPhone: "+91 94582 04216",
        status: "active",
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Seed default website listings if empty
  if (!db.websiteListings || db.websiteListings.length === 0) {
    db.websiteListings = [
      {
        id: "site_mdk_store",
        name: "MDK Direct Retail Store",
        slug: "mdk-direct-store",
        logo: "",
        banner: "",
        screenshots: [],
        category: "E-Commerce",
        shortDescription:
          "Official retail commerce platform featuring smart electronics, bags, everyday carry, and lifestyle accessories.",
        description:
          "MDK Direct is the retail flagship of MD Enterprises. Built with Next.js 15, server-side cart calculation, Razorpay webhook verification, and automated commission escrow for verified vendors.",
        features: [
          "100% Cryptographic Razorpay Signature Verification",
          "Verified Customer Reviews only after completed orders",
          "Real-time Tracking Token system for guest & user orders",
          "Cash on Delivery with immediate inventory reservation",
        ],
        productsAndServices: [
          "Smart Electronics & Audio",
          "Everyday Carry Backpacks",
          "Polarized Sunglasses",
          "Active Footwear",
        ],
        url: "http://localhost:3000/store",
        launchDate: "2024-01-15",
        status: "live",
        businessDivisionId: "bdiv_ecom",
        ownershipType: "owned",
        isPublic: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "site_admin_hub",
        name: "MD Central Management Console",
        slug: "md-management-console",
        logo: "",
        banner: "",
        screenshots: [],
        category: "Business Management Systems",
        shortDescription:
          "Central administration and control hub for managing corporate divisions, websites directory, and financial ledgers.",
        description:
          "Comprehensive administrative master console providing unified control over all parent corporate information, website directory listings, leadership profiles, product moderation, and automated payouts.",
        features: [
          "Centralized Website Ecosystem Manager",
          "Corporate Division CRUD Architecture",
          "Real-time Financial Ledger with 7% marketplace fee accounting",
          "Corporate Inquiry Desk with internal staff notes",
        ],
        productsAndServices: [
          "Platform Control",
          "Audit Logging",
          "Ledger Management",
        ],
        url: "http://localhost:3000/admin/corporate",
        launchDate: "2024-03-01",
        status: "live",
        businessDivisionId: "bdiv_tech",
        ownershipType: "owned",
        isPublic: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "site_vendor_portal",
        name: "MD Creator & Vendor Hub",
        slug: "md-vendor-hub",
        logo: "",
        banner: "",
        screenshots: [],
        category: "Web Applications",
        shortDescription:
          "Dedicated self-service vendor portal for seller onboarding, KYC verification, and payout requests.",
        description:
          "The seller management gateway where merchants upload catalogue items, view commission earnings, and request bank transfers after inspection windows mature.",
        features: [
          "Self-service Merchant KYC Onboarding",
          "Real-time Balance: Pending, Matured, and Withdrawn",
          "Live Product Moderation Queue",
        ],
        productsAndServices: ["Vendor Portal", "Merchant Payouts"],
        url: "http://localhost:3000/vendor-portal",
        launchDate: "2024-06-10",
        status: "live",
        businessDivisionId: "bdiv_ecom",
        ownershipType: "operated",
        isPublic: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "site_cloud_api",
        name: "MD Cloud API & Integration Hub",
        slug: "md-cloud-api",
        logo: "",
        banner: "",
        screenshots: [],
        category: "Technology Solutions",
        shortDescription:
          "Unified REST & GraphQL API endpoints connecting decentralized platforms to centralized analytics and identity.",
        description:
          "Scalable cloud API layer offering real-time corporate analytics, cross-platform product queries, webhook receivers, and authentication bridges.",
        features: [
          "Centralized JSON Analytics endpoint",
          "Cryptographic Order & Payout Signatures",
          "Decentralized Webhook Routing",
        ],
        productsAndServices: ["REST APIs", "Analytics Gateway"],
        url: "http://localhost:3000/api/corporate/analytics",
        launchDate: "2024-08-01",
        status: "live",
        businessDivisionId: "bdiv_tech",
        ownershipType: "managed",
        isPublic: true,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "site_academy",
        name: "MD Academy & Learning Gateway",
        slug: "md-academy",
        logo: "",
        banner: "",
        screenshots: [],
        category: "Educational Platforms",
        shortDescription:
          "Upcoming online learning platform offering specialized courses in e-commerce, cloud engineering, and digital growth.",
        description:
          "Interactive digital education portal designed to train aspiring creators and engineers in modern platform building and sustainable digital commerce.",
        features: [
          "Interactive Curriculum Modules",
          "Direct Mentorship Channels",
          "Digital Certification Verification",
        ],
        productsAndServices: ["Online Courses", "Skill Certifications"],
        url: "",
        launchDate: null,
        status: "coming_soon",
        businessDivisionId: "bdiv_media",
        ownershipType: "owned",
        isPublic: true,
        sortOrder: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "site_saas_suite",
        name: "MD NextGen SaaS Suite",
        slug: "md-nextgen-saas",
        logo: "",
        banner: "",
        screenshots: [],
        category: "Digital Products",
        shortDescription:
          "Next-generation business productivity tools and automated omnichannel inventory management in active development.",
        description:
          "Integrated suite of cloud utilities for modern merchants, handling automated GST invoices, multi-channel stock sync, and predictive order forecasting.",
        features: [
          "Omnichannel Inventory Synchronization",
          "Automated GST Compliance Invoicing",
          "Predictive Restock Alerts",
        ],
        productsAndServices: ["SaaS Platform", "Cloud Utilities"],
        url: "",
        launchDate: null,
        status: "under_development",
        businessDivisionId: "bdiv_tech",
        ownershipType: "owned",
        isPublic: true,
        sortOrder: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Seed default team members if empty
  if (!db.teamMembers || db.teamMembers.length === 0) {
    db.teamMembers = [
      {
        id: "team_founder",
        name: "MD",
        photo: "",
        designation: "Founder & Owner",
        bio: "Visionary entrepreneur and systems architect behind MD Enterprises. Dedicated to building an interconnected digital business ecosystem where specialized platforms maintain independent identities while benefiting from enterprise-grade shared technology and transparent governance.",
        responsibilities: [
          "Overall Strategic Vision & Corporate Direction",
          "Digital Business Architecture & Holding Structure",
          "Capital Allocation & Strategic Partnerships",
          "Core Technological Standards & Security Policies",
        ],
        isFounder: true,
        founderMessage:
          "Welcome to MD Enterprises. Our journey began with a fundamental belief: that great digital businesses are founded on absolute integrity, continuous technological innovation, and genuine customer respect. As our digital ecosystem expands across commerce, software, and media, we remain deeply committed to building platforms that deliver true value every day.",
        leadershipPhilosophy:
          "Empower independent teams with robust shared infrastructure; maintain total transparency in data and payments; and measure success through long-term customer trust rather than short-term gimmicks.",
        professionalBackground:
          "Over a decade of hands-on experience in full-stack web engineering, distributed cloud systems, e-commerce supply chains, and multi-platform digital orchestration.",
        socialLinks: {
          linkedin: "",
          twitter: "",
          instagram: "",
          website: "https://mdenterprises.in",
          email: "founder@mdenterprises.in",
        },
        sortOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Seed default corporate services if empty
  if (!db.corporateServices || db.corporateServices.length === 0) {
    db.corporateServices = [
      {
        id: "svc_ecom_arch",
        name: "Enterprise E-Commerce Architecture",
        slug: "ecommerce-architecture",
        category: "Digital Commerce",
        shortDescription:
          "Architecting and operating scalable multi-vendor and direct-to-consumer commerce storefronts with cryptographic payment security.",
        description:
          "Full-lifecycle e-commerce engineering including server-verified cart pricing, automated GST calculation, signed payment webhooks (Razorpay/Cashfree), and automated vendor payout escrow engines.",
        features: [
          "Zero-trust client checkout calculations",
          "Multi-vendor KYC and 7% commission accounting",
          "Immediate stock reservation & tracking token engine",
          "Automated return window and escrow settlement",
        ],
        icon: "ShoppingBag",
        businessDivisionId: "bdiv_ecom",
        status: "active",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_web_eng",
        name: "Web Platform & Full-Stack Engineering",
        slug: "platform-engineering",
        category: "Technology Solutions",
        shortDescription:
          "Building modern, ultra-responsive web applications with Next.js 15, React 19, TypeScript, and high-concurrency cloud backends.",
        description:
          "End-to-end full-stack software development delivering high performance, responsive UX, SEO-friendly server-rendered pages, and secure REST/GraphQL API bridges.",
        features: [
          "Next.js 15 Server-Side Rendering (SSR) & App Router",
          "Strict TypeScript type-safety across all endpoints",
          "Tailwind CSS v4 design system implementation",
          "Modular component architecture for easy scaling",
        ],
        icon: "Globe",
        businessDivisionId: "bdiv_tech",
        status: "active",
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_brand_orch",
        name: "Digital Brand Incubation & Ecosystem Strategy",
        slug: "brand-incubation",
        category: "Corporate Strategy",
        shortDescription:
          "Guiding independent online brands from concept to live deployment with centralized governance and decentralized customer identity.",
        description:
          "Strategic incubation framework allowing new ventures to launch rapidly with independent branding and dedicated domains while leveraging MD Enterprises shared services.",
        features: [
          "Independent brand identity & layout customization",
          "Centralized directory integration & cross-promotion",
          "Centralized audit logging and compliance review",
          "Shared infrastructure cost efficiency",
        ],
        icon: "Briefcase",
        businessDivisionId: "bdiv_tech",
        status: "active",
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Seed default portfolio entries if empty
  if (!db.portfolioEntries || db.portfolioEntries.length === 0) {
    db.portfolioEntries = [
      {
        id: "port_mdk_store",
        title: "MDK Nationwide Direct Store",
        slug: "mdk-nationwide-direct-store",
        category: "Retail Commerce",
        shortDescription:
          "Flagship retail store supporting direct inventory and verified multi-vendor marketplace with cryptographic Razorpay orders.",
        description:
          "A production-grade retail platform featuring 24+ curated physical products across smart audio, carry gear, optics, and footwear. Features strict server-side price validation, tracking tokens for guest checkouts, and automated seller balance management.",
        images: [],
        url: "http://localhost:3000/store",
        businessDivisionId: "bdiv_ecom",
        tags: ["Next.js 15", "Razorpay", "Tailwind CSS v4", "E-Commerce"],
        featured: true,
        completedAt: "2024-06-01",
        status: "active",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "port_corporate_hub",
        title: "Central Digital Headquarters Platform",
        slug: "central-digital-headquarters",
        category: "Corporate Systems",
        shortDescription:
          "The unified holding company website and digital ecosystem gateway uniting 100+ decentralized web properties under one umbrella.",
        description:
          "Engineered to serve as the master brand identity of MD Enterprises, supporting dynamic directory listings, business divisions architecture, founder/leadership showcases, and centralized API analytics.",
        images: [],
        url: "http://localhost:3000",
        businessDivisionId: "bdiv_tech",
        tags: ["Holding Company", "Ecosystem Directory", "CMS", "TypeScript"],
        featured: true,
        completedAt: "2024-11-01",
        status: "active",
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Seed default blog posts if empty
  if (!db.blogPosts || db.blogPosts.length === 0) {
    db.blogPosts = [
      {
        id: "blog_announcement",
        title: "MD Enterprises Establishes Official Central Digital Headquarters",
        slug: "md-enterprises-official-headquarters",
        category: "Corporate News",
        excerpt:
          "Unifying our independent websites, web applications, and business divisions under a central parent-company brand and digital directory.",
        content: `Today marks a pivotal milestone for our organization with the official launch of the MD Enterprises corporate website and central digital headquarters.

As our operations have expanded across direct e-commerce, cloud platform engineering, and digital media, establishing a clear parent company identity became essential.

MD Enterprises will continue to champion independent brand identities: every website in our ecosystem retains its specialized domain, unique branding, and tailored customer experience. Simultaneously, all properties benefit from shared cryptographic security, centralized governance, and high-performance server infrastructure.

We look forward to introducing upcoming business divisions and welcome strategic partners to collaborate with us.`,
        coverImage: "",
        tags: ["Corporate", "Announcement", "Ecosystem"],
        author: "MD Enterprises Executive Office",
        status: "published",
        featured: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blog_decentralized_vision",
        title: "Decentralized Branding with Centralized Governance: Our Architectural Philosophy",
        slug: "decentralized-branding-centralized-governance",
        category: "Technology & Architecture",
        excerpt:
          "Why forcing every product into a single generic layout fails, and how MD Enterprises empowers distinct digital platforms to thrive.",
        content: `In modern digital business, one size never fits all. A specialized tech developer tool requires a vastly different interface and tone than a lifestyle retail storefront or an interactive educational academy.

At MD Enterprises, we rejected the traditional monolithic website model in favor of an interconnected ecosystem:

1. Independent Branding: Every platform maintains its unique domain, visual identity, and audience focus.
2. Centralized Security: All platforms share verified payment protocols, cryptographic signatures, and audit standards.
3. Central Directory: Visitors can discover and navigate across all MD Enterprises properties from our central headquarters.

This architecture ensures scalability for over 100+ future independent platforms without rebuilding core systems.`,
        coverImage: "",
        tags: ["Architecture", "Scalability", "Tech Strategy"],
        author: "MD, Founder & Owner",
        status: "published",
        featured: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Write updated DB
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  console.log("Database successfully populated with corporate seed data!");
} else {
  console.log("Database file not found at:", DB_PATH);
}
