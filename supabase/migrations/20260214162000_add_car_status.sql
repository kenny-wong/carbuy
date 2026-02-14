-- Add status column to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Available';
