export type UserRole = "customer" | "vendor" | "admin";

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  privacyConsent: boolean;
  savedAddresses: SavedAddress[];
  vendorId?: string; // Links user to their Vendor profile if role === "vendor"
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";

export interface Vendor {
  id: string; // e.g., "vnd_..."
  userId: string;
  storeName: string;
  slug: string;
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
  commissionRatePercent: number; // default 7% (MDK 7%, Vendor 93%)
  status: VendorStatus;
  rejectionReason?: string;
  totalEarnings: number;
  pendingBalance: number; // in return/inspection window
  withdrawableBalance: number; // matured & available for withdrawal
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  subtitle: string;
  image: string;
  featured: boolean;
  bentoPosition: number; // 1 = large tall left, 2 = top mid, 3 = bottom mid, 4 = top right, 5 = bottom right
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Finish / Edition"
  option: string; // e.g., "Matte Charcoal", "Brushed Silver"
  priceModifier: number; // 0 or additional INR
  stock: number;
  skuSuffix: string;
}

export type ProductStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "suspended"
  | "archived";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountedPrice: number | null;
  costPrice?: number;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  images: string[];
  stock: number;
  variants: ProductVariant[];
  weight: string;
  dimensions: string;
  shippingEligible: boolean;
  specifications: Record<string, string>;
  vendorId?: string | null; // null for MDK Direct official products
  vendorStoreName?: string;
  approvalStatus?: ProductStatus;
  rejectionReason?: string;
  adminFeedback?: string;
  hsnCode?: string;
  warranty?: string;
  codAvailable?: boolean;
  published: boolean;
  featured: boolean;
  isNewArrival: boolean;
  isDemo: boolean;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  active: boolean;
  usageCount: number;
  createdAt: string;
}

export type PaymentStatus =
  | "awaiting_payment"
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refund_pending"
  | "refunded";

