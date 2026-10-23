// Must match familyMembers in public/script.js
const FAMILY_MEMBERS = ['Kenny', 'Gubie', 'Hayley', 'Chloe'];

// POST /api/update-car — family members change a car's status (e.g. REMOVED / Available)
export async function onRequestPost({ request, env }) {
    const { car_url, status, user_name } = await request.json().catch(() => ({}));

    if (!car_url || !status || !user_name) {
        return Response.json({ error: 'Missing car_url, status or user_name' }, { status: 400 });
    }

    if (!FAMILY_MEMBERS.includes(user_name)) {
        return Response.json({ error: 'Unauthorized: Only family members can update car status' }, { status: 403 });
    }

    try {
        await env.DB
            .prepare('UPDATE cars SET status = ? WHERE url = ?')
            .bind(status, car_url)
            .run();
        return Response.json({ success: true, status });
    } catch (error) {
        console.error('Update Car Error:', error);
        return Response.json({ error: 'Failed to update car' }, { status: 500 });
    }
}
