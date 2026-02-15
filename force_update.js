require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function forceUpdate() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing single update with force selection...');
    const testUrl = 'https://www.autotrader.co.uk/car-details/202509266651017?utm_source=share&utm_medium=android-app';

    // 1. Update
    const { error: updateError } = await supabase
        .from('cars')
        .update({ year: '2015' })
        .eq('url', testUrl);

    if (updateError) {
        console.error('Update Error:', updateError.message);
        return;
    }
    console.log('Update call successful.');

    // 2. Immediate Read back
    const { data, error: readError } = await supabase
        .from('cars')
        .select('title, year')
        .eq('url', testUrl)
        .single();

    if (readError) {
        console.error('Read Error:', readError.message);
    } else {
        console.log('Read back data:', data);
    }
}

forceUpdate();
