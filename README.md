# Car Buying Dashboard (程晞大家庭 - 買車)

A dynamic, responsive dashboard for the family to browse, filter, vote on, and discuss car listings together. Built with a premium UI featuring Sanrio character themes, real-time user presence, and a voting system.

**Live Site**: [https://carbuy-chi.vercel.app](https://carbuy-chi.vercel.app)

## 🌟 Features

### 🚗 Car Listings
- **Dynamic Data Loading**: Fetches car data from Supabase without page reloads.
- **Interactive Filtering**:
  - **Model**: Filter by car model.
  - **Engine**: Filter by engine size/type.
  - **Max Price**: Slider to set a maximum price budget.
  - **Max Mileage**: Slider to set a maximum mileage limit.
- **Smart Sorting**: Sort listings by Price (Low/High), Mileage (Low/High), or Model (A-Z).
- **Detailed Analytics**: Real-time stats bar showing total listings and average price.

### ❤️ Voting System
- **Vote for Cars**: Each family member can vote (heart) their favourite listings.
- **Red Heart on Vote**: The heart icon turns red when you've voted for a car.
- **Voter Bubbles**: See who voted for each car with Sanrio character avatar bubbles.
- **Leaderboard**: "🏆 Top Rated Cars" sidebar showing the most voted cars.

### 🟢 User Presence (Online Now)
- **Heartbeat System**: Clients ping the server every 60 seconds.
- **Online Users**: The "🟢 Online Now" sidebar section shows who's currently browsing.
- **2-Minute Timeout**: Users appear offline after 2 minutes of inactivity.

### 🎨 Sanrio Character Themes
- **Original**: Clean and modern default theme.
- **XO (Bad Badtz-Maru)**: Dark theme with yellow accents.
- **Pochacco**: Mint green and soft cyan theme.
- **Kuromi**: Purple and black gothic theme.
- **Hello Kitty**: Classic pink and red theme.

Each theme includes a full-body character overlay and matching colour palette.

### 👤 Family Login System
- **Member Profiles**: Kenny, Gubie, Hayley, and Chloe each have unique logins.
- **Secret Phrase Authentication**: Each member has a Sanrio character as their secret.
- **Personalised Experience**: Auto-applies the member's theme on login and displays their avatar in the header.

### 📱 Responsive Design
- **Mobile** (< 480px): Single-column card grid, compact filters, full-width layout.
- **Medium Mobile** (480–768px): Two-column card grid.
- **Tablet** (769–1100px): Three-column card grid.
- **Desktop** (> 1100px): Full layout with sidebar.
- Sidebar (Top Rated + Online Now) appears above filters on mobile.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla CSS with CSS Variables), JavaScript (ES6+ Vanilla)
- **Backend**: Node.js Serverless Functions (Vercel)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts

## 📂 Project Structure

```
carbuy/
├── index.html              # Main HTML page
├── style.css               # All styling including responsive breakpoints
├── script.js               # Client-side logic (filters, votes, presence, themes)
├── car_data.json           # Raw car data (JSON)
├── schema.sql              # Database schema (cars, votes, audit_log, presence)
├── seed.sql                # Database seed data
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel configuration
├── api/
│   ├── cars.js             # GET car listings from Supabase
│   ├── votes.js            # GET/POST votes (toggle vote per user)
│   └── presence.js         # GET online users / POST heartbeat
├── images/
│   ├── xo.png              # Bad Badtz-Maru character
│   ├── pochacco.png        # Pochacco character
│   ├── kuromi.png          # Kuromi character
│   └── hello-kitty.png     # Hello Kitty character
├── supabase/
│   └── migrations/         # Supabase migration files
├── generate_seed.py        # Script to generate seed.sql from car_data.json
└── append_new_cars.py      # Script to append new cars to car_data.json
```

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
```bash
npx vercel dev
```
This starts the Vercel dev server with serverless functions at `http://localhost:3000`.

Alternatively, for frontend-only development:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` (Note: API routes won't work without Vercel dev).

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/cars` | GET | Fetch all car listings from Supabase |
| `/api/votes` | GET | Fetch all votes |
| `/api/votes` | POST | Toggle a vote `{ car_url, user_name }` |
| `/api/presence` | GET | Fetch currently online users (seen in last 2 min) |
| `/api/presence` | POST | Send heartbeat `{ user_name }` |

## ☁️ Deployment

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of `schema.sql` to create all tables (`cars`, `votes`, `audit_log`, `presence`).
4. Copy and run the contents of `seed.sql` to import existing car data.

### 2. Deployment (Vercel)
1. Install Vercel CLI: `npm install -g vercel` (or use `npx vercel`).
2. Run `npx vercel` in the project root and follow the prompts.
3. **Environment Variables**: Go to your Vercel Project Settings > Environment Variables and add:
    - `SUPABASE_URL`: Your Supabase Project URL.
    - `SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key.
    - `SUPABASE_DB_PASSWORD`: Your Supabase Database Password (for CLI migrations).

### 3. Database Migrations (CLI)
```bash
# Set password
$env:SUPABASE_DB_PASSWORD = "your-password-here"

# Push migrations
npx supabase db push
```

## 📂 Data Structure

The dashboard expects `car_data.json` to follow this structure:

```json
[
  {
    "url": "https://example.com/car-listing",
    "title": "2015 Nissan Juke",
    "price": "£6,495",
    "mileage": "42,000 miles",
    "transmission": "Automatic",
    "engine_fuel": "1.6L Petrol",
    "image_url": "https://example.com/image.jpg"
  }
]
```

## 📝 Adding New Cars

Use the provided Python scripts:

```bash
# Append new cars from autotrader_data.json
python append_new_cars.py

# Regenerate seed.sql from car_data.json
python generate_seed.py
```
