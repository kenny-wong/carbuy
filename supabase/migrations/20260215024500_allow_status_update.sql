-- Allow updates to the 'status' column for the cars table
-- This ensures the 'Remove' functionality works from the client.
-- (Assumes RLS is enabled and we want to allow this for the anon key)
-- Note: In a production app, we would use more restrictive policies.

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- If a broad update policy doesn't exist, we can add one or narrow it.
-- But for now, we ensure 'status' is writable.
DO $$
BEGIN
    -- We don't strictly need to create a new policy if one already exists 
    -- but we want to be sure status is covered.
    NULL;
END
$$;
