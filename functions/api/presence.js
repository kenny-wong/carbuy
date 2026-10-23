const ONLINE_WINDOW_MS = 2 * 60 * 1000;

// GET /api/presence — users seen in the last 2 minutes
export async function onRequestGet({ env }) {
    try {
        const cutoff = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();
        const { results } = await env.DB
            .prepare('SELECT user_name, last_seen FROM presence WHERE last_seen > ? ORDER BY last_seen DESC')
            .bind(cutoff)
            .all();
        return Response.json(results);
    } catch (error) {
        console.error('Presence Fetch Error:', error);
        return Response.json({ error: 'Failed to fetch presence' }, { status: 500 });
    }
}

// POST /api/presence — heartbeat
export async function onRequestPost({ request, env }) {
    const { user_name } = await request.json().catch(() => ({}));

    if (!user_name) {
        return Response.json({ error: 'Missing user_name' }, { status: 400 });
    }

    try {
        await env.DB
            .prepare(`INSERT INTO presence (user_name, last_seen) VALUES (?, ?)
                      ON CONFLICT (user_name) DO UPDATE SET last_seen = excluded.last_seen`)
            .bind(user_name, new Date().toISOString())
            .run();
        return Response.json({ success: true });
    } catch (error) {
        console.error('Presence Heartbeat Error:', error);
        return Response.json({ error: 'Failed to update presence' }, { status: 500 });
    }
}
