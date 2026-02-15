require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing INSERT with year...');
    const uniqueUrl = 'https://test-url-' + Date.now();

    // 1. Insert
    const { error: insertError } = await supabase
        .from('cars')
        .insert({
            url: uniqueUrl,
            title: 'Test Year Car',
            year: '2025',
            price: '£0',
            mileage: '0 miles',
            transmission: 'Test',
            engine_fuel: 'Test',
            image_url: 'https://test.com'
        });

    if (insertError) {
        console.error('Insert Error:', insertError.message);
        return;
    }
    console.log('Insert successful.');

    // 2. Read back
    const { data, error: readError } = await supabase
        .from('cars')
        .select('*')
        .eq('url', uniqueUrl)
        .single();

    if (readError) {
        console.error('Read Error:', readError.message);
    } else {
        console.log('Inserted Data:', data);
    }

    // 3. Cleanup
    await supabase.from('cars').delete().eq('url', uniqueUrl);
    console.log('Cleanup done.');
}

testInsert();
