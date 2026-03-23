const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const tasks = [
    { term: '精品肥牛卷 火锅', filename: 'hotpot-beef.jpg' },
    { term: '手切鲜羊肉 盘装', filename: 'hotpot-lamb.jpg' },
    { term: '黑毛肚 火锅', filename: 'hotpot-tripe-proxy.jpg' },
    { term: '潮汕牛肉丸 生丸', filename: 'hotpot-meatballs.jpg' },
    { term: '四川宽粉', filename: 'hotpot-noodles.jpg' },
    { term: '金针菇', filename: 'hotpot-enoki.jpg' },
    { term: '丹东红颜草莓', filename: 'fruit-strawberry.jpg' },
    { term: '智利车厘子', filename: 'fruit-cherry.jpg' },
    { term: '丑橘 粑粑柑', filename: 'fruit-orange.jpg' },
    { term: '土鸡蛋 篮子', filename: 'daily-eggs.jpg' },
    { term: '纯牛奶', filename: 'daily-milk.jpg' },
    { term: '上海青', filename: 'daily-veg.jpg' },
    { term: '火锅 聚餐', filename: 'collection-hotpot-cover.jpg' },
    { term: '新鲜水果', filename: 'collection-fruit-cover.jpg' },
    { term: '健康早餐', filename: 'collection-daily-cover.jpg' },
    { term: '生鲜超市', filename: 'collection-default.jpg' },
    { term: '海鲜市场', filename: 'collection-seafood.jpg' },
    { term: '菜市场', filename: 'collection-weekend.jpg' },
    { term: '绿色蔬菜', filename: 'collection-veg.jpg' },
    { term: '生鲜电商 海报', filename: 'hero-bg.jpg' }
];

const outputDir = path.join(__dirname, '../client/public/images');

(async () => {
    // Launch with headless: true
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    for (const task of tasks) {
        console.log(`Processing: ${task.term}...`);
        
        try {
            // Go to Bing Images
            await page.goto(`https://cn.bing.com/images/search?q=${encodeURIComponent(task.term)}&first=1&scenario=ImageBasicHover`);
            
            // Wait for the first image result to appear
            // .mimg is the class for thumbnail images in Bing
            const selector = '.mimg';
            await page.waitForSelector(selector, { timeout: 5000 });
            
            const elements = await page.$$(selector);
            if (elements.length > 0) {
                // Take screenshot of the first valid image element
                // We try the first few in case the first one is an ad or weird
                let captured = false;
                for (let i = 0; i < Math.min(elements.length, 3); i++) {
                    const el = elements[i];
                    if (await el.isVisible()) {
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
        
        // Small delay
        await page.waitForTimeout(500);
    }

    await browser.close();
    console.log('All tasks completed.');
})();