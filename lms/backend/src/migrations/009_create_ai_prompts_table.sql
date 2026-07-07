-- Create AI Prompts Table
CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL, -- Full system prompt for Claude
  input_fields JSONB NOT NULL, -- Array of input field definitions
  order_number INTEGER NOT NULL,
  category VARCHAR(100), -- e.g., 'content_creation', 'analysis', 'brainstorm'
  example_output TEXT,
  max_tokens INTEGER DEFAULT 2000,
  temperature FLOAT DEFAULT 0.7,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, slug)
);

-- Create AI Prompt Executions Table
CREATE TABLE IF NOT EXISTS ai_prompt_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES ai_prompts(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  output_text TEXT,
  model VARCHAR(50) DEFAULT 'claude-3-sonnet', -- Claude model used
  tokens_used INTEGER,
  cost_cents INTEGER, -- Cost in cents
  status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create AI Usage Statistics Table
CREATE TABLE IF NOT EXISTS ai_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month
  total_executions INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month)
);

-- Create indexes
CREATE INDEX idx_ai_prompts_course_id ON ai_prompts(course_id);
CREATE INDEX idx_ai_prompts_slug ON ai_prompts(slug);
CREATE INDEX idx_ai_prompt_executions_user_id ON ai_prompt_executions(user_id);
CREATE INDEX idx_ai_prompt_executions_prompt_id ON ai_prompt_executions(prompt_id);
CREATE INDEX idx_ai_usage_stats_user_id ON ai_usage_stats(user_id);
