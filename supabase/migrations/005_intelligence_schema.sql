-- ─────────────────────────────────────────────────────────────────────────────
-- 005_intelligence_schema.sql
-- Extends pantheon_agents for the intelligence layer, creates mentors table,
-- and seeds the 8 intelligence agents + 3 placeholder mentors.
--
-- Run this after 004_projects.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Add intelligence-layer columns to pantheon_agents
ALTER TABLE pantheon_agents
  ADD COLUMN IF NOT EXISTS role_display  text,
  ADD COLUMN IF NOT EXISTS division      text DEFAULT 'content',
  ADD COLUMN IF NOT EXISTS agent_status  text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS config        jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();

-- Seed the 8 intelligence layer agents
INSERT INTO pantheon_agents (name, role, role_display, division, description, agent_status) VALUES
  ('Content Researcher',       'content_researcher',      'Athena Deep',   'intelligence', 'Deep topic research before writing — mines sources, extracts angles, builds research briefs', 'active'),
  ('SEO / AEO Researcher',     'seo_aeo_researcher',      'Athena Search', 'intelligence', 'Real keyword data and answer engine optimisation — replaces guesswork with actual search intelligence', 'active'),
  ('Competitive Analyzer',     'competitive_analyzer',    'Athena Watch',  'intelligence', 'Weekly competitor intelligence — monitors positioning, messaging, and content gaps', 'active'),
  ('Content Gap Synthesizer',  'content_gap_synthesizer', 'Athena Synth',  'intelligence', 'Synthesises all research into ranked content opportunities', 'active'),
  ('Substack Researcher',      'substack_researcher',     'Athena Signal', 'intelligence', 'Newsletter and platform performance — open rates, engagement patterns, content that lands', 'active'),
  ('YouTube Researcher',       'youtube_researcher',      'Athena View',   'intelligence', 'Video performance and trending topics in the accessibility and design space', 'active'),
  ('Offer Intel',              'offer_intel',             'Athena Market', 'intelligence', 'Competitor offer ecosystems, pricing, and whitespace opportunities', 'active'),
  ('Technical Verifier',       'technical_verifier',      'Athena Check',  'intelligence', 'Catches outdated claims, wrong specs, and broken links before publishing', 'active')
ON CONFLICT (role) DO UPDATE SET
  role_display  = EXCLUDED.role_display,
  division      = EXCLUDED.division,
  description   = EXCLUDED.description,
  agent_status  = EXCLUDED.agent_status;

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,
  name              text NOT NULL,
  agent_name        text NOT NULL,
  domain            text NOT NULL,
  status            text DEFAULT 'collecting' CHECK (status IN ('active', 'extracted', 'collecting')),
  source_count      integer DEFAULT 0,
  batches_complete  integer DEFAULT 0,
  batch_total       integer DEFAULT 3,
  worldview         text,
  frameworks        jsonb,
  refresh_cadence   text DEFAULT 'Monthly',
  last_updated      timestamptz,
  created_at        timestamptz DEFAULT now()
);

-- Seed placeholder mentors
INSERT INTO mentors (slug, name, agent_name, domain, status, source_count, batches_complete) VALUES
  ('kat-holmes',  'Kat Holmes',  'The Inclusion Lens', 'Inclusive design and accessibility leadership',    'collecting', 0, 0),
  ('don-norman',  'Don Norman',  'The UX Conscience',  'Human-centred design and cognitive psychology',    'collecting', 0, 0),
  ('seth-godin',  'Seth Godin',  'The Marketer',       'Permission marketing and brand-building strategy', 'collecting', 0, 0)
ON CONFLICT (slug) DO NOTHING;
