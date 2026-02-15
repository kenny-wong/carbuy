const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
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

    const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
    const supabaseKey = (process.env.SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Database configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
        const { car_url, status, user_name } = req.body;

        if (!car_url || !status || !user_name) {
            return res.status(400).json({ error: 'Missing car_url, status or user_name' });
        }

        // Simple check for family members
        const familyMembers = ['Kenny', 'Gubie', 'Hayley', 'Chloe'];
        if (!familyMembers.includes(user_name)) {
            return res.status(403).json({ error: 'Unauthorized: Only family members can update car status' });
        }

        try {
            const { error } = await supabase
                .from('cars')
                .update({ status })
                .eq('url', car_url);

            if (error) throw error;

            res.status(200).json({ success: true, status });
        } catch (error) {
            console.error('Update Car Error:', error);
            res.status(500).json({ error: 'Failed to update car' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
