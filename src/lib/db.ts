import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  Category,
  CustomerInquiry,
  DatabaseSchema,
  DiscountCode,
  FAQItem,
  Order,
  OrderAddress,
  OrderItem,
  OrderStatus,
  PageViewEvent,
  PaymentStatus,
  Product,
  ProductStatus,
  PublicUser,
  StoreSettings,
  User,
  Vendor,
  VendorPayout,
  VendorStatus,
  VerifiedReview,
} from "./types";
import { getInitialSeedData } from "./seed-data";
import {
  computePaymentSignature,
  generateOrderReference,
  generateTrackingToken,
  verifyPaymentSignature,
} from "./security";

const DB_FILE_PATH = process.env.MDK_DB_FILE
  ? path.resolve(process.env.MDK_DB_FILE)
  : path.join(process.cwd(), "data", "mdk-store.json");
const DATA_DIR = path.dirname(DB_FILE_PATH);

function ensureDatabaseInitialized(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initial = getInitialSeedData();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    const seed = getInitialSeedData();
    let mutated = false;

    // 1. Migrate vendors table
    if (!Array.isArray(parsed.vendors)) {
      parsed.vendors = seed.vendors || [];
      mutated = true;
    }

    // 2. Migrate payouts table
    if (!Array.isArray(parsed.payouts)) {
      parsed.payouts = seed.payouts || [];
      mutated = true;
    }

    // 3. Ensure demo vendor user exists in users table
    if (!parsed.users.some((u) => u.role === "vendor")) {
      const seedVendorUser = seed.users.find((u) => u.role === "vendor");
      if (seedVendorUser) {
        parsed.users.push(seedVendorUser);
        mutated = true;
      }
    }

    // 4. Ensure products have approvalStatus, vendorId defaults, and strip (Demo Item) labels
    for (const p of parsed.products) {
      if (!p.approvalStatus) {
        p.approvalStatus = "approved";
        mutated = true;
      }
      if (p.vendorId === undefined) {
        p.vendorId = null;
        mutated = true;
      }
      if (p.name && p.name.includes("(Demo Item)")) {
        p.name = p.name.replace(/\s*\(Demo Item\)/g, "").trim();
        mutated = true;
      }
      if (p.shortDescription && p.shortDescription.includes("(Demo Item)")) {
        p.shortDescription = p.shortDescription.replace(/\s*\(Demo Item\)/g, "").trim();
        mutated = true;
      }
      if (p.codAvailable === undefined) {
        p.codAvailable = true;
        mutated = true;
      }
      if (!p.warranty) {
        p.warranty = "1 Year MDK Warranty";
        mutated = true;
      }
    }

    // 5. Ensure marketplace commission and COD settings exist
    if (
      parsed.settings.defaultCommissionPercent === undefined ||
      parsed.settings.defaultCommissionPercent === 10
    ) {
      parsed.settings.defaultCommissionPercent = 7;
      mutated = true;
    }
    if (parsed.settings.vendorAutoApproval === undefined) {
      parsed.settings.vendorAutoApproval = false;
      mutated = true;
    }
    if (parsed.settings.codEnabled === undefined) {
      parsed.settings.codEnabled = true;
      mutated = true;
    }
    if (parsed.settings.codFee === undefined) {
      parsed.settings.codFee = 0;
      mutated = true;
    }
    if (parsed.settings.autoReplaceDemoProducts === undefined) {
      parsed.settings.autoReplaceDemoProducts = true;
      mutated = true;
    }
    if (parsed.settings.hideDemoProducts === undefined) {
      parsed.settings.hideDemoProducts = false;
      mutated = true;
    }
    if (!parsed.settings.socialLinks?.facebook) {
      if (!parsed.settings.socialLinks) {
        parsed.settings.socialLinks = seed.settings.socialLinks;
      }
      parsed.settings.socialLinks.facebook =
        "https://www.facebook.com/profile.php?id=61595047961100";
      mutated = true;
    }

    // 6. Ensure ledger, audit log, and webhook events arrays exist
    if (!Array.isArray(parsed.financialLedger)) {
      parsed.financialLedger = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.auditLogs)) {
      parsed.auditLogs = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.webhookEvents)) {
      parsed.webhookEvents = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.pageViewEvents)) {
      parsed.pageViewEvents = [];
      mutated = true;
    }

    // 7. Ensure vendors have pendingBalance and 7% default commission
    if (Array.isArray(parsed.vendors)) {
      for (const v of parsed.vendors) {
        if (v.pendingBalance === undefined) {
          v.pendingBalance = 0;
          mutated = true;
        }
        if (v.commissionRatePercent === 10) {
          v.commissionRatePercent = 7;
          mutated = true;
        }
      }
    }

    // 6. Store/e-commerce product seeding disabled (corporate headquarters mode)
    // Corporate modules migration
    if (!Array.isArray(parsed.businessDivisions)) {
      parsed.businessDivisions = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.websiteListings)) {
      parsed.websiteListings = [];
      mutated = true;
    }
    for (const website of parsed.websiteListings) {
      if (website.showOwnershipPublicly === undefined) {
        website.showOwnershipPublicly = false;
        mutated = true;
      }
      if (website.analyticsEnabled === undefined) {
        website.analyticsEnabled = false;
        mutated = true;
      }
    }
    for (const division of parsed.businessDivisions) {
      if (!Array.isArray(division.websiteIds)) {
        division.websiteIds = parsed.websiteListings.filter((website) => website.businessDivisionId === division.id).map((website) => website.id);
        mutated = true;
      }
      if (!Array.isArray(division.objectives)) {
        division.objectives = [];
        mutated = true;
      }
      if (!Array.isArray(division.productsAndServices)) {
        division.productsAndServices = [];
        mutated = true;
      }
    }
    if (!Array.isArray(parsed.teamMembers)) {
      parsed.teamMembers = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.corporateServices)) {
      parsed.corporateServices = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.portfolioEntries)) {
      parsed.portfolioEntries = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.blogPosts)) {
      parsed.blogPosts = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.jobListings)) {
      parsed.jobListings = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.partnerships)) {
      parsed.partnerships = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.corporateInquiries)) {
      parsed.corporateInquiries = [];
      mutated = true;
    }
    // Remove the generated founder claims from the original corporate seed.
    // Administrator-entered profile details remain untouched.
    const seededFounderBio = "The founder of Samad Expo is a visionary entrepreneur with a passion for building digital businesses that make a real difference. With a focus on innovation, quality, and long-term value creation, the founder established Samad Expo as a platform for building and growing multiple digital ventures.";
    const seededFounderMessage = "Welcome to Samad Expo. Our journey began with a simple belief: that great digital businesses are built on strong foundations of integrity, innovation, and genuine value creation. As we continue to grow our digital ecosystem, we remain committed to building platforms and products that truly serve our customers and partners. Thank you for being part of our story.";
    if (parsed.companyProfile?.founderName === "MD") {
      parsed.companyProfile.founderName = "";
      mutated = true;
    }
    if (parsed.companyProfile?.story === "Samad Expo was founded with a clear vision: to build a comprehensive digital business ecosystem that spans e-commerce, technology, digital platforms, and professional services. Starting with a single idea, we have grown into a multi-faceted organization with multiple business divisions and digital properties.") {
      parsed.companyProfile.story = "";
      mutated = true;
    }
    if (parsed.companyProfile?.futureRoadmap === "We are actively expanding our digital ecosystem with new platforms, products, and services. Our roadmap includes launching new e-commerce verticals, digital tools, educational platforms, and technology solutions across multiple industries.") {
      parsed.companyProfile.futureRoadmap = "";
      mutated = true;
    }
    if (parsed.companyProfile?.founderBio === seededFounderBio) {
      parsed.companyProfile.founderBio = "";
      mutated = true;
    }
    if (parsed.companyProfile?.founderMessage === seededFounderMessage) {
      parsed.companyProfile.founderMessage = "";
      mutated = true;
    }
    for (const member of parsed.teamMembers) {
      if (member.bio === "Visionary entrepreneur and systems architect behind Samad Expo. Dedicated to building an interconnected digital business ecosystem where specialized platforms maintain independent identities while benefiting from enterprise-grade shared technology and transparent governance.") {
        member.bio = "";
        mutated = true;
      }
      if (member.professionalBackground === "Over a decade of hands-on experience in full-stack web engineering, distributed cloud systems, e-commerce supply chains, and multi-platform digital orchestration.") {
        member.professionalBackground = "";
        mutated = true;
      }
      if (member.founderMessage === "Welcome to Samad Expo. Our journey began with a fundamental belief: that great digital businesses are founded on absolute integrity, continuous technological innovation, and genuine customer respect. As our digital ecosystem expands across commerce, software, and media, we remain deeply committed to building platforms that deliver true value every day.") {
        member.founderMessage = "";
        mutated = true;
      }
      if (member.leadershipPhilosophy === "Empower independent teams with robust shared infrastructure; maintain total transparency in data and payments; and measure success through long-term customer trust rather than short-term gimmicks.") {
        member.leadershipPhilosophy = "";
        mutated = true;
      }
      if (member.responsibilities?.[0] === "Overall Strategic Vision & Corporate Direction" && member.responsibilities.length === 4) {
        member.responsibilities = [];
        mutated = true;
      }
    }
    if (!parsed.companyProfile) {
      parsed.companyProfile = {
        businessName: "Samad Expo",
        legalName: "Samad Expo",
        tagline: "Building Digital Excellence — One Platform at a Time",
        about: "Samad Expo is a dynamic parent company that owns, operates, and manages a growing portfolio of websites, web applications, digital platforms, products, and services. We are committed to building innovative digital solutions that create value for businesses and individuals.",
        story: "Samad Expo was founded with a clear vision: to build a comprehensive digital business ecosystem that spans e-commerce, technology, digital platforms, and professional services. Starting with a single idea, we have grown into a multi-faceted organization with multiple business divisions and digital properties.",
        vision: "To become a leading digital business conglomerate that empowers businesses and individuals through innovative technology, premium products, and exceptional services.",
        mission: "To build, operate, and grow a diverse portfolio of digital businesses that deliver genuine value, foster innovation, and create meaningful opportunities.",
        coreValues: [
          { title: "Innovation", description: "We embrace new ideas and technologies to build better solutions.", icon: "Sparkles" },
          { title: "Integrity", description: "We operate with complete transparency and honesty in all our dealings.", icon: "ShieldCheck" },
          { title: "Excellence", description: "We strive for the highest standards in everything we build and deliver.", icon: "Award" },
          { title: "Impact", description: "We focus on creating meaningful, lasting value for our customers and partners.", icon: "Target" }
        ],
        founded: "2024",
        headquarters: "Agra, Uttar Pradesh",
        logo: "",
        favicon: "",
        brandColors: { primary: "#000000", accent: "#FFF33D" },
        brandFontFamily: "Inter, Arial, sans-serif",
        founderName: "Sabir Usmani",
        founderDesignation: "Founder & Owner",
        founderPhoto: "",
        founderBio: "Founder of Samad Expo.",
        founderMessage: "",
        achievements: [],
        futureRoadmap: "We are actively expanding our digital ecosystem with new platforms, products, and services. Our roadmap includes launching new e-commerce verticals, digital tools, educational platforms, and technology solutions across multiple industries.",
        contactEmail: "officialaadhakh@gmail.com",
        contactPhone: "+91 94582 04216",
        contactAddress: "Agra, Uttar Pradesh, India",
        socialLinks: {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: "https://www.facebook.com/profile.php?id=61595047961100",
          youtube: "",
          website: ""
        }
      };
      mutated = true;
    }

    // Apply the owner-provided profile details only over blank/default seed values.
    // Custom details already saved through the admin editor remain unchanged.
    const profile = parsed.companyProfile;
    if (!profile.founderName?.trim() || profile.founderName === "MD") {
      profile.founderName = "Sabir Usmani";
      mutated = true;
    }
    if (!profile.founderDesignation?.trim()) {
      profile.founderDesignation = "Founder & Owner";
      mutated = true;
    }
    if (!profile.founderBio?.trim() || profile.founderBio === seededFounderBio) {
      profile.founderBio = "Founder of Samad Expo.";
      mutated = true;
    }
    if (!profile.contactEmail?.trim() || profile.contactEmail === "contact@mdenterprises.in") {
      profile.contactEmail = "officialaadhakh@gmail.com";
      mutated = true;
    }
    if (!profile.contactPhone?.trim()) {
      profile.contactPhone = "+91 94582 04216";
      mutated = true;
    }
    if (!profile.contactAddress?.trim() || profile.contactAddress === "India") {
      profile.contactAddress = "Agra, Uttar Pradesh, India";
      mutated = true;
    }
    if (!profile.headquarters?.trim() || profile.headquarters === "India") {
      profile.headquarters = "Agra, Uttar Pradesh";
      mutated = true;
    }
    if (!profile.brandFontFamily?.trim() || profile.brandFontFamily === "Manrope, Arial, sans-serif") {
      profile.brandFontFamily = "Inter, Arial, sans-serif";
      mutated = true;
    }
    for (const member of parsed.teamMembers) {
      if (member.isFounder && (!member.name?.trim() || member.name === "MD")) {
        member.name = "Sabir Usmani";
        mutated = true;
      }
      if (member.isFounder && !member.bio?.trim()) {
        member.bio = "Founder of Samad Expo.";
        mutated = true;
      }
      if (member.isFounder && !member.socialLinks?.email?.trim()) {
        member.socialLinks = {
          linkedin: member.socialLinks?.linkedin || "",
          twitter: member.socialLinks?.twitter || "",
          instagram: member.socialLinks?.instagram || "",
          website: member.socialLinks?.website || "",
          email: "officialaadhakh@gmail.com",
        };
        mutated = true;
      }
    }

    // Add seed projects once without changing any matching listing.
    for (const project of seed.websiteListings) {
      const alreadyListed = parsed.websiteListings.some(
        (website) => (website.url || "").replace(/\/$/, "") === project.url.replace(/\/$/, "") || website.slug === project.slug
      );
      if (!alreadyListed) {
        parsed.websiteListings.push({ ...project, screenshots: [...project.screenshots], features: [...project.features], productsAndServices: [...project.productsAndServices] });
        mutated = true;
      }
    }

    // 6. Ensure hostedProjects, hostedDeployments, and hostedProjectFiles tables exist
    if (!Array.isArray(parsed.hostedProjects)) {
      parsed.hostedProjects = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.hostedDeployments)) {
      parsed.hostedDeployments = [];
      mutated = true;
    }
    if (!Array.isArray(parsed.hostedProjectFiles)) {
      parsed.hostedProjectFiles = [];
      mutated = true;
    }

    const seedProjects = [
      {
        id: "proj_age_calculator",
        userId: "usr_admin_01",
        userEmail: "officialaadhakh@gmail.com",
        userName: "Sabir Usmani",
        projectName: "MDK Chrono Age Calculator",
        slug: "mdk-chrono-age-calculator",
        description: "Precise chronological time calculation, leap years, days, hours, and life milestone analytics.",
        visibility: "public" as const,
        deploymentUrl: "https://sabirusmani077.github.io/Age-calculator/",
        deploymentStatus: "live" as const,
        thumbnail: "/images/project-age-calc.jpg",
        storageUsedBytes: 254000,
        totalDeployments: 1,
        viewCount: 1420,
        createdAt: "2024-06-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_mdk_convertor",
        userId: "usr_admin_01",
        userEmail: "officialaadhakh@gmail.com",
        userName: "Sabir Usmani",
        projectName: "MDK Unit & Media Convertor",
        slug: "mdk-convertor",
        description: "Fast, accurate unit, measurement, and binary mathematical converter for students and engineers.",
        visibility: "public" as const,
        deploymentUrl: "https://sabirusmani077.github.io/MDK-Convertor/",
        deploymentStatus: "live" as const,
        thumbnail: "/images/project-convertor.jpg",
        storageUsedBytes: 310000,
        totalDeployments: 1,
        viewCount: 980,
        createdAt: "2024-06-15T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_sabir_portfolio",
        userId: "usr_admin_01",
        userEmail: "officialaadhakh@gmail.com",
        userName: "Sabir Usmani",
        projectName: "Sabir Usmani Portfolio",
        slug: "sabir-usmani-portfolio",
        description: "Personal design portfolio, software engineering capabilities, and web showcase by Sabir Usmani.",
        visibility: "public" as const,
        deploymentUrl: "https://sabirusmani077.github.io/Self-Portfolio-/",
        deploymentStatus: "live" as const,
        thumbnail: "/images/project-portfolio.jpg",
        storageUsedBytes: 420000,
        totalDeployments: 1,
        viewCount: 2310,
        createdAt: "2024-07-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const sp of seedProjects) {
      if (!parsed.hostedProjects.some((p) => p.slug === sp.slug)) {
        parsed.hostedProjects.push(sp);
        mutated = true;
      }
    }

    if (mutated) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch {
    const initial = getInitialSeedData();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export function readDb(): DatabaseSchema {
  return ensureDatabaseInitialized();
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE_PATH}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE_PATH);
}

