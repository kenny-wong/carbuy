require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testPermission() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing column update vs title update...');
    const testUrl = 'https://www.autotrader.co.uk/car-details/202509266651017?utm_source=share&utm_medium=android-app';

    // 1. Try to update 'has_rear_camera' (an existing working column)
    const { error: err1 } = await supabase
        .from('cars')
        .update({ has_rear_camera: true })
        .eq('url', testUrl);

    console.log('Update has_rear_camera:', err1 ? err1.message : 'OK');

    // 2. Try to update 'year'
    const { error: err2 } = await supabase
        .from('cars')
        .update({ year: '2015' })
        .eq('url', testUrl);

    console.log('Update year:', err2 ? err2.message : 'OK');

    // 3. Select back
    const { data } = await supabase
        .from('cars')
        .select('has_rear_camera, year')
        .eq('url', testUrl)
        .single();

    console.log('Final Data:', data);
}

testPermission();
