// GET /api/cars — all listings, newest first
export async function onRequestGet({ env }) {
    try {
        const { results } = await env.DB
            .prepare('SELECT * FROM cars ORDER BY created_at DESC')
            .all();

        // D1 stores booleans as 1/0; the client compares against true
        const toBool = v => (v === null || v === undefined ? null : Boolean(v));
        const cars = results.map(car => ({
            ...car,
            has_carplay: toBool(car.has_carplay),
            has_rear_camera: toBool(car.has_rear_camera)
        }));

        return Response.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        return Response.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }
}