export function recordPageView(
  event: Omit<PageViewEvent, "id" | "createdAt">
): void {
  const db = readDb();
  if (!Array.isArray(db.pageViewEvents)) db.pageViewEvents = [];
  db.pageViewEvents.push({
    ...event,
    id: crypto.randomBytes(12).toString("hex"),
    createdAt: new Date().toISOString(),
  });
  if (db.pageViewEvents.length > 50_000) {
    db.pageViewEvents = db.pageViewEvents.slice(-50_000);
  }
  writeDb(db);
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _unused, ...rest } = user;
  void _unused;
  return rest;
}

// ============================================================================
// CATALOGUE QUERIES & FILTERS
// ============================================================================

export interface ProductQueryOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  featuredOnly?: boolean;
  newArrivalsOnly?: boolean;
  includeUnpublished?: boolean;
  vendorId?: string;
  approvalStatus?: string;
  page?: number;
  limit?: number;
}

export function queryProducts(options: ProductQueryOptions = {}) {
  const db = readDb();
  let items = db.products.filter((p) => {
    if (options.includeUnpublished) {
      if (options.vendorId && p.vendorId !== options.vendorId) return false;
      if (
        options.approvalStatus &&
        (p.approvalStatus || "approved") !== options.approvalStatus
      )
        return false;
      return true;
    }

    // Customer Storefront: must be published AND approved AND if vendor product, vendor must be approved
    if (!p.published) return false;
    const approval = p.approvalStatus || "approved";
    if (approval !== "approved") return false;
    if (p.vendorId) {
      const vendor = db.vendors?.find((v) => v.id === p.vendorId);
      if (!vendor || vendor.status !== "approved") return false;
    }
    return true;
  });

  // Storefront Demo Product Auto-Replacement:
  // As vendors/admins add approved real products, demo items automatically get displaced/hidden.
  if (!options.includeUnpublished) {
    const hideDemo = db.settings.hideDemoProducts === true;
    const autoReplace = db.settings.autoReplaceDemoProducts !== false;

    if (hideDemo) {
      // Store owner has toggled all demo items hidden
      items = items.filter((p) => !p.isDemo || !!p.vendorId);
    } else if (autoReplace) {
      // Count approved real products per category
      const realCountByCategory = new Map<string, number>();
      for (const p of items) {
        const isReal = !p.isDemo || !!p.vendorId;
        if (isReal) {
          const cat = p.categorySlug || "all";
          realCountByCategory.set(cat, (realCountByCategory.get(cat) || 0) + 1);
        }
      }

      // For every real product in a category, displace 1 demo product
      const demoSeenByCategory = new Map<string, number>();
      items = items.filter((p) => {
        const isReal = !p.isDemo || !!p.vendorId;
        if (isReal) return true; // Always display real products

        const cat = p.categorySlug || "all";
        const realCount = realCountByCategory.get(cat) || 0;
        const demoIndex = (demoSeenByCategory.get(cat) || 0) + 1;
        demoSeenByCategory.set(cat, demoIndex);

        // If realCount >= demoIndex, this demo product is displaced by real inventory
        return demoIndex > realCount;
      });
    }
  }

  if (options.category && options.category !== "all") {
    items = items.filter((p) => p.categorySlug === options.category);
  }

  if (options.search && options.search.trim().length > 0) {
    const q = options.search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  if (typeof options.minPrice === "number" && !Number.isNaN(options.minPrice)) {
    items = items.filter((p) => {
      const effectivePrice = p.discountedPrice ?? p.price;
      return effectivePrice >= options.minPrice!;
    });
  }

  if (typeof options.maxPrice === "number" && !Number.isNaN(options.maxPrice)) {
    items = items.filter((p) => {
      const effectivePrice = p.discountedPrice ?? p.price;
      return effectivePrice <= options.maxPrice!;
    });
  }

  if (options.inStockOnly) {
    items = items.filter((p) => p.stock > 0);
  }

  if (options.featuredOnly) {
    items = items.filter((p) => p.featured);
  }

  if (options.newArrivalsOnly) {
    items = items.filter((p) => p.isNewArrival);
  }

  // Sort: Real vendor/admin products always take priority over placeholder items
  const sortMode = options.sort || "newest";
  items = [...items].sort((a, b) => {
    const aIsReal = !a.isDemo || !!a.vendorId;
    const bIsReal = !b.isDemo || !!b.vendorId;
    if (aIsReal && !bIsReal) return -1;
    if (!aIsReal && bIsReal) return 1;

    const priceA = a.discountedPrice ?? a.price;
    const priceB = b.discountedPrice ?? b.price;
    if (sortMode === "price_asc") return priceA - priceB;
    if (sortMode === "price_desc") return priceB - priceA;
    if (sortMode === "popular") {
      if (b.salesCount !== a.salesCount) return b.salesCount - a.salesCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const total = items.length;
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 20);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = items.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

export function getProductBySlugOrId(identifier: string): Product | null {
  const db = readDb();
  return (
    db.products.find(
      (p) =>
        p.slug === identifier || p.id === identifier || p.sku === identifier
    ) || null
  );
}

// ============================================================================
// SERVER-SIDE CART & PRICING VALIDATION (Never trust client prices!)
// ============================================================================

export interface CartInputItem {
  productId: string;
  quantity: number;
  variantOption?: string;
}

export interface ServerCartCalculationResult {
  valid: boolean;
  errors: string[];
  items: OrderItem[];
  subtotal: number;
  discountCode: string | null;
  discountDescription: string | null;
  discountAmount: number;
  taxRatePercent: number;
  taxAmount: number;
  shippingAmount: number;
  freeShippingThreshold: number;
  totalAmount: number;
}

export function calculateItemCommission(
  lineTotal: number,
  ratePercent: number
): {
  lineTotalPaise: number;
  commissionPaise: number;
  vendorSharePaise: number;
  commissionAmount: number;
  vendorEarning: number;
} {
  const lineTotalPaise = Math.round(lineTotal * 100);
  const safeRate = Math.max(0, ratePercent);
  const commissionPaise = Math.round((lineTotalPaise * safeRate) / 100);
  const vendorSharePaise = Math.max(0, lineTotalPaise - commissionPaise);
  return {
    lineTotalPaise,
    commissionPaise,
    vendorSharePaise,
    commissionAmount: commissionPaise / 100,
    vendorEarning: vendorSharePaise / 100,
  };
}

export function calculateCartTotalsOnServer(
  rawItems: CartInputItem[],
  rawDiscountCode?: string | null
): ServerCartCalculationResult {
  const db = readDb();
  const settings = db.settings;
  const errors: string[] = [];
  const validatedItems: OrderItem[] = [];

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      valid: false,
      errors: ["Your shopping cart is empty."],
      items: [],
      subtotal: 0,
      discountCode: null,
      discountDescription: null,
      discountAmount: 0,
      taxRatePercent: settings.taxRatePercent,
      taxAmount: 0,
      shippingAmount: 0,
      freeShippingThreshold: settings.freeShippingThreshold,
      totalAmount: 0,
    };
  }

  for (const cartItem of rawItems) {
    const qty = Math.floor(Number(cartItem.quantity) || 0);
    if (qty <= 0) {
      errors.push("Item quantity must be at least 1.");
      continue;
    }

    const product = db.products.find(
      (p) =>
        p.id === cartItem.productId &&
        p.published &&
        (p.approvalStatus === "approved" || !p.approvalStatus)
    );
    if (!product) {
      errors.push(`Product (${cartItem.productId}) is no longer available.`);
      continue;
    }

    const vendor = product.vendorId
      ? db.vendors?.find((v) => v.id === product.vendorId)
      : null;
    if (product.vendorId && (!vendor || vendor.status !== "approved")) {
      errors.push(
        `Product "${product.name}" is unavailable because the vendor is pending verification.`
      );
      continue;
    }

    let variantModifier = 0;
    let availableStock = product.stock;

    if (cartItem.variantOption && product.variants.length > 0) {
      const matchedVariant = product.variants.find(
        (v) => v.option === cartItem.variantOption
      );
      if (matchedVariant) {
        variantModifier = matchedVariant.priceModifier || 0;
        availableStock = Math.min(product.stock, matchedVariant.stock);
      }
    }

    if (availableStock < qty) {
      errors.push(
        `Insufficient stock for "${product.name}"${
          cartItem.variantOption ? ` (${cartItem.variantOption})` : ""
        }. Available: ${availableStock}.`
      );
      continue;
    }

    const baseEffectivePrice = product.discountedPrice ?? product.price;
    const unitPrice = Math.max(0, baseEffectivePrice + variantModifier);
    const originalPrice = Math.max(0, product.price + variantModifier);
    const lineTotal = unitPrice * qty;

    const commissionRate = vendor
      ? vendor.commissionRatePercent
      : product.vendorId
      ? settings.defaultCommissionPercent || 7
      : 0;

    const calc = calculateItemCommission(lineTotal, commissionRate);
    const commissionAmount = product.vendorId ? calc.commissionAmount : 0;
    const vendorEarning = product.vendorId ? calc.vendorEarning : lineTotal;
    const commissionPaise = product.vendorId ? calc.commissionPaise : 0;
    const vendorEarningPaise = product.vendorId
      ? calc.vendorSharePaise
      : calc.lineTotalPaise;

    validatedItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      variantOption: cartItem.variantOption || product.variants[0]?.option,
      unitPrice,
      originalPrice,
      quantity: qty,
      lineTotal,
      vendorId: product.vendorId || null,
      vendorStoreName:
        product.vendorStoreName ||
        (vendor ? vendor.storeName : "MDK Direct"),
      commissionRate,
      commissionAmount,
      vendorEarning,
      commissionPaise,
      vendorEarningPaise,
      fulfillmentStatus: "pending",
    });
  }

  const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  let discountCode: string | null = null;
  let discountDescription: string | null = null;
  let discountAmount = 0;

  if (rawDiscountCode && rawDiscountCode.trim().length > 0) {
    const normalizedCode = rawDiscountCode.trim().toUpperCase();
    const matchedCode = db.discountCodes.find(
      (d) => d.code.toUpperCase() === normalizedCode && d.active
    );

    if (!matchedCode) {
      errors.push(`Discount code "${normalizedCode}" is invalid or inactive.`);
    } else if (subtotal < matchedCode.minOrderAmount) {
      errors.push(
        `Discount code "${normalizedCode}" requires a minimum subtotal of ₹${matchedCode.minOrderAmount.toLocaleString("en-IN")}.`
      );
    } else {
      discountCode = matchedCode.code;
      discountDescription = matchedCode.description;
      if (matchedCode.discountType === "percentage") {
        discountAmount = Math.round(
          (subtotal * matchedCode.discountValue) / 100
        );
        if (
          matchedCode.maxDiscountAmount !== null &&
          discountAmount > matchedCode.maxDiscountAmount
        ) {
          discountAmount = matchedCode.maxDiscountAmount;
        }
      } else {
        discountAmount = matchedCode.discountValue;
      }
      discountAmount = Math.min(discountAmount, subtotal);
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  // Calculate GST on taxable amount
  const taxAmount = Math.round(
    (taxableSubtotal * settings.taxRatePercent) / 100
  );

  const shippingAmount =
    taxableSubtotal === 0
      ? 0
      : taxableSubtotal >= settings.freeShippingThreshold
      ? 0
      : settings.standardShippingFee;

  const totalAmount = taxableSubtotal + taxAmount + shippingAmount;

  return {
    valid: errors.length === 0 && validatedItems.length > 0,
    errors,
    items: validatedItems,
    subtotal,
    discountCode,
    discountDescription,
    discountAmount,
    taxRatePercent: settings.taxRatePercent,
    taxAmount,
    shippingAmount,
    freeShippingThreshold: settings.freeShippingThreshold,
    totalAmount,
  };
}

// ============================================================================
// ORDER CREATION, IDEMPOTENCY & VERIFIED PAYMENT COMPLETION
// ============================================================================

export interface CreateOrderInput {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  orderNotes?: string;
  items: CartInputItem[];
  discountCode?: string | null;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  idempotencyKey: string;
  gatewayOrderId?: string;
}

export function createOrderOnServer(input: CreateOrderInput): {
  success: boolean;
  error?: string;
  order?: Order;
  isDuplicate?: boolean;
} {
  const db = readDb();

  // 1. Check idempotency key to prevent duplicate order creation
  const existingOrder = db.orders.find(
    (o) => o.idempotencyKey === input.idempotencyKey
  );
  if (existingOrder) {
    return {
      success: true,
      order: existingOrder,
      isDuplicate: true,
    };
  }

  // 2. Validate cart & calculate totals on server
  const calc = calculateCartTotalsOnServer(input.items, input.discountCode);
  if (!calc.valid) {
    return {
      success: false,
      error: calc.errors.join(" "),
    };
  }

  const isCod = input.paymentMethod === "cod";

  if (isCod) {
    if (db.settings.codEnabled === false) {
      return {
        success: false,
        error: "Cash on Delivery is currently disabled.",
      };
    }

    // Verify stock availability for COD order
    for (const item of calc.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${item.name}". Please adjust quantity.`,
        };
      }
    }

    // Deduct stock immediately for confirmed COD order
    for (const item of calc.items) {
      const product = db.products.find((p) => p.id === item.productId)!;
      product.stock = Math.max(0, product.stock - item.quantity);
      product.salesCount += item.quantity;
      if (item.variantOption && product.variants?.length > 0) {
        const variant = product.variants.find((v) => v.option === item.variantOption);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }

    // Increment discount usage if promo applied
    if (calc.discountCode) {
      const disc = db.discountCodes.find(
        (d) => d.code.toUpperCase() === calc.discountCode!.toUpperCase()
      );
      if (disc) {
        disc.usageCount += 1;
      }
    }
  }

  const now = new Date().toISOString();
  const orderNumber = generateOrderReference();
  const trackingToken = generateTrackingToken();
  const gatewayOrderId =
    input.gatewayOrderId ||
    (isCod
      ? `cod_${crypto.randomBytes(6).toString("hex")}`
      : `order_${crypto.randomBytes(8).toString("hex")}`);

  const paymentProvider = isCod ? "cod" : db.settings.paymentProvider;
  const paymentStatus = isCod ? "pending" : "awaiting_payment";
  const orderStatus = isCod ? "Confirmed" : "Awaiting Payment";

  const newOrder: Order = {
    id: `ord_${crypto.randomBytes(8).toString("hex")}`,
    orderNumber,
    trackingToken,
    userId: input.userId || null,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress || input.shippingAddress,
    orderNotes: input.orderNotes?.trim() || "",
    items: calc.items,
    subtotal: calc.subtotal,
    discountCode: calc.discountCode,
    discountAmount: calc.discountAmount,
    taxAmount: calc.taxAmount,
    shippingAmount: calc.shippingAmount,
    totalAmount: calc.totalAmount,
    paymentMethod: input.paymentMethod,
    paymentProvider,
    paymentStatus,
    orderStatus,
    gatewayOrderId,
    gatewayPaymentId: isCod ? `cod_pay_${orderNumber}` : null,
    gatewaySignature: null,
    refundReference: null,
    refundReason: null,
    idempotencyKey: input.idempotencyKey,
    inventoryDeducted: isCod,
    emailNotificationStatus: process.env.SMTP_HOST ? "sent" : "not_configured",
    statusHistory: [
      {
        status: orderStatus,
        paymentStatus,
        note: isCod
          ? `Cash on Delivery order placed and confirmed! Keep ₹${calc.totalAmount.toLocaleString("en-IN")} ready upon arrival.`
          : `Order created and payment session (${gatewayOrderId}) initialized on server.`,
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  return {
    success: true,
    order: newOrder,
  };
}

export interface VerifyPaymentInput {
  orderNumber: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  outcome: "success" | "pending" | "failed" | "cancelled";
}

export function verifyAndProcessPayment(input: VerifyPaymentInput): {
  success: boolean;
  error?: string;
  order?: Order;
} {
  const db = readDb();
  const orderIndex = db.orders.findIndex(
    (o) =>
      o.orderNumber === input.orderNumber &&
      o.gatewayOrderId === input.gatewayOrderId
  );

  if (orderIndex === -1) {
    return {
      success: false,
      error: "Order or payment session not found.",
    };
  }

  const order = db.orders[orderIndex];

  // Idempotency guard: if already paid with the same payment ID, return immediately without double-deducting stock
  if (
    order.paymentStatus === "paid" &&
    order.gatewayPaymentId === input.gatewayPaymentId
  ) {
    return {
      success: true,
      order,
    };
  }

  // If already paid with any payment ID, prevent overwriting with failed/duplicate state
  if (order.paymentStatus === "paid") {
    return {
      success: true,
      order,
    };
  }

  const now = new Date().toISOString();

  if (input.outcome === "cancelled") {
    order.paymentStatus = "cancelled";
    order.orderStatus = "Cancelled";
    order.updatedAt = now;
    order.statusHistory.push({
      status: "Cancelled",
      paymentStatus: "cancelled",
      note: "Payment was cancelled by customer at checkout.",
      timestamp: now,
    });
    writeDb(db);
    return { success: true, order };
  }

  if (input.outcome === "failed") {
    order.paymentStatus = "failed";
    order.orderStatus = "Awaiting Payment";
    order.gatewayPaymentId = input.gatewayPaymentId || null;
    order.updatedAt = now;
    order.statusHistory.push({
      status: "Awaiting Payment",
      paymentStatus: "failed",
      note: `Payment attempt (${input.gatewayPaymentId || "N/A"}) failed verification or was declined. Customer can retry payment.`,
      timestamp: now,
    });
    writeDb(db);
    return { success: true, order };
  }

  // For "success" or "pending", verify cryptographic HMAC signature
  const signatureValid = verifyPaymentSignature(
    input.gatewayOrderId,
    input.gatewayPaymentId,
    input.gatewaySignature
  );

  if (!signatureValid) {
    order.paymentStatus = "failed";
    order.updatedAt = now;
    order.statusHistory.push({
      status: order.orderStatus,
      paymentStatus: "failed",
      note: "Cryptographic payment signature verification failed.",
      timestamp: now,
    });
    writeDb(db);
    return {
      success: false,
      error: "Payment signature verification failed. Transaction rejected.",
    };
  }

  if (input.outcome === "pending") {
    order.paymentStatus = "pending";
    order.orderStatus = "Payment Pending";
    order.gatewayPaymentId = input.gatewayPaymentId;
    order.gatewaySignature = input.gatewaySignature;
    order.updatedAt = now;
    order.statusHistory.push({
      status: "Payment Pending",
      paymentStatus: "pending",
      note: `Payment (${input.gatewayPaymentId}) received and awaiting bank settlement confirmation.`,
      timestamp: now,
    });
    writeDb(db);
    return { success: true, order };
  }

  // Outcome === "success" and signature is cryptographically verified!
  // Atomically check and deduct stock if not already deducted
  if (!order.inventoryDeducted) {
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          error: `Inventory became unavailable for "${item.name}" prior to payment confirmation.`,
        };
      }
    }

    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId)!;
      product.stock = Math.max(0, product.stock - item.quantity);
      product.salesCount += item.quantity;
      if (item.variantOption && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) => v.option === item.variantOption
        );
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }

    if (order.discountCode) {
      const disc = db.discountCodes.find(
        (d) => d.code.toUpperCase() === order.discountCode!.toUpperCase()
      );
      if (disc) {
        disc.usageCount += 1;
      }
    }

    order.inventoryDeducted = true;
  }

  order.paymentStatus = "paid";
  order.orderStatus = "Confirmed";
  order.escrowStatus = "held_in_escrow";
  order.gatewayPaymentId = input.gatewayPaymentId;
  order.gatewaySignature = input.gatewaySignature;
  order.updatedAt = now;

  // Credit vendor pending balances for paid order items (held in return window)
  for (const item of order.items) {
    if (item.vendorId) {
      const vendor = db.vendors?.find((v) => v.id === item.vendorId);
      if (vendor) {
        const earning =
          typeof item.vendorEarning === "number"
            ? item.vendorEarning
            : item.lineTotal - (item.commissionAmount || 0);
        vendor.totalEarnings = (vendor.totalEarnings || 0) + earning;
        vendor.pendingBalance = (vendor.pendingBalance || 0) + earning;
        vendor.updatedAt = now;

        if (!Array.isArray(db.financialLedger)) {
          db.financialLedger = [];
        }
        db.financialLedger.push({
          id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          vendorId: vendor.id,
          vendorStoreName: vendor.storeName,
          type: "order_escrow",
          grossAmountPaise: Math.round(item.lineTotal * 100),
          commissionRatePercent: item.commissionRate || 7,
          commissionAmountPaise:
            item.commissionPaise ||
            Math.round((item.commissionAmount || 0) * 100),
          vendorSharePaise:
            item.vendorEarningPaise || Math.round(earning * 100),
          note: `Order ${order.orderNumber} confirmed & paid. Vendor share ₹${earning.toFixed(
            2
          )} held in return inspection window.`,
          status: "pending",
          createdAt: now,
        });
      }
    }
  }

  order.statusHistory.push({
    status: "Confirmed",
    paymentStatus: "paid",
    note: `Payment verified via HMAC-SHA256 (${input.gatewayPaymentId}). Inventory reserved and order confirmed.`,
    timestamp: now,
  });

  writeDb(db);
  return {
    success: true,
    order,
  };
}

