// POST /api/audit — log a login
export async function onRequestPost({ request, env }) {
    const { user_name, selected_theme } = await request.json().catch(() => ({}));

    if (!user_name || !selected_theme) {
        return Response.json({ error: 'Missing user_name or selected_theme' }, { status: 400 });
    }

    try {
        await env.DB
            .prepare('INSERT INTO audit_log (user_name, selected_theme) VALUES (?, ?)')
            .bind(user_name, selected_theme)
            .run();
        return Response.json({ success: true });
    } catch (error) {
        console.error('Audit Error:', error);
        return Response.json({ error: 'Failed to log audit data' }, { status: 500 });
    }
}
