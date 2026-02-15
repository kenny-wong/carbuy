-- Allow all users (including anonymous ones) to update car status.
-- This is necessary for the family member 'Remove' feature to work from the frontend.

-- Ensure RLS is enabled
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create update policy if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cars' AND policyname = 'Allow update access to all users'
    ) THEN
        CREATE POLICY "Allow update access to all users" ON "public"."cars"
        FOR UPDATE
        TO public
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;