export function createSandboxSignatureForOrder(
  gatewayOrderId: string,
  gatewayPaymentId: string
): string {
  return computePaymentSignature(gatewayOrderId, gatewayPaymentId);
}

export function matureOrderEarnings(
  orderId?: string
): { maturedOrdersCount: number; maturedItemsCount: number } {
  const db = readDb();
  const now = new Date();
  const nowMs = now.getTime();
  let maturedOrdersCount = 0;
  let maturedItemsCount = 0;

  for (const order of db.orders) {
    if (orderId && order.id !== orderId && order.orderNumber !== orderId) {
      continue;
    }

    if (
      order.paymentStatus === "paid" &&
      order.orderStatus === "Delivered" &&
      order.escrowStatus === "held_in_escrow"
    ) {
      const returnEndsMs = order.returnWindowEndsAt
        ? new Date(order.returnWindowEndsAt).getTime()
        : 0;
      const isWindowCleared =
        !order.returnWindowEndsAt || returnEndsMs <= nowMs || Boolean(orderId);

      if (isWindowCleared) {
        for (const item of order.items) {
          if (item.vendorId) {
            const vendor = db.vendors?.find((v) => v.id === item.vendorId);
            if (vendor) {
              const earning =
                typeof item.vendorEarning === "number"
                  ? item.vendorEarning
                  : item.lineTotal - (item.commissionAmount || 0);

              vendor.pendingBalance = Math.max(
                0,
                (vendor.pendingBalance || 0) - earning
              );
              vendor.withdrawableBalance =
                (vendor.withdrawableBalance || 0) + earning;
              vendor.updatedAt = now.toISOString();
              maturedItemsCount++;

              if (!Array.isArray(db.financialLedger)) {
                db.financialLedger = [];
              }
              db.financialLedger.push({
                id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
                orderId: order.id,
                orderNumber: order.orderNumber,
                vendorId: vendor.id,
                vendorStoreName: vendor.storeName,
                type: "commission_earned",
                grossAmountPaise: Math.round(item.lineTotal * 100),
                commissionRatePercent: item.commissionRate || 7,
                commissionAmountPaise:
                  item.commissionPaise ||
                  Math.round((item.commissionAmount || 0) * 100),
                vendorSharePaise:
                  item.vendorEarningPaise || Math.round(earning * 100),
                note: `Order ${order.orderNumber} delivered and inspection window cleared. Commission ₹${(
                  item.commissionAmount || 0
                ).toFixed(2)} earned and vendor share ₹${earning.toFixed(
                  2
                )} unlocked.`,
                status: "settled",
                createdAt: now.toISOString(),
              });
            }
          }
        }
        order.escrowStatus = "matured";
        order.updatedAt = now.toISOString();
        order.statusHistory.push({
          status: order.orderStatus,
          paymentStatus: order.paymentStatus,
          note: "Return and inspection window completed without dispute. Marketplace commission realized and vendor balance unlocked.",
          timestamp: now.toISOString(),
        });
        maturedOrdersCount++;
      }
    }
  }

  if (maturedOrdersCount > 0) {
    writeDb(db);
  }
  return { maturedOrdersCount, maturedItemsCount };
}

