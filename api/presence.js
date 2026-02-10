const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            // Get users seen in the last 2 minutes
            const twoMinutesAgo = new Date(Date.now() - 120 * 1000).toISOString();

            const { data, error } = await supabase
                .from('presence')
                .select('*')
                .gt('last_seen', twoMinutesAgo)
                .order('last_seen', { ascending: false });

            if (error) throw error;
            res.status(200).json(data);
        } catch (error) {
            console.error('Presence Fetch Error:', error);
            res.status(500).json({ error: 'Failed to fetch presence' });
        }
    } else if (req.method === 'POST') {
        const { user_name } = req.body;

        if (!user_name) {
            return res.status(400).json({ error: 'Missing user_name' });
        }

        try {
            // Upsert presence
            const { data, error } = await supabase
                .from('presence')
                .upsert({
                    user_name,
                    last_seen: new Date().toISOString()
                }, { onConflict: 'user_name' });

            if (error) throw error;
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Presence Heartbeat Error:', error);
            res.status(500).json({ error: 'Failed to update presence' });
        }
    }
};
