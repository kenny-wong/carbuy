-- Add feature columns to cars table
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS has_carplay BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_rear_camera BOOLEAN DEFAULT FALSE;