export function processOrderRefund(
  orderId: string,
  refundAmountPaise?: number,
  reason?: string
): { success: boolean; order?: Order; error?: string } {
  const db = readDb();
  const order = db.orders.find(
    (o) => o.id === orderId || o.orderNumber === orderId
  );
  if (!order) return { success: false, error: "Order not found." };

  if (
    order.paymentStatus !== "paid" &&
    order.paymentStatus !== "refund_pending"
  ) {
    return {
      success: false,
      error: `Order payment status is ${order.paymentStatus}, not eligible for refund.`,
    };
  }

  const now = new Date().toISOString();
  const orderTotalPaise = Math.round(order.totalAmount * 100);
  const actualRefundPaise =
    refundAmountPaise !== undefined && refundAmountPaise > 0
      ? Math.min(refundAmountPaise, orderTotalPaise)
      : orderTotalPaise;
  const isFullRefund = actualRefundPaise >= orderTotalPaise;
  const refundProportion =
    orderTotalPaise > 0 ? actualRefundPaise / orderTotalPaise : 1;

  for (const item of order.items) {
    if (item.vendorId) {
      const vendor = db.vendors?.find((v) => v.id === item.vendorId);
      if (vendor) {
        const itemTotalPaise = Math.round(item.lineTotal * 100);
        const itemRefundPaise = Math.round(itemTotalPaise * refundProportion);
        const itemCommissionRefundPaise = Math.round(
          (itemRefundPaise * (item.commissionRate || 7)) / 100
        );
        const itemVendorRefundPaise =
          itemRefundPaise - itemCommissionRefundPaise;
        const vendorDeduction = itemVendorRefundPaise / 100;

        if (order.escrowStatus === "matured") {
          vendor.withdrawableBalance = Math.max(
            0,
            (vendor.withdrawableBalance || 0) - vendorDeduction
          );
        } else {
          vendor.pendingBalance = Math.max(
            0,
            (vendor.pendingBalance || 0) - vendorDeduction
          );
        }
        vendor.totalEarnings = Math.max(
          0,
          (vendor.totalEarnings || 0) - vendorDeduction
        );
        vendor.updatedAt = now;

        if (!Array.isArray(db.financialLedger)) {
          db.financialLedger = [];
        }
        db.financialLedger.push({
          id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          vendorId: vendor.id,
          vendorStoreName: vendor.storeName,
          type: "refund_reversal",
          grossAmountPaise: -itemRefundPaise,
          commissionRatePercent: item.commissionRate || 7,
          commissionAmountPaise: -itemCommissionRefundPaise,
          vendorSharePaise: -itemVendorRefundPaise,
          note: `Refund of ₹${(actualRefundPaise / 100).toFixed(
            2
          )} processed for Order ${order.orderNumber}. Commission reversed: ₹${(
            itemCommissionRefundPaise / 100
          ).toFixed(2)}. Vendor deduction: ₹${vendorDeduction.toFixed(
            2
          )}. Reason: ${reason || "Customer refund"}`,
          status: "reversed",
          createdAt: now,
        });
      }
    }
  }

  // Restore inventory if full refund
  if (isFullRefund && order.inventoryDeducted) {
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
        product.salesCount = Math.max(0, product.salesCount - item.quantity);
      }
    }
    order.inventoryDeducted = false;
  }

  order.paymentStatus = isFullRefund ? "refunded" : "refund_pending";
  order.orderStatus = isFullRefund ? "Refunded" : order.orderStatus;
  order.escrowStatus = isFullRefund ? "refunded" : "partially_refunded";
  order.refundReference = `rfnd_${crypto.randomBytes(6).toString("hex")}`;
  order.refundReason = reason || "Customer refund processed.";
  order.updatedAt = now;
  order.statusHistory.push({
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    note: `Refund of ₹${(actualRefundPaise / 100).toFixed(
      2
    )} processed (Ref: ${order.refundReference}). Reason: ${order.refundReason}`,
    timestamp: now,
  });

  writeDb(db);
  return { success: true, order };
}

