-- Add year column to cars table
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS year TEXT;
