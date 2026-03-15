-- ============================================
-- NexusLife Database Schema (Supabase/PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- Users table — core identity
-- ────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  aadhaar_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- User profiles — trust scores
-- ────────────────────────────────────────────
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
  education_score INTEGER DEFAULT 0 CHECK (education_score BETWEEN 0 AND 25),
  finance_score INTEGER DEFAULT 0 CHECK (finance_score BETWEEN 0 AND 25),
  health_score INTEGER DEFAULT 0 CHECK (health_score BETWEEN 0 AND 25),
  employment_score INTEGER DEFAULT 0 CHECK (employment_score BETWEEN 0 AND 25),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- Connected data sources
-- ────────────────────────────────────────────
CREATE TABLE connected_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source_name VARCHAR(50) NOT NULL CHECK (source_name IN ('digilocker', 'abha', 'aa', 'linkedin', 'aadhaar', 'pan')),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  UNIQUE(user_id, source_name)
);

-- ────────────────────────────────────────────
-- Life events — timeline milestones
-- ────────────────────────────────────────────
CREATE TABLE life_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('education', 'employment', 'health', 'finance')),
  title VARCHAR(255) NOT NULL,
  institution VARCHAR(255),
  date DATE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- Consent requests — from institutions
-- ────────────────────────────────────────────
CREATE TABLE consent_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requested_fields JSONB NOT NULL,
  purpose TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- Consent grants — approved access tokens
-- ────────────────────────────────────────────
CREATE TABLE consent_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consent_request_id UUID REFERENCES consent_requests(id) ON DELETE CASCADE,
  approved_fields JSONB NOT NULL,
  expiry_at TIMESTAMP WITH TIME ZONE NOT NULL,
  consent_token TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- Data cards — generated verified summaries
-- ────────────────────────────────────────────
CREATE TABLE data_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  generated_for VARCHAR(255),
  fields_included JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0
);

-- ────────────────────────────────────────────
-- Audit logs — full access trail
-- ────────────────────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  institution_id VARCHAR(255),
  fields_accessed JSONB DEFAULT '[]',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- ────────────────────────────────────────────
-- Indexes for performance
-- ────────────────────────────────────────────
CREATE INDEX idx_consent_requests_user ON consent_requests(user_id, status);
CREATE INDEX idx_consent_grants_token ON consent_grants(consent_token);
CREATE INDEX idx_life_events_user ON life_events(user_id, event_type);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, timestamp);
CREATE INDEX idx_connected_sources_user ON connected_sources(user_id);