export function updateOrderAdminStatus(
  orderId: string,
  updates: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    courierName?: string;
    refundReason?: string;
    note?: string;
  }
): Order | null {
  const db = readDb();
  const order = db.orders.find(
    (o) => o.id === orderId || o.orderNumber === orderId
  );
  if (!order) return null;

  const now = new Date().toISOString();

  if (updates.orderStatus) {
    order.orderStatus = updates.orderStatus;
    if (updates.orderStatus === "Delivered") {
      order.deliveredAt = now;
      const windowDays = db.settings.returnWindowDays || 7;
      order.returnWindowEndsAt = new Date(
        Date.now() + windowDays * 24 * 60 * 60 * 1000
      ).toISOString();
      for (const item of order.items) {
        item.fulfillmentStatus = "delivered";
        item.deliveredAt = now;
        item.returnWindowEndsAt = order.returnWindowEndsAt;
      }
    }
  }
  if (updates.paymentStatus) {
    order.paymentStatus = updates.paymentStatus;
  }
  if (typeof updates.trackingNumber === "string") {
    order.trackingNumber = updates.trackingNumber;
  }
  if (typeof updates.courierName === "string") {
    order.courierName = updates.courierName;
  }
  if (updates.refundReason) {
    order.refundReason = updates.refundReason;
  }

  // Handle refund via processOrderRefund logic if requested
  if (order.orderStatus === "Refunded") {
    writeDb(db);
    const refundResult = processOrderRefund(
      order.id,
      undefined,
      updates.refundReason || updates.note
    );
    return refundResult.order || order;
  }

  // Handle cancellation stock and ledger restoration
  if (order.orderStatus === "Cancelled") {
    if (order.inventoryDeducted) {
      for (const item of order.items) {
        const product = db.products.find((p) => p.id === item.productId);
        if (product) {
          product.stock += item.quantity;
          product.salesCount = Math.max(0, product.salesCount - item.quantity);
        }
      }
      order.inventoryDeducted = false;
    }

    if (order.paymentStatus === "paid") {
      for (const item of order.items) {
        if (item.vendorId) {
          const vendor = db.vendors?.find((v) => v.id === item.vendorId);
          if (vendor) {
            const earning =
              typeof item.vendorEarning === "number"
                ? item.vendorEarning
                : item.lineTotal - (item.commissionAmount || 0);

            if (order.escrowStatus === "matured") {
              vendor.withdrawableBalance = Math.max(
                0,
                (vendor.withdrawableBalance || 0) - earning
              );
            } else {
              vendor.pendingBalance = Math.max(
                0,
                (vendor.pendingBalance || 0) - earning
              );
            }
            vendor.totalEarnings = Math.max(
              0,
              (vendor.totalEarnings || 0) - earning
            );
            vendor.updatedAt = now;

            if (!Array.isArray(db.financialLedger)) {
              db.financialLedger = [];
            }
            db.financialLedger.push({
              id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
              orderId: order.id,
              orderNumber: order.orderNumber,
              vendorId: vendor.id,
              vendorStoreName: vendor.storeName,
              type: "cancellation_reversal",
              grossAmountPaise: -Math.round(item.lineTotal * 100),
              commissionRatePercent: item.commissionRate || 7,
              commissionAmountPaise: -Math.round(
                (item.commissionAmount || 0) * 100
              ),
              vendorSharePaise: -Math.round(earning * 100),
              note: `Order ${order.orderNumber} cancelled. Vendor pending share of ₹${earning.toFixed(
                2
              )} and commission reversed.`,
              status: "reversed",
              createdAt: now,
            });
          }
        }
      }
      order.paymentStatus = "cancelled";
      order.escrowStatus = "cancelled";
    }
  }

  order.updatedAt = now;
  order.statusHistory.push({
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    note:
      updates.note ||
      `Order updated to "${order.orderStatus}" (Payment: ${order.paymentStatus}) by Administrator.`,
    timestamp: now,
  });

  writeDb(db);
  return order;
}

