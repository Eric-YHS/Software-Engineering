const { chromium } = require('playwright');
const path = require('path');

const tasks = [
    { term: '精品肥牛卷 火锅 食材 高清', filename: 'hotpot-beef.jpg' },
    { term: '手切鲜羊肉 盘装 火锅', filename: 'hotpot-lamb.jpg' },
    { term: '黑毛肚 火锅食材 特写', filename: 'hotpot-tripe-proxy.jpg' },
    { term: '潮汕牛肉丸 生丸', filename: 'hotpot-meatballs.jpg' },
    { term: '四川宽粉 红薯粉条 湿粉', filename: 'hotpot-noodles.jpg' },
    { term: '金针菇 新鲜 蔬菜', filename: 'hotpot-enoki.jpg' },
    { term: '丹东红颜草莓 礼盒', filename: 'fruit-strawberry.jpg' },
    { term: '智利车厘子 JJJ级', filename: 'fruit-cherry.jpg' },
    { term: '春见粑粑柑 丑橘', filename: 'fruit-orange.jpg' },
    { term: '土鸡蛋 篮子 鸡蛋', filename: 'daily-eggs.jpg' },
    { term: '纯牛奶 玻璃杯 早餐', filename: 'daily-milk.jpg' },
    { term: '上海青 小油菜 新鲜', filename: 'daily-veg.jpg' },
    { term: '火锅 聚餐 场景 俯拍', filename: 'collection-hotpot-cover.jpg' },
    { term: '新鲜水果 堆放 缤纷', filename: 'collection-fruit-cover.jpg' },
    { term: '健康早餐 牛奶 面包 鸡蛋', filename: 'collection-daily-cover.jpg' }
];

const outputDir = path.join(__dirname, '../client/public/images');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 } // Larger viewport
    });
    const page = await context.newPage();

    for (const task of tasks) {
        console.log(`Processing HD: ${task.term}...`);
        try {
            await page.goto(`https://cn.bing.com/images/search?q=${encodeURIComponent(task.term)}&first=1`);
            
            // Wait for results
            const firstResult = page.locator('.mimg').first();
            await firstResult.waitFor({ timeout: 5000 });

            // Click the first image to open the detail view (which loads a higher res preview)
            await firstResult.click();

            // Wait for the detail view image to load
            // Bing detail view usually has a large image with class 'nofocus' or inside a container
            // We look for the large image container. The structure varies, but usually it's in an overlay.
            // Let's try to find the large image by looking for a large img tag that appeared.
            
            // Wait a bit for animation
            await page.waitForTimeout(2000);

            // Strategy: Screenshot the center detail view area.
            // The main image usually has a class like 'mainImage' or is inside 'imgContainer'
            
            // Selector for the large preview image in Bing's overlay
            const hdImageSelector = '.iovr-img, .mainImage, .imgContainer img'; 
            
            // Try to locate the large image
            const hdImage = page.locator(hdImageSelector).first();
            
            if (await hdImage.count() > 0 && await hdImage.isVisible()) {
                 console.log('  -> Found HD preview, taking screenshot...');
                 await hdImage.screenshot({ path: path.join(outputDir, task.filename) });
            } else {
                 console.log('  -> HD preview not found, falling back to thumbnail screenshot...');
                 // Fallback: screenshot the thumbnail we clicked (but it might be covered now?)
                 // Better to just reload and screenshot thumbnail
                 await page.reload();
                 await page.locator('.mimg').first().screenshot({ path: path.join(outputDir, task.filename) });
            }

        } catch (e) {
            console.error(`  -> Error: ${e.message}`);
        }
        await page.waitForTimeout(500);
    }

    await browser.close();
    console.log('HD Fetch Done!');
})();
