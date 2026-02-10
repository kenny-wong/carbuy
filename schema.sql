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

CREATE POLICY "Allow public read access" ON public.cars
    FOR SELECT USING (true);