// ============================================================================
// VENDOR PORTAL & MARKETPLACE OPERATIONS
// ============================================================================

export function getVendorByUserId(userId: string): Vendor | undefined {
  const db = readDb();
  return db.vendors?.find((v) => v.userId === userId);
}

export function getVendorById(vendorId: string): Vendor | undefined {
  const db = readDb();
  return db.vendors?.find((v) => v.id === vendorId);
}

export function createVendorProfile(data: {
  userId: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  city: string;
  state: string;
  postalCode: string;
  gstin?: string;
  panNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
}): Vendor {
  const db = readDb();
  const id = `vnd_${crypto.randomBytes(4).toString("hex")}`;
  const slug = data.storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newVendor: Vendor = {
    id,
    userId: data.userId,
    storeName: data.storeName,
    slug: `${slug}-${id.slice(-4)}`,
    ownerName: data.ownerName,
    email: data.email,
    phone: data.phone,
    businessAddress: data.businessAddress,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    gstin: data.gstin,
    panNumber: data.panNumber,
    bankAccountName: data.bankAccountName,
    bankAccountNumber: data.bankAccountNumber,
    bankIfsc: data.bankIfsc,
    commissionRatePercent: db.settings.defaultCommissionPercent || 7,
    status: db.settings.vendorAutoApproval ? "approved" : "pending",
    totalEarnings: 0,
    pendingBalance: 0,
    withdrawableBalance: 0,
    totalWithdrawn: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!Array.isArray(db.vendors)) {
    db.vendors = [];
  }
  db.vendors.push(newVendor);

  // Link to user record
  const user = db.users.find((u) => u.id === data.userId);
  if (user) {
    user.vendorId = id;
    user.role = "vendor";
    user.updatedAt = new Date().toISOString();
  }

  writeDb(db);
  return newVendor;
}

