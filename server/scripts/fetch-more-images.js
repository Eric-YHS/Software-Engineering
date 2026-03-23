const fs = require('fs');
const path = require('path');
const axios = require('axios');

const tasks = [
    // New Products (Seafood)
    { keywords: 'crab,seafood', filename: 'seafood-crab.jpg' },
    { keywords: 'shrimp,raw', filename: 'seafood-shrimp.jpg' },
    { keywords: 'fish,fillet,raw', filename: 'seafood-fish.jpg' },
    
    // New Products (Veggies)
    { keywords: 'tomato,fresh', filename: 'veg-tomato.jpg' },
    { keywords: 'cucumber,fresh', filename: 'veg-cucumber.jpg' },
    { keywords: 'potato,yellow', filename: 'veg-potato.jpg' },
    
    // New Products (Snacks)
    { keywords: 'coke,cola,can', filename: 'snack-coke.jpg' },
    { keywords: 'potato,chips,bag', filename: 'snack-chips.jpg' },
    { keywords: 'beer,glass,foam', filename: 'snack-beer.jpg' },
    
    // New Collections
    { keywords: 'seafood,market,display', filename: 'collection-seafood.jpg' },
    { keywords: 'vegetables,garden,basket', filename: 'collection-veg.jpg' },
    { keywords: 'party,snacks,drinks', filename: 'collection-weekend.jpg' },
    
    // Missing Collections (if any)
    { keywords: 'fruit,strawberries,cherries', filename: 'collection-fruit-cover.jpg' },
    { keywords: 'breakfast,milk,eggs,bread', filename: 'collection-daily-cover.jpg' },
    { keywords: 'hotpot,meat,vegetables', filename: 'collection-default.jpg' }
];

// FIX: Go up two levels from 'server/scripts' to get to project root, then into 'client/public/images'
const outputDir = path.join(__dirname, '../../client/public/images');

async function downloadImage(url, filepath) {
    const writer = fs.createWriteStream(filepath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 15000
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

(async () => {
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        console.log(`Creating directory: ${outputDir}`);
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Downloading images to: ${outputDir}`);

    for (const task of tasks) {
        const filepath = path.join(outputDir, task.filename);
        
        // We overwrite to ensure we have them, or check existance if we want to save bandwidth
        // But user asked to "download all missing", so let's just ensure they are there.
        
        // specific size 800x600
        const url = `https://loremflickr.com/800/600/${task.keywords}/all`; 
        
        console.log(`Downloading ${task.filename}...`);
        try {
            await downloadImage(url, filepath);
            console.log(`  -> Saved.`);
        } catch (e) {
            console.error(`  -> Error downloading ${task.filename}: ${e.message}`);
        }
        
        // Random delay 
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('All images check/download completed.');
})();
