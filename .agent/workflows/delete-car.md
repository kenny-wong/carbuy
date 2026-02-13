---
description: Delete a car listing from the app and Supabase database by URL
---

# Delete Car Workflow

The user will provide the **Autotrader URL** of the car to delete.

## 1. Update `car_data.json`

- File: `c:\Users\kaiya\github\carbuy\car_data.json`
- Find the car object where `"url"` matches the provided URL.
- **Remove** that object from the JSON array.
- **Important**: Ensure valid JSON structure is maintained (fix commas).

## 2. Execute SQL in Supabase (REST API)

// turbo-all

Use the Supabase REST API to delete the car, as direct Postgres connections can be flaky with certain restricted networks or user configurations.

1. **Create a temporary delete script** `temp_delete_api.js`:
```javascript
const https = require('https');
const fs = require('fs');

// Configuration
const SUPABASE_URL = 'https://nncxbppcjsigauflrdxw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY3hicHBjanNpZ2F1ZmxyZHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTgzMjksImV4cCI6MjA4NjMzNDMyOX0.FV-8vUkD0Y0-iZpmC_pUuM7Qo4cqMwi_UjdggBRok-s';
const TARGET_URL = 'THE_TARGET_URL'; // Replace this!

const options = {
  hostname: 'nncxbppcjsigauflrdxw.supabase.co',
  path: `/rest/v1/cars?url=eq.${encodeURIComponent(TARGET_URL)}`,
  method: 'DELETE',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Success:', data);
      const rows = JSON.parse(data);
      console.log('Rows deleted:', rows.length);
    } else {
      console.error('Error:', res.statusCode, data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
  process.exit(1);
});

req.end();
```

2. **Run the script**:
```powershell
# Replace THE_TARGET_URL in the file content first!
node temp_delete_api.js
```

3. **Verify output**:
   - Expect `Rows deleted: 1` (or 0 if already deleted).
   - If successful, remove the temp script.

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
