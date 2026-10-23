---
name: add-cars
description: Add new car listings from Autotrader URLs to the app and Cloudflare D1 database
---

# Add New Cars Workflow

The user will provide one or more Autotrader UK URLs. Follow these steps exactly.

## 1. Scrape Car Data

For each Autotrader URL, use the **browser subagent** or **MCP Chrome tools** to visit the page and extract:

| Field | Example |
|---|---|
| **title** | "2014 Honda Jazz 1.4 i-VTEC EX CVT Euro 5 5dr" |
| **price** | "£6,990" |
| **mileage** | "38,257 miles" |
| **transmission** | "Automatic" or "Manual" |
| **engine_fuel** | "1.4L Petrol" |
| **year** | "2014" |
| **horsepower** | 99 (Integer) |
| **has_carplay** | true/false (Boolean) |
| **has_rear_camera** | true/false (Boolean) |
| **image_url** | Main hero image URL (starts with `https://m.atcdn.co.uk/`) |
| **url** | The Autotrader URL provided by user |

**Scraping tips:**
- Use `chrome_navigate` to open each URL, then `chrome_read_page` or `chrome_javascript` to extract data.
- The title is usually in the main `<h1>` element.
- Price is in the pricing section. Include the `£` symbol.
- Mileage, transmission, and engine/fuel are in the key specs section.
- **Year**: Look for "Registration Year" or extract from the title.
- **Horsepower**: Look in "Technical specs" -> "Power" (e.g. 136 ps). Store as integer.
- **Features**: Search for "CarPlay" and "Rear Camera" or "Reverse Camera" in the "Features" or "Extra features" section.
- For the image, look for the main car photo `<img>` tag. Use the highest resolution variant (w800 preferred).

## 2. Update `public/car_data.json`

- File: `public/car_data.json` (fallback copy used when the API is unavailable)
- **Prepend** new car objects to the **beginning** of the JSON array (so they appear first when sorted by date).
- Set `created_at` to the current time in ISO format, e.g. `"2026-02-12T12:00:00Z"`.
- Format each object like this:

```json
{
    "title": "2014 Honda Jazz 1.4 i-VTEC EX CVT Euro 5 5dr",
    "price": "£6,990",
    "mileage": "38,257 miles",
    "transmission": "Automatic",
    "engine_fuel": "1.4L Petrol",
    "year": "2014",
    "horsepower": 99,
    "has_carplay": false,
    "has_rear_camera": true,
    "image_url": "https://m.atcdn.co.uk/a/media/w800/064bbbd1db474abd8207aa3c128a2b0d.jpg",
    "url": "http://www.autotrader.co.uk/car-details/202601269428585",
    "created_at": "2026-02-12T12:00:00Z"
}
```

- **Important**: Ensure valid JSON — commas between objects, no trailing commas.

## 3. Create D1 Migration

// turbo-all

1. Create a new migration file (Wrangler numbers it automatically):
```powershell
npx wrangler d1 migrations create carbuy add_<description>
```
   - Example: `npx wrangler d1 migrations create carbuy add_honda_jazz` → `migrations/0003_add_honda_jazz.sql`

2. Fill it with an INSERT for the new cars only. D1 is SQLite: booleans are `1`/`0`, and use the **same** `created_at` string as in `car_data.json`:

```sql
INSERT INTO cars (title, price, mileage, transmission, engine_fuel, year, horsepower, has_carplay, has_rear_camera, image_url, url, created_at) VALUES
(
  'Car Title Here',
  '£6,990',
  '38,257 miles',
  'Automatic',
  '1.4L Petrol',
  '2014',
  99,
  0,
  1,
  'https://m.atcdn.co.uk/...',
  'http://www.autotrader.co.uk/car-details/...',
  '2026-02-12T12:00:00Z'
);
```

- For multiple cars, separate each VALUES group with a comma. Only the last one gets a semicolon. Escape `'` in titles as `''`.

3. Apply the migration to the production database:
```powershell
npm run db:migrate
```
   - Expect the new migration to show ✅.

## 4. Deploy & Git Push

// turbo-all

1. Deploy to Cloudflare Pages:
```powershell
npm run deploy
```
   - Expect: `Deployment complete!`

2. Push to GitHub:
```powershell
git add . ; git commit -m "Add <N> new car listings" ; git push
```
Replace `<N>` with the number of new cars added.

3. Verify the new cars appear at [https://carbuy.pages.dev](https://carbuy.pages.dev).

## 5. Report

- Report the results to the user in a summary table.