export function updateVendorProfile(
  vendorId: string,
  updates: Partial<Vendor>
): Vendor | null {
  const db = readDb();
  const vendor = db.vendors?.find((v) => v.id === vendorId);
  if (!vendor) return null;

  Object.assign(vendor, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  writeDb(db);
  return vendor;
}

export function moderateVendorStatus(
  vendorId: string,
  status: VendorStatus,
  rejectionReason?: string,
  commissionRatePercent?: number
): Vendor | null {
  const db = readDb();
  const vendor = db.vendors?.find((v) => v.id === vendorId);
  if (!vendor) return null;

  vendor.status = status;
  if (rejectionReason !== undefined) {
    vendor.rejectionReason = rejectionReason;
  }
  if (typeof commissionRatePercent === "number" && commissionRatePercent >= 0) {
    vendor.commissionRatePercent = commissionRatePercent;
  }
  vendor.updatedAt = new Date().toISOString();

  // If vendor is suspended, auto unpublish vendor's products
  if (status === "suspended") {
    for (const p of db.products) {
      if (p.vendorId === vendorId) {
        p.published = false;
        p.approvalStatus = "suspended";
      }
    }
  }

  writeDb(db);
  return vendor;
}

export function moderateProduct(
  productId: string,
  action: "approve" | "reject" | "suspend" | "publish" | "unpublish",
  reason?: string,
  feedback?: string
): Product | null {
  const db = readDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return null;

  const now = new Date().toISOString();

  if (action === "approve") {
    product.approvalStatus = "approved";
    product.published = true;
    product.rejectionReason = undefined;
    product.adminFeedback = feedback;
  } else if (action === "reject") {
    product.approvalStatus = "rejected";
    product.published = false;
    product.rejectionReason =
      reason || "Does not meet marketplace catalogue standards.";
    product.adminFeedback = feedback;
  } else if (action === "suspend") {
    product.approvalStatus = "suspended";
    product.published = false;
    product.adminFeedback = feedback || reason;
  } else if (action === "publish") {
    if (product.approvalStatus === "approved") {
      product.published = true;
    }
  } else if (action === "unpublish") {
    product.published = false;
  }

  product.updatedAt = now;
  writeDb(db);
  return product;
}

export function requestVendorPayout(
  vendorId: string,
  amount: number,
  bankDetails: string
): { success: boolean; payout?: VendorPayout; error?: string } {
  const db = readDb();
  const vendor = db.vendors?.find((v) => v.id === vendorId);
  if (!vendor) return { success: false, error: "Vendor not found." };

  if (vendor.status !== "approved") {
    return {
      success: false,
      error: "Only verified approved vendors can request settlements.",
    };
  }

  if (amount <= 0 || amount > vendor.withdrawableBalance) {
    return {
      success: false,
      error: `Requested amount (₹${amount}) exceeds available withdrawable balance (₹${vendor.withdrawableBalance}).`,
    };
  }

  // Deduct from withdrawable balance immediately to prevent double-spending
  vendor.withdrawableBalance -= amount;
  vendor.updatedAt = new Date().toISOString();

  const newPayout: VendorPayout = {
    id: `payout_${crypto.randomBytes(4).toString("hex")}`,
    vendorId,
    vendorStoreName: vendor.storeName,
    amount,
    bankAccountDetails: bankDetails,
    status: "requested",
    requestedAt: new Date().toISOString(),
  };

  if (!Array.isArray(db.payouts)) {
    db.payouts = [];
  }
  db.payouts.unshift(newPayout);

  if (!Array.isArray(db.financialLedger)) {
    db.financialLedger = [];
  }
  db.financialLedger.push({
    id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
    vendorId,
    vendorStoreName: vendor.storeName,
    type: "payout_requested",
    grossAmountPaise: Math.round(amount * 100),
    commissionRatePercent: vendor.commissionRatePercent || 7,
    commissionAmountPaise: 0,
    vendorSharePaise: Math.round(amount * 100),
    note: `Vendor requested payout of ₹${amount.toFixed(2)} to account ${bankDetails}.`,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  writeDb(db);

  return { success: true, payout: newPayout };
}

export function processVendorPayout(
  payoutId: string,
  action: "completed" | "rejected",
  reference?: string,
  adminNotes?: string
): { success: boolean; payout?: VendorPayout; error?: string } {
  const db = readDb();
  const payout = db.payouts?.find((p) => p.id === payoutId);
  if (!payout) return { success: false, error: "Payout request not found." };

  if (payout.status !== "requested" && payout.status !== "processing") {
    return {
      success: false,
      error: `Payout request is already ${payout.status}.`,
    };
  }

  const vendor = db.vendors?.find((v) => v.id === payout.vendorId);
  const now = new Date().toISOString();

  if (action === "completed") {
    payout.status = "completed";
    payout.transactionReference =
      reference ||
      `CMS_NEFT_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    payout.adminNotes = adminNotes;
    payout.processedAt = now;
    if (vendor) {
      vendor.totalWithdrawn = (vendor.totalWithdrawn || 0) + payout.amount;
      vendor.updatedAt = now;
    }

    if (!Array.isArray(db.financialLedger)) {
      db.financialLedger = [];
    }
    db.financialLedger.push({
      id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
      vendorId: payout.vendorId,
      vendorStoreName: payout.vendorStoreName,
      type: "payout_settled",
      grossAmountPaise: Math.round(payout.amount * 100),
      commissionRatePercent: vendor?.commissionRatePercent || 7,
      commissionAmountPaise: 0,
      vendorSharePaise: Math.round(payout.amount * 100),
      note: `Payout of ₹${payout.amount.toFixed(2)} completed. Bank UTR / Ref: ${payout.transactionReference}. Note: ${adminNotes || ""}`,
      status: "settled",
      createdAt: now,
    });
  } else if (action === "rejected") {
    payout.status = "rejected";
    payout.adminNotes = adminNotes || "Payout request was rejected.";
    payout.processedAt = now;
    // Refund amount back to vendor's withdrawable balance
    if (vendor) {
      vendor.withdrawableBalance += payout.amount;
      vendor.updatedAt = now;
    }

    if (!Array.isArray(db.financialLedger)) {
      db.financialLedger = [];
    }
    db.financialLedger.push({
      id: `ledg_${crypto.randomUUID().slice(0, 8)}`,
      vendorId: payout.vendorId,
      vendorStoreName: payout.vendorStoreName,
      type: "payout_rejected",
      grossAmountPaise: Math.round(payout.amount * 100),
      commissionRatePercent: vendor?.commissionRatePercent || 7,
      commissionAmountPaise: 0,
      vendorSharePaise: Math.round(payout.amount * 100),
      note: `Payout of ₹${payout.amount.toFixed(2)} rejected. Restored to vendor withdrawable balance. Reason: ${adminNotes || ""}`,
      status: "failed",
      createdAt: now,
    });
  }

  writeDb(db);
  return { success: true, payout };
}

// ============================================================================
// DEMO PRODUCTS & REPLACEMENT HELPERS
// ============================================================================

export function purgeDemoProducts(): { purgedCount: number; remainingCount: number } {
  const db = readDb();
  const countBefore = db.products.length;
  // Retain non-demo products and genuine vendor-listed items
  db.products = db.products.filter((p) => !p.isDemo || !!p.vendorId);
  db.settings.demoPurged = true;
  writeDb(db);
  const purgedCount = countBefore - db.products.length;
  return { purgedCount, remainingCount: db.products.length };
}

export function getDemoProductStats() {
  const db = readDb();
  const total = db.products.length;
  const demoCount = db.products.filter((p) => p.isDemo && !p.vendorId).length;
  const realCount = total - demoCount;
  return {
    total,
    demoCount,
    realCount,
    autoReplaceEnabled: db.settings.autoReplaceDemoProducts !== false,
    hideDemoEnabled: db.settings.hideDemoProducts === true,
  };
}

export type {
  Category,
  CustomerInquiry,
  DiscountCode,
  FAQItem,
  Order,
  Product,
  ProductStatus,
  StoreSettings,
  Vendor,
  VendorPayout,
  VendorStatus,
  VerifiedReview,
};
