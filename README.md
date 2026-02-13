# 程晞大家庭 - 買車 (Family Car Buying Dashboard)

A premium, interactive dashboard for the family to browse, filter, vote on, and discover car listings together. Features Sanrio character themes, real-time user presence, a voting leaderboard, and smooth micro-animations throughout.

**🔗 Live Site**: [https://carbuy-chi.vercel.app](https://carbuy-chi.vercel.app)

---

## 🌟 Features

### 🚗 Car Listings
- **Dynamic Data**: Fetches listings from Supabase (PostgreSQL) in real time.
- **Smart Filtering**: Filter by Model, Engine type, Max Price (slider), and Max Mileage (slider).
- **Sorting**: Sort by Price (Low/High), Mileage (Low/High), Model (A-Z), or **Date Added (Newest)**.
- **Stats Bar**: Live counter showing total vehicles and average price.
- **"New" Badges**: Cars added within 3 days show a "New: today / 1d ago / 2d ago" badge.

### ❤️ Voting System
- **One Vote Per Car**: Each family member can vote (heart ♥) their favourites.
- **Voter Avatars**: See who voted with Sanrio character bubbles on each card.
- **🏆 Top Rated Leaderboard**: Sidebar ranking the most-voted cars.
- **Highlight Effect**: Click a leaderboard car → page scrolls to the card and it **glows with a pulse animation** for 3 seconds, then fades away.

### 🟢 Real-Time Presence
- **Heartbeat System**: Clients ping every 60 seconds.
- **Online Now**: Header shows who's currently browsing with character avatars.
- **2-Minute Timeout**: Users go offline after 2 minutes of inactivity.

### 🎨 Sanrio Character Themes
| Theme | Style |
|---|---|
| **Original** | Clean modern default |
| **XO (Bad Badtz-Maru)** | Dark grey + yellow accents |
| **Pochacco** | Mint green + soft cyan |
| **Kuromi** | Purple + black gothic |
| **Hello Kitty** | Classic pink + red |

Each theme includes a full-body character overlay, matching colour palette, and themed UI elements.

### 👤 Family Login
- **4 Members**: Kenny, Gubie, Hayley, Chloe — each with a unique Sanrio secret phrase.
- **Personalised**: Auto-applies the member's theme and avatar on login.
- **Audit Logging**: Theme selections are logged to Supabase for analytics.

### 📱 Responsive Design
| Breakpoint | Layout |
|---|---|
| **< 480px** | Single-column cards, compact filters |
| **480–768px** | Two-column cards |
| **769–1100px** | Three-column cards |
| **> 1100px** | Full layout with sidebar |

Top Rated + Online Now sections appear above filters on mobile.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS (CSS Variables), Vanilla JavaScript (ES6+) |
| **Backend** | Node.js Serverless Functions (Vercel) |
| **Database** | Supabase (PostgreSQL) with Supabase CLI migrations |
| **Hosting** | Vercel (auto-deploy from GitHub) |
| **Fonts** | [Outfit](https://fonts.google.com/specimen/Outfit) + [Noto Sans TC](https://fonts.google.com/specimen/Noto+Sans+TC) (Chinese header) |

---

## 📂 Project Structure

```
carbuy/
├── index.html                 # Main HTML page
├── style.css                  # All styles + responsive breakpoints + animations
├── script.js                  # Client logic (filters, votes, presence, themes, highlight)
├── car_data.json              # Car listing data (JSON)
├── package.json               # Node.js dependencies (@supabase/supabase-js, pg)
├── vercel.json                # Vercel routing configuration
│
├── api/                       # Vercel serverless functions
│   ├── cars.js                # GET car listings from Supabase
│   ├── votes.js               # GET/POST votes (toggle per user)
│   ├── presence.js            # GET online users / POST heartbeat
│   └── audit.js               # POST theme audit log
│
├── images/
│   ├── xo.png                 # Bad Badtz-Maru full-body
│   ├── pochacco.png           # Pochacco full-body
│   ├── kuromi.png             # Kuromi full-body
│   ├── hello-kitty.png        # Hello Kitty full-body
│   └── icons/                 # Voter avatar icons (per character)
│
├── sql/
│   ├── schema.sql             # Full database schema reference
│   └── update_cars.sql        # SQL for bulk-inserting new cars
│
├── supabase/
│   └── migrations/            # Supabase CLI migration files
│       ├── 20260210210000_schema.sql
│       ├── 20260210210001_seed.sql
│       ├── 20260210221700_add_audit_log.sql
│       ├── 20260210223000_add_votes.sql
│       ├── 20260210230000_add_presence.sql
│       └── ...                # New migrations added via workflow
│
└── .agent/
    └── workflows/
        ├── add-cars.md        # AI workflow: add cars from Autotrader URLs
        └── delete-car.md      # AI workflow: delete a car by URL
```

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18+)
- Vercel CLI (`npm i -g vercel`)

### Setup
```bash
git clone https://github.com/kenny-wong/carbuy.git
cd carbuy
npm install
```

### Pull Environment Variables
```bash
npx vercel env pull .env.local --environment production
```

### Run Locally

**Full stack** (with serverless API routes):
```bash
npx vercel dev
```
Opens at `http://localhost:3000`.

**Frontend-only** (static file server):
```bash
python -m http.server 8000
```
Opens at `http://localhost:8000` (API routes won't work).

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/cars` | GET | Fetch all car listings ordered by `created_at` desc |
| `/api/votes` | GET | Fetch all votes |
| `/api/votes` | POST | Toggle a vote `{ car_url, user_name }` |
| `/api/presence` | GET | Fetch online users (active within 2 min) |
| `/api/presence` | POST | Send heartbeat `{ user_name }` |
| `/api/audit` | POST | Log theme selection `{ user_name, selected_theme }` |

---

## ☁️ Deployment

### 1. Database (Supabase)
1. Create a project on [Supabase](https://supabase.com).
2. Run the migration files via Supabase CLI:
```powershell
$env:SUPABASE_DB_PASSWORD = "your-password"
npx supabase db push
```

### 2. Hosting (Vercel)
1. Run `npx vercel` and follow the prompts.
2. Add environment variables in Vercel Project Settings:
   - `SUPABASE_URL` — Your Supabase project URL
   - `SUPABASE_ANON_KEY` — Your Supabase anon/public key
   - `SUPABASE_DB_PASSWORD` — Your database password (for CLI migrations)

### 3. Auto-Deploy
Push to `main` → Vercel auto-deploys. Check status:
```bash
npx vercel ls carbuy
```

---

## 📦 Data Structure

Each car in `car_data.json`:

```json
{
  "url": "https://www.autotrader.co.uk/car-details/202512298823547",
  "title": "2014 Nissan Serena",
  "price": "£7,250",
  "mileage": "54,172 miles",
  "transmission": "Automatic",
  "engine_fuel": "2.0L Petrol Hybrid",
  "image_url": "https://m.atcdn.co.uk/a/media/...",
  "created_at": "2026-02-10T21:56:10Z"
}
```

---

## 🤖 AI Workflows

This project includes AI-assisted workflows (in `.agent/workflows/`) for managing car listings:

### `/add-cars` — Add New Cars
Provide Autotrader UK URLs → AI scrapes the data, updates `car_data.json`, creates a Supabase migration, pushes to DB, commits, and deploys.

### `/delete-car` — Delete a Car
Provide the car URL → AI removes from `car_data.json`, creates a DELETE migration, pushes to Supabase via CLI, commits, and verifies deployment.

Both workflows use `npx supabase db push` for reliable database updates.

---

## 📝 License

Private family project.
