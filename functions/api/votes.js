// GET /api/votes — all votes
export async function onRequestGet({ env }) {
    try {
        const { results } = await env.DB
            .prepare('SELECT car_url, user_name FROM votes')
            .all();
        return Response.json(results);
    } catch (error) {
        console.error('Fetch Votes Error:', error);
        return Response.json({ error: 'Failed to fetch votes' }, { status: 500 });
    }
}

// POST /api/votes — toggle a user's vote on a car
export async function onRequestPost({ request, env }) {
    const { car_url, user_name } = await request.json().catch(() => ({}));

    if (!car_url || !user_name) {
        return Response.json({ error: 'Missing car_url or user_name' }, { status: 400 });
    }

    try {
        // Remove vote if it exists (toggle off), otherwise add it (toggle on)
        const removed = await env.DB
            .prepare('DELETE FROM votes WHERE car_url = ? AND user_name = ?')
            .bind(car_url, user_name)
            .run();

        if (removed.meta.changes > 0) {
            return Response.json({ success: true, action: 'removed' });
        }

        await env.DB
            .prepare('INSERT INTO votes (car_url, user_name) VALUES (?, ?) ON CONFLICT DO NOTHING')
            .bind(car_url, user_name)
            .run();

        return Response.json({ success: true, action: 'added' });
    } catch (error) {
        console.error('Toggle Vote Error:', error);
        return Response.json({ error: 'Failed to toggle vote' }, { status: 500 });
    }
}
