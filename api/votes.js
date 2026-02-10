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

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('votes')
                .select('car_url, user_name');

            if (error) throw error;
            res.status(200).json(data);
        } catch (error) {
            console.error('Fetch Votes Error:', error);
            res.status(500).json({ error: 'Failed to fetch votes' });
        }
    } else if (req.method === 'POST') {
        const { car_url, user_name } = req.body;

        if (!car_url || !user_name) {
            return res.status(400).json({ error: 'Missing car_url or user_name' });
        }

        try {
            // Check if vote exists
            const { data: existingVote, error: fetchError } = await supabase
                .from('votes')
                .select('*')
                .eq('car_url', car_url)
                .eq('user_name', user_name)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (existingVote) {
                // Remove vote (toggle off)
                const { error: deleteError } = await supabase
                    .from('votes')
                    .delete()
                    .eq('id', existingVote.id);

                if (deleteError) throw deleteError;
                res.status(200).json({ success: true, action: 'removed' });
            } else {
                // Add vote (toggle on)
                const { error: insertError } = await supabase
                    .from('votes')
                    .insert([{ car_url, user_name }]);

                if (insertError) throw insertError;
                res.status(200).json({ success: true, action: 'added' });
            }
        } catch (error) {
            console.error('Toggle Vote Error:', error);
            res.status(500).json({ error: 'Failed to toggle vote' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
