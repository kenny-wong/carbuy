# 程晞大家庭 - 買車 (Family Car Buying Dashboard)

A premium, interactive dashboard for the family to browse, filter, vote on, and discover car listings together. Features Sanrio character themes, real-time user presence, a voting leaderboard, and smooth micro-animations throughout.

**🔗 Live Site**: [https://carbuy.pages.dev](https://carbuy.pages.dev)

**Current Version**: `v1.4.3` (Managed via `.cursorrules`)

---

## 🌟 Features

### 🚗 Car Listings
- **Dynamic Data**: Fetches listings from Supabase (PostgreSQL) in real time.
- **Smart Filtering**: 
    - **Specs**: Model, Engine type, Max Price (slider), and Max Mileage (slider).
    - **Features**: Multi-select filter for **Apple CarPlay** and **Rear Camera** availability.
    - **Personalized**: **"My Votes"** checkbox to see only cars you've personally heart-ed.
    - **Sold Status**: "Hide Sold" toggle to focus only on available stock.
- **Sorting**: Price (Low/High), Mileage (Low/High), Model (A-Z), or **Date Added (Newest)**.
- **Horsepower (HP)**: High-accuracy horsepower data for every car with helpful explanatory tooltips.
- **Stats Bar**: Live counter showing total vehicles and average price.
- **"New" Badges**: Cars added within 3 days show a "New: today / 1d ago / 2d ago" badge.

### ❤️ Voting System
- **One Vote Per Car**: Each user can vote (heart ♥) their favourites.
- **Voter Avatars**: See who voted with Sanrio character bubbles on each card.
- **🏆 Top Rated Leaderboard**: Sidebar ranking the most-voted cars.
- **Highlight Effect**: Click a leaderboard car → page scrolls to the card and it **glows with a pulse animation** for 3 seconds, then fades away.

### 🟢 Real-Time Presence
- **Heartbeat System**: Clients ping every 60 seconds.
- **Online Now**: Header shows who's currently browsing with character avatars.
- **2-Minute Timeout**: Users go offline after 2 minutes of inactivity.

### 🎨 Sanrio Character Themes
| Theme | Style | Character |
|---|---|---|
| **Original** | Clean modern default | - |
| **XO (Bad Badtz-Maru)** | Dark grey + yellow accents | Bad Badtz-Maru |
| **Pochacco** | Mint green + soft cyan | Pochacco |
| **Kuromi** | Purple + black gothic | Kuromi |
| **Hello Kitty** | Classic pink + red | Hello Kitty |
| **Badminton** | Sporty green + white | Shuttlecock |

Each theme includes a full-body character overlay, matching colour palette, and themed UI elements.

### 👥 User Access
- **Family Members**: Kenny, Gubie, Hayley, Chloe — each with a unique Sanrio secret phrase.
- **Guest Access**: New mode for visitors:
    - Custom guest name entry.
- **Personalised**: Auto-applies the member's theme and avatar on login.
- **Audit Logging**: All entrance activity is logged to Supabase for analytics.

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
| **Backend** | Cloudflare Pages Functions (`functions/api/`) |
| **Database** | Cloudflare D1 (SQLite) with Wrangler migrations |
| **Hosting** | Cloudflare Pages (direct upload via `npm run deploy`) |
| **Fonts** | [Outfit](https://fonts.google.com/specimen/Outfit) + [Noto Sans TC](https://fonts.google.com/specimen/Noto+Sans+TC) |

---

## 📂 Project Structure

```
carbuy/
├── public/                    # Static site (the only folder uploaded to Pages)
│   ├── index.html             # Main HTML page with versioning display
│   ├── style.css              # All styles + themes + responsive breakpoints
│   ├── script.js              # Client logic (filters, votes, presence, guest login)
│   ├── car_data.json          # Fallback car data if the API is unavailable
│   └── images/                # Character overlays + icons/ (user avatars)
│
├── functions/api/             # Cloudflare Pages Functions (D1 bound as env.DB)
│   ├── cars.js                # GET car listings
│   ├── votes.js               # GET/POST votes (toggle per user)
│   ├── presence.js            # GET online users / POST heartbeat
│   ├── audit.js               # POST entrance logs
│   └── update-car.js          # POST status change (family only)
│
├── migrations/                # D1 migrations (schema + data changes)
├── wrangler.jsonc             # Pages + D1 configuration
├── package.json               # Scripts + app version (v1.4.3)
│
└── .agent/
    └── workflows/             # AI automation guides (add/delete/status/features)
```

---

## 🚀 Local Development

### Setup
```bash
git clone https://github.com/kenny-wong/carbuy.git
npm install
npx wrangler login              # once, to access the Cloudflare account
npm run db:migrate:local        # create + seed the local D1 database
```

### Run Locally
```bash
npm run dev      # Full stack incl. /api and local D1 (localhost:8788)
```

### Database & Deploy
```bash
npx wrangler d1 migrations create carbuy <name>   # new migration file
npm run db:migrate                                # apply migrations to production D1
npm run deploy                                    # deploy public/ + functions/ to Pages
```
Pushing to GitHub does **not** deploy — run `npm run deploy`.

---

## 📦 Data Structure

Each car (D1 `cars` table / `public/car_data.json`) supports rich feature metadata:

```json
{
  "url": "https://www.autotrader.co.uk/...",
  "title": "2014 Honda Jazz 1.4 i-VTEC",
  "price": "£6,990",
  "mileage": "38,257 miles",
  "transmission": "Automatic",
  "engine_fuel": "1.4L Petrol",
  "image_url": "https://m.atcdn.co.uk/...",
  "created_at": "2026-02-12T12:00:00Z",
  "status": "SOLD",             // Optional: "SOLD" or unset
  "has_carplay": true,          // CarPlay support
  "has_rear_camera": true,      // Rear camera support
  "horsepower": 99              // Engine HP
}
```

---

## 🤖 AI Workflows

This project is AI-native, utilizing automated workflows in `.agent/workflows/`:

### `/add-cars`
AI scrapes Autotrader UK, extracts HP data using model search, updates `car_data.json`, applies a D1 migration, and deploys.

### `/delete-car`
Removes a listing (and its votes) from `car_data.json` and D1.

### `/update-car-status`
AI validates listing status via web checks, marks cars as **SOLD** in the DB, and removes vote counts for stale listings.

### `/update-car-features`
Bulk check and update for specialized features like CarPlay and Rear Camera.

---

## 📝 License
Private family project.
