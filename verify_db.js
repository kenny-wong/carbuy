require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function syncAndVerify() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing env vars');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const carData = JSON.parse(fs.readFileSync('car_data.json', 'utf8'));

    console.log(`Phase 1: Syncing ${carData.length} cars to DB...`);

    for (const car of carData) {
        if (car.title === 'Unavailable') continue;

        const { error } = await supabase
            .from('cars')
            .update({
                year: car.year,
                has_carplay: car.has_carplay,
                has_rear_camera: car.has_rear_camera,
                horsepower: car.horsepower,
                status: car.status || 'Available'
            })
            .eq('url', car.url);

        if (error) {
            console.error(`❌ Error updating ${car.title}:`, error.message);
        } else {
            console.log(`✅ Synced: ${car.title} -> Year: ${car.year}`);
        }
    }

    console.log('\nPhase 2: Verifying DB content...');
    const { data, error } = await supabase
        .from('cars')
        .select('title, year')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Verification failed:', error.message);
    } else {
        console.log(`Total cars in DB: ${data.length}`);
        data.forEach(car => {
            if (!car.year) {
                console.log(`🚩 WARNING: ${car.title} still has NULL year!`);
            } else {
                console.log(`   ${car.title}: ${car.year}`);
            }
        });
    }

    console.log('\nSync & Verification complete.');
}

syncAndVerify();