export type OrderStatus =
  | "Awaiting Payment"
  | "Payment Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refund Pending"
  | "Refunded";

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  image: string;
  variantOption?: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  lineTotal: number;
  vendorId?: string | null;
  vendorStoreName?: string;
  commissionRate?: number;
  commissionAmount?: number;
  vendorEarning?: number;
  commissionPaise?: number; // Integer paise e.g. 7000 for ₹70.00
  vendorEarningPaise?: number; // Integer paise e.g. 93000 for ₹930.00
  fulfillmentStatus?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  trackingNumber?: string;
  courierName?: string;
  deliveredAt?: string;
  returnWindowEndsAt?: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingToken: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  paymentProvider: "razorpay" | "cashfree" | "cod";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  gatewaySignature: string | null;
  refundReference: string | null;
  refundReason: string | null;
  idempotencyKey: string;
  inventoryDeducted: boolean;
  emailNotificationStatus: "sent" | "not_configured" | "failed";
  trackingNumber?: string;
  courierName?: string;
  deliveredAt?: string;
  returnWindowEndsAt?: string;
  escrowStatus?: "held_in_escrow" | "matured" | "partially_refunded" | "refunded" | "cancelled";
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface VerifiedReview {
  id: string;
  productId: string;
  orderId: string;
  userId: string | null;
  customerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  category: "Orders & Delivery" | "Payments & Pricing" | "Returns & Refunds" | "Products & Account";
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

export interface SocialLinksConfig {
  whatsappNumber: string; // e.g. "919876543210" when configured by owner, or configurable via Admin
  whatsappDefaultMessage: string;
  whatsappEnabled: boolean;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  x: string;
  telegram: string;
}

export type PayoutStatus =
  | "requested"
  | "processing"
  | "completed"
  | "rejected";

export interface VendorPayout {
  id: string; // e.g., "payout_..."
  vendorId: string;
  vendorStoreName: string;
  amount: number;
  bankAccountDetails: string;
  status: PayoutStatus;
  transactionReference?: string;
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  businessHours: string;
  gstinPlaceholder: string;
  currency: string;
  currencySymbol: string;
  taxRatePercent: number; // e.g., 18% GST
  standardShippingFee: number; // e.g., ₹99
  freeShippingThreshold: number; // e.g., ₹999
  estimatedDeliveryDays: string; // e.g., "3–6 Business Days across India"
  returnWindowDays: number; // e.g., 7 days
  paymentMode: "sandbox" | "live";
  paymentProvider: "razorpay" | "cashfree";
  demoModeNotice: boolean;
  defaultCommissionPercent: number; // default marketplace commission: 7%
  vendorAutoApproval: boolean;
  codEnabled: boolean; // Cash on delivery support
  codFee: number; // e.g. 0 or ₹49
  autoReplaceDemoProducts: boolean; // Auto-replace demo products as vendors add real products
  hideDemoProducts: boolean; // Completely hide all demo products
  demoPurged?: boolean; // Set to true when admin purges seed demo products
  socialLinks: SocialLinksConfig;
}

export interface FinancialLedgerEntry {
  id: string;
  orderId?: string;
  orderNumber?: string;
  vendorId?: string;
  vendorStoreName?: string;
  type:
    | "order_escrow"
    | "commission_earned"
    | "vendor_matured"
    | "refund_reversal"
    | "cancellation_reversal"
    | "payout_requested"
    | "payout_settled"
    | "payout_rejected";
  grossAmountPaise: number;
  commissionRatePercent: number;
  commissionAmountPaise: number;
  vendorSharePaise: number;
  note: string;
  idempotencyKey?: string;
  status: "pending" | "settled" | "reversed" | "failed";
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface WebhookEventRecord {
  id: string;
  eventId: string;
  event: string;
  provider: "razorpay" | "cashfree";
  processedAt: string;
}

export interface DatabaseSchema {
  users: User[];
  vendors: Vendor[];
  products: Product[];
  categories: Category[];
  discountCodes: DiscountCode[];
  orders: Order[];
  payouts: VendorPayout[];
  reviews: VerifiedReview[];
  inquiries: CustomerInquiry[];
  faqs: FAQItem[];
  settings: StoreSettings;
  financialLedger: FinancialLedgerEntry[];
  auditLogs: AuditLogEntry[];
  webhookEvents: WebhookEventRecord[];
  pageViewEvents: PageViewEvent[];
  // Corporate modules
  businessDivisions: BusinessDivision[];
  websiteListings: WebsiteListing[];
  teamMembers: TeamMember[];
  corporateServices: CorporateService[];
  portfolioEntries: PortfolioEntry[];
  blogPosts: BlogPost[];
  jobListings: JobListing[];
  partnerships: Partnership[];
  corporateInquiries: CorporateInquiry[];
  companyProfile: CompanyProfile;
  // Multi-user website hosting & deployment platform
  hostedProjects?: HostedProject[];
  hostedDeployments?: HostedDeployment[];
  hostedProjectFiles?: HostedProjectFile[];
}

// ============================================================================
// CORPORATE / PARENT COMPANY TYPES
// ============================================================================

export type BusinessDivisionStatus = "active" | "inactive" | "coming_soon";

export interface BusinessDivision {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  shortDescription: string;
  category: string;
  objectives: string[];
  productsAndServices: string[];
  websiteIds: string[];
  contactEmail: string;
  contactPhone: string;
  status: BusinessDivisionStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type WebsiteStatus = "live" | "under_development" | "coming_soon" | "temporarily_unavailable" | "maintenance";

export interface WebsiteListing {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  screenshots: string[];
  previewVideoUrl?: string;
  description: string;
  shortDescription: string;
  category: string;
  features: string[];
  productsAndServices: string[];
  url: string;
  launchDate: string | null;
  status: WebsiteStatus;
  businessDivisionId: string | null;
  ownershipType: "owned" | "operated" | "managed" | "partnership" | "external_partnership" | "other";
  showOwnershipPublicly?: boolean;
  analyticsEnabled?: boolean;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageViewEvent {
  id: string;
  kind: "parent" | "connected_website";
  pagePath: string;
  websiteId: string | null;
  source: "direct" | "referral" | "search" | "social" | "internal";
  referrerHost: string | null;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  photo: string;
  designation: string;
  bio: string;
  responsibilities: string[];
  isFounder: boolean;
  founderMessage: string;
  leadershipPhilosophy: string;
  professionalBackground: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    email: string;
  };
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CorporateService {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  features: string[];
  icon: string;
  businessDivisionId: string | null;
  status: "active" | "inactive" | "coming_soon";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioEntry {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  url: string;
  businessDivisionId: string | null;
  tags: string[];
  featured: boolean;
  completedAt: string | null;
  status: "active" | "archived";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  type: "full_time" | "part_time" | "contract" | "internship";
  location: string;
  isRemote: boolean;
  salaryRange: string;
  requirements: string[];
  responsibilities: string[];
  status: "open" | "closed" | "paused";
  businessDivisionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Partnership {
  id: string;
  partnerName: string;
  slug: string;
  logo: string;
  description: string;
  url: string;
  partnerType: "technology" | "business" | "distribution" | "marketing" | "other";
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CorporateInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  relatedBusiness?: string;
  consentedAt?: string;
  inquiryType: "general" | "partnership" | "careers" | "media" | "business";
  status: "new" | "in_progress" | "resolved";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  businessName: string;
  legalName: string;
  logo?: string;
  favicon?: string;
  tagline: string;
  about: string;
  story: string;
  vision: string;
  mission: string;
  coreValues: Array<{ title: string; description: string; icon: string }>;
  founded: string;
  headquarters: string;
  founderName: string;
  founderDesignation: string;
  founderPhoto: string;
  founderBio: string;
  founderMessage: string;
  achievements: Array<{ title: string; description: string; year: string }>;
  futureRoadmap: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    youtube: string;
    website: string;
  };
  brandColors?: { primary: string; accent: string };
  brandFontFamily?: string;
}

// ============================================================================
// MULTI-USER STATIC WEBSITE HOSTING & DEPLOYMENT PLATFORM TYPES
// ============================================================================

export type ProjectVisibility = "public" | "private";
export type DeploymentStatus = "pending" | "building" | "live" | "failed";

export interface HostedProject {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  projectName: string;
  slug: string;
  description: string;
  visibility: ProjectVisibility;
  customDomain?: string;
  activeDeploymentId?: string;
  deploymentUrl?: string;
  deploymentStatus: DeploymentStatus;
  thumbnail?: string;
  storageUsedBytes: number;
  totalDeployments: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HostedDeployment {
  id: string;
  projectId: string;
  userId: string;
  deploymentStatus: DeploymentStatus;
  deploymentUrl: string;
  storagePath: string;
  fileCount: number;
  totalSize: number;
  entryFile: string;
  logs: string[];
  createdAt: string;
  publishedAt?: string;
}

export interface HostedProjectFile {
  id: string;
  projectId: string;
  deploymentId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
}
