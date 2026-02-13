---
description: Delete a car listing from the app and Supabase database by URL
---

# Delete Car Workflow

The user will provide the **Autotrader URL** of the car to delete.

## 1. Update `car_data.json`

- File: `c:\Users\kaiya\github\carbuy\car_data.json`
- Find the car object where `"url"` matches the provided URL (ignore query params).
- **Remove** that object from the JSON array.
- **Important**: Ensure valid JSON structure is maintained (fix commas).

## 2. Create Supabase Migration

// turbo-all

1. Create a new migration file in `supabase/migrations/` with timestamp naming:
   - Format: `YYYYMMDDHHMMSS_delete_<car_name>.sql`
   - Example: `20260213011000_delete_nissan_serena.sql`

2. Contents:
```sql
-- Delete <Car Name> from cars table
DELETE FROM cars WHERE url = '<THE_CLEAN_URL>';
```
   - Use the **clean URL** (no query params like `?calc-deposit=...`).

3. Push the migration:
```powershell
$env:SUPABASE_DB_PASSWORD = "Hk049866!!!!!"; npx supabase db push
```
   - Confirm with `Y` when prompted.
   - Expect: `Applying migration ... Finished supabase db push.`

## 3. Git Push & Verify Vercel Deploy

// turbo-all

1. Push to GitHub:
```powershell
git add . ; git commit -m "Remove car listing: <CarName>" ; git push
```
*(Replace `<CarName>` with the title of the car removed)*

2. Wait 30 seconds for Vercel to pick up the deploy, then check status:
```powershell
npx vercel ls carbuy
```
Confirm the latest deployment shows **"Ready"** status.

## 4. Report

- Confirm to the user that the car has been removed from both the local JSON and the remote database.
