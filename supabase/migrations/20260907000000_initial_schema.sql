-- Supabase initial migration for AI Sales Closer Copilot
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE sales_stage_type AS ENUM (
  'rapport',
  'discovery',
  'pain_discovery',
  'pain_clarification',
  'qualification',
  'solution',
  'objection_handling',
  'closing'
);

CREATE TYPE call_outcome_type AS ENUM (
  'closed_won',
  'closed_lost',
  'follow_up',
  'not_qualified',
  'no_decision',
  'in_progress'
);

CREATE TYPE intent_level_type AS ENUM (
  'low',
  'medium',
  'high'
);

-- 1. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'closer' CHECK (role IN ('admin', 'manager', 'closer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SALES CLOSERS TABLE
CREATE TABLE IF NOT EXISTS sales_closers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  quota_target NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  total_calls INTEGER DEFAULT 0,
  average_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  pricing_summary TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT KNOWLEDGE TABLE
CREATE TABLE IF NOT EXISTS product_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'feature', 'pricing', 'faq', 'policy', 'competitor'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  benefits TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SALES FRAMEWORKS TABLE
CREATE TABLE IF NOT EXISTS sales_frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  forbidden_behaviors TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SALES STAGES TABLE
CREATE TABLE IF NOT EXISTS sales_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID REFERENCES sales_frameworks(id) ON DELETE CASCADE,
  stage_key sales_stage_type NOT NULL,
  display_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  objective TEXT NOT NULL,
  suggested_questions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FRAMEWORK RULES TABLE
CREATE TABLE IF NOT EXISTS framework_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID REFERENCES sales_frameworks(id) ON DELETE CASCADE,
  stage_key sales_stage_type NOT NULL,
  rule_type TEXT NOT NULL, -- 'qualification', 'pain_discovery', 'objection', 'closing'
  rule_condition TEXT NOT NULL,
  approved_response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. OBJECTION LIBRARY TABLE
CREATE TABLE IF NOT EXISTS objection_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  objection_text TEXT NOT NULL,
  category TEXT NOT NULL, -- 'price', 'existing_solution', 'authority', 'timing', 'trust'
  ideal_response TEXT NOT NULL,
  follow_up_question TEXT NOT NULL,
  underlying_concern TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRAINING EXAMPLES TABLE
CREATE TABLE IF NOT EXISTS training_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  prospect_statement TEXT NOT NULL,
  closer_response TEXT NOT NULL,
  why_it_worked TEXT NOT NULL,
  stage sales_stage_type NOT NULL,
  objection_type TEXT,
  framework_id UUID REFERENCES sales_frameworks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CALLS TABLE
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  closer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  prospect_name TEXT NOT NULL,
  business_name TEXT,
  contact_phone TEXT,
  duration_seconds INTEGER DEFAULT 0,
  current_stage sales_stage_type DEFAULT 'rapport',
  buying_intent intent_level_type DEFAULT 'low',
  outcome call_outcome_type DEFAULT 'in_progress',
  audio_source_type TEXT DEFAULT 'demo', -- 'microphone', 'voip', 'upload', 'demo'
  is_recorded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 12. CALL TRANSCRIPTS TABLE
CREATE TABLE IF NOT EXISTS call_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('prospect', 'closer', 'system')),
  text TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.95,
  timestamp_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CALL RECORDINGS TABLE
CREATE TABLE IF NOT EXISTS call_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  format TEXT DEFAULT 'webm',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CALL ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS call_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  detected_pains JSONB DEFAULT '[]'::jsonb,
  detected_objections JSONB DEFAULT '[]'::jsonb,
  buying_signals JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  key_insights TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AI SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  trigger_transcript_id UUID REFERENCES call_transcripts(id) ON DELETE SET NULL,
  suggested_response TEXT NOT NULL,
  next_question TEXT,
  stage_at_suggestion sales_stage_type NOT NULL,
  reasoning TEXT,
  was_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CALL SCORES TABLE
CREATE TABLE IF NOT EXISTS call_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  rapport_score INTEGER CHECK (rapport_score BETWEEN 0 AND 100),
  discovery_score INTEGER CHECK (discovery_score BETWEEN 0 AND 100),
  pain_discovery_score INTEGER CHECK (pain_discovery_score BETWEEN 0 AND 100),
  qualification_score INTEGER CHECK (qualification_score BETWEEN 0 AND 100),
  solution_score INTEGER CHECK (solution_score BETWEEN 0 AND 100),
  objection_handling_score INTEGER CHECK (objection_handling_score BETWEEN 0 AND 100),
  closing_score INTEGER CHECK (closing_score BETWEEN 0 AND 100),
  what_went_well TEXT[],
  missed_opportunities TEXT[],
  improvements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. FOLLOW UPS TABLE
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  recommended_action TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_closers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE objection_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_scores ENABLE ROW LEVEL SECURITY;
