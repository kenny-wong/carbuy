-- Create the cars table
CREATE TABLE IF NOT EXISTS public.cars (
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    price TEXT, -- Stored as text (e.g., '£5,990'), can be converted to numeric if needed
    mileage TEXT, -- Stored as text (e.g., '40,000 miles'), can be converted later
    transmission TEXT,
    engine_fuel TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;


-- Create login audit table
CREATE TABLE IF NOT EXISTS public.audit_log (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    selected_theme TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (service role will handle this, but for simplicity in this demo we allow insert)
CREATE POLICY "Allow public insert to audit" ON public.audit_log
    FOR INSERT WITH CHECK (true);

-- Allow public read access for verification
CREATE POLICY "Allow public read audit" ON public.audit_log
    FOR SELECT USING (true);

