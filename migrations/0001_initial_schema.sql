-- Initial D1 schema (consolidated from the former Supabase migrations).
-- Timestamps are stored as ISO-8601 UTC strings so the client can parse them with new Date().

CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    price TEXT,            -- e.g. '£5,990'
    mileage TEXT,          -- e.g. '40,000 miles'
    transmission TEXT,
    engine_fuel TEXT,
    year TEXT,
    horsepower INTEGER,
    has_carplay INTEGER,   -- 1 / 0 / NULL (unknown)
    has_rear_camera INTEGER,
    image_url TEXT,
    status TEXT DEFAULT 'Available', -- 'Available' | 'SOLD' | 'REMOVED'
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_url TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (car_url, user_name)
);

CREATE TABLE IF NOT EXISTS presence (
    user_name TEXT PRIMARY KEY,
    last_seen TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    selected_theme TEXT NOT NULL,
    login_time TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence (last_seen);
