const https = require('https');
const fs = require('fs');

// Search for med spas using Google Places API alternative (SerpAPI)
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const cities = [
    'Los Angeles, CA',
    'Miami, FL',
    'New York, NY',
    'Dallas, TX',
    'Atlanta, GA',
    'Phoenix, AZ',
    'Denver, CO',
    'Las Vegas, NV',
    'San Diego, CA',
    'Houston, TX'
];

async function searchMedSpas(city) {
    return new Promise((resolve, reject) => {
        const query = encodeURIComponent(`med spa ${city}`);
        const url = `https://serpapi.com/search.json?q=${query}&tbm=lcl&api_key=${SERPAPI_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const results = JSON.parse(data);
                    const places = results.local_results || [];
                    resolve(places.map(p => ({
                        name: p.title,
                        address: p.address,
                        phone: p.phone,
                        rating: p.rating,
                        reviews: p.reviews,
                        city: city
                    })));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('🔍 Generating Med Spa leads...\n');

    let allLeads = [];

    for (const city of cities) {
        console.log(`Searching: ${city}...`);
        try {
            const leads = await searchMedSpas(city);
            allLeads = allLeads.concat(leads);
            console.log(`  Found ${leads.length} med spas`);
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
    }

    // Save leads
    const filename = `medspa-leads-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(allLeads, null, 2));

    console.log(`\n✅ Saved ${allLeads.length} leads to ${filename}`);
}

main();
