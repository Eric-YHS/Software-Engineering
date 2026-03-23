const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// All tasks merged
const tasks = [
    // Hotpot Items
    { term: '精品肥牛卷 火锅', filename: 'hotpot-beef.jpg' },
    { term: '手切鲜羊肉 盘装', filename: 'hotpot-lamb.jpg' },
    { term: '黑毛肚 火锅', filename: 'hotpot-tripe-proxy.jpg' },
    { term: '潮汕牛肉丸 生丸', filename: 'hotpot-meatballs.jpg' },
    { term: '四川宽粉', filename: 'hotpot-noodles.jpg' },
    { term: '金针菇', filename: 'hotpot-enoki.jpg' },
    // Fruit Items
    { term: '丹东红颜草莓', filename: 'fruit-strawberry.jpg' },
    { term: '智利车厘子', filename: 'fruit-cherry.jpg' },
    { term: '丑橘 粑粑柑', filename: 'fruit-orange.jpg' },
    // Breakfast Items
    { term: '土鸡蛋 篮子', filename: 'daily-eggs.jpg' },
    { term: '纯牛奶', filename: 'daily-milk.jpg' },
    { term: '上海青', filename: 'daily-veg.jpg' },
    // Collections Covers
    { term: '火锅 聚餐', filename: 'collection-hotpot-cover.jpg' },
    { term: '新鲜水果', filename: 'collection-fruit-cover.jpg' },
    { term: '健康早餐', filename: 'collection-daily-cover.jpg' },
    { term: '生鲜超市', filename: 'collection-default.jpg' },
    { term: '海鲜市场', filename: 'collection-seafood.jpg' },
    { term: '菜市场', filename: 'collection-weekend.jpg' },
    { term: '绿色蔬菜', filename: 'collection-veg.jpg' },
    { term: '生鲜电商 海报', filename: 'hero-bg.jpg' },
    // Legacy Product Names (Just in case seeds use them, though I updated seeds to use hotpot-xxx)
    // But wait, my seeds.sql USES hotpot-beef.jpg etc now.
    // So I don't need prod-apple.jpg unless I revert seeds.
    // Wait, the LAST seeds.sql I wrote used '/images/hotpot-beef.jpg'.
    // So I only need the hotpot/fruit/daily lists.
    // I will add the 'prod-' ones just to be safe if I missed any mapping.
    { term: '红富士苹果', filename: 'prod-apple.jpg' },
    { term: '进口香蕉', filename: 'prod-banana.jpg' },
    { term: '西兰花', filename: 'prod-broccoli.jpg' },
    { term: '三文鱼刺身', filename: 'prod-salmon.jpg' },
    { term: '眼肉牛排', filename: 'prod-steak.jpg' },
    { term: '老面馒头', filename: 'prod-bread.jpg' },
    { term: '牛油果', filename: 'prod-avocado.jpg' },
    { term: '蓝莓', filename: 'prod-blueberry.jpg' }
];

const outputDir = path.join(__dirname, '../client/public/images');

// Ensure dir exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 800, height: 800 }, // Square viewport for better thumbnails
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    });
    const page = await context.newPage();

    for (const task of tasks) {
        console.log(`Processing: ${task.term}...`);
        
        try {
            await page.goto(`https://cn.bing.com/images/search?q=${encodeURIComponent(task.term)}&first=1&scenario=ImageBasicHover`);
            
            const selector = '.mimg';
            await page.waitForSelector(selector, { timeout: 5000 });
            
            const elements = await page.$$(selector);
            if (elements.length > 0) {
                let captured = false;
                // Try first 3 images
                for (let i = 0; i < Math.min(elements.length, 3); i++) {
                    const el = elements[i];
                    if (await el.isVisible()) {
                        // Screenshot ONLY the image element
                        await el.screenshot({ path: path.join(outputDir, task.filename) });
                        console.log(`  -> Saved screenshot to ${task.filename}`);
                        captured = true;
                        break;
                    }
                }
                if (!captured) console.log('  -> No visible image found to screenshot.');
            } else {
                console.log('  -> No image results found.');
            }
            
        } catch (e) {
            console.error(`  -> Error: ${e.message}`);
        }
        
        await page.waitForTimeout(500);
    }

    await browser.close();
    console.log('Done!');
})();
