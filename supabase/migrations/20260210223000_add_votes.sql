-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id SERIAL PRIMARY KEY,
    car_url TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(car_url, user_name)
);

-- Enable RLS for votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow public insertion/deletion (toggling)
CREATE POLICY "Allow public toggle vote" ON public.votes
    FOR ALL USING (true) WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read votes" ON public.votes
    FOR SELECT USING (true);
