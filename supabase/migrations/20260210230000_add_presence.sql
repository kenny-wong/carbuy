-- Create Presence Table
CREATE TABLE IF NOT EXISTS presence (
    user_name TEXT PRIMARY KEY,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access" 
ON presence FOR SELECT 
USING (true);

-- Allow public upsert access (for heartbeats)
CREATE POLICY "Public Upsert Access" 
ON presence FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update Access" 
ON presence FOR UPDATE 
USING (true) 
WITH CHECK (true);
