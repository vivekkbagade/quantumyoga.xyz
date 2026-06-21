-- SQL schema for Supabase
-- Creates a table 'quantum_yoga_db' to store the unified database state as a JSONB document.

CREATE TABLE IF NOT EXISTS quantum_yoga_db (
    id text PRIMARY KEY DEFAULT 'default',
    state jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE quantum_yoga_db ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Allow select for everyone" ON quantum_yoga_db;
DROP POLICY IF EXISTS "Allow all actions for everyone" ON quantum_yoga_db;

-- Create policies to allow select and modify operations
CREATE POLICY "Allow select for everyone" ON quantum_yoga_db FOR SELECT USING (true);
CREATE POLICY "Allow all actions for everyone" ON quantum_yoga_db FOR ALL USING (true) WITH CHECK (true);
