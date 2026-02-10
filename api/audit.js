module.exports = async (req, res) => {
    const { createClient } = require('@supabase/supabase-js');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
    const supabaseKey = (process.env.SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Database configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { user_name, selected_theme } = req.body;

    if (!user_name || !selected_theme) {
        return res.status(400).json({ error: 'Missing user_name or selected_theme' });
    }

    try {
        const { data, error } = await supabase
            .from('audit_log')
            .insert([{ user_name, selected_theme }]);

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Audit Error:', error);
        res.status(500).json({ error: 'Failed to log audit data' });
    }
};
