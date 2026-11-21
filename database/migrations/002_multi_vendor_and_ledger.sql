-- ============================================================================
-- MDK ENTERPRISES — MULTI-VENDOR, 7% COMMISSION & AUDITABLE LEDGER MIGRATION
-- Migration: 002_multi_vendor_and_ledger.sql
-- Target: PostgreSQL 14+ / CockroachDB / LibSQL
-- ============================================================================

-- 1. Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  gstin TEXT,
  pan_number TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 7.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  rejection_reason TEXT,
  total_earnings NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  pending_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  withdrawable_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  total_withdrawn NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- 2. Alter Products Table to add vendor attribution & moderation status
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vendor_store_name TEXT,
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('draft', 'pending_approval', 'approved', 'rejected', 'suspended', 'archived')),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS admin_feedback TEXT,
  ADD COLUMN IF NOT EXISTS cod_available BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS warranty TEXT DEFAULT '1 Year MDK Warranty';

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_approval_status ON products(approval_status);

-- 3. Financial Ledger Table (Integer Paise Precision)
CREATE TABLE IF NOT EXISTS financial_ledger (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  order_number TEXT,
  vendor_id TEXT REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_store_name TEXT,
  type TEXT NOT NULL CHECK (type IN (
    'order_escrow',
    'commission_earned',
    'vendor_matured',
    'refund_reversal',
    'cancellation_reversal',
    'payout_requested',
    'payout_settled',
    'payout_rejected'
  )),
  gross_amount_paise BIGINT NOT NULL DEFAULT 0,
  commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 7.00,
  commission_amount_paise BIGINT NOT NULL DEFAULT 0,
  vendor_share_paise BIGINT NOT NULL DEFAULT 0,
  note TEXT NOT NULL,
  idempotency_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'reversed', 'failed')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_vendor_id ON financial_ledger(vendor_id);
CREATE INDEX IF NOT EXISTS idx_ledger_order_id ON financial_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_type ON financial_ledger(type);

-- 4. Vendor Payout Requests Table
CREATE TABLE IF NOT EXISTS vendor_payouts (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_store_name TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  bank_account_details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'processing', 'completed', 'rejected')),
  transaction_reference TEXT,
  admin_notes TEXT,
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON vendor_payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON vendor_payouts(status);

-- 5. Webhook Idempotency Table
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  event TEXT NOT NULL,
  processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON webhook_events(event_id);

-- 6. Administrative Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROLLBACK INSTRUCTIONS:
-- To reverse this migration, execute in order:
-- DROP TABLE IF EXISTS audit_logs;
-- DROP TABLE IF EXISTS webhook_events;
-- DROP TABLE IF EXISTS vendor_payouts;
-- DROP TABLE IF EXISTS financial_ledger;
-- ALTER TABLE products DROP COLUMN IF EXISTS vendor_id, DROP COLUMN IF EXISTS vendor_store_name, DROP COLUMN IF EXISTS approval_status, DROP COLUMN IF EXISTS rejection_reason, DROP COLUMN IF EXISTS admin_feedback, DROP COLUMN IF EXISTS cod_available, DROP COLUMN IF EXISTS warranty;
-- DROP TABLE IF EXISTS vendors;
-- ============================================================================
