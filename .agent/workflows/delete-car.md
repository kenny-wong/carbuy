---
name: delete-car
description: Delete a car listing from the app and Cloudflare D1 database by URL
---

# Delete Car Workflow

The user will provide the **Autotrader URL** of the car to delete.

## 1. Update `public/car_data.json`

- File: `public/car_data.json`
- Find the car object where `"url"` matches the provided URL (ignore query params).
- **Remove** that object from the JSON array.
- **Important**: Ensure valid JSON structure is maintained (fix commas).

## 2. Create D1 Migration

// turbo-all

1. Create a new migration file:
```powershell
npx wrangler d1 migrations create carbuy delete_<car_name>
```
   - Example: `npx wrangler d1 migrations create carbuy delete_nissan_serena`

2. Contents (use the URL exactly as stored — check `car_data.json`, some include query params):
```sql
-- Delete <Car Name> and its votes
DELETE FROM votes WHERE car_url = '<THE_URL>';
DELETE FROM cars WHERE url = '<THE_URL>';
```

3. Apply the migration:
```powershell
npm run db:migrate
```

## 3. Deploy & Git Push

// turbo-all

1. Deploy:
```powershell
npm run deploy
```

2. Push to GitHub:
```powershell
git add . ; git commit -m "Remove car listing: <CarName>" ; git push
```
*(Replace `<CarName>` with the title of the car removed)*

## 4. Report

- Confirm to the user that the car has been removed from both the local JSON and the D1 database.
