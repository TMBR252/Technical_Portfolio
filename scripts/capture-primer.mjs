/**
 * Capture Primer marketing screenshots into public/project/primer{n}.webp
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'project');
const base = 'https://primer-landing-page.vercel.app';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shots = [
    { n: 1, path: '/', name: 'hero', wait: 3000 },
    { n: 2, path: '/', name: 'dashboard', scrollY: 750, wait: 2500 },
    { n: 3, path: '/', name: 'product-flow', scrollY: 2000, wait: 2500 },
    { n: 4, path: '/use-case', name: 'usecase', wait: 3000 },
    { n: 5, path: '/pricing', name: 'pricing', wait: 3000 },
    { n: 6, path: '/access', name: 'access', wait: 3000 },
    {
        n: 7,
        path: '/',
        name: 'search-detail',
        clip: { x: 180, y: 180, width: 1080, height: 560 },
        wait: 3000,
    },
    { n: 8, path: '/contact', name: 'contact', wait: 3000 },
];

async function saveWebp(buffer, n) {
    const out = path.join(outDir, `primer${n}.webp`);
    await sharp(buffer).webp({ quality: 82 }).toFile(out);
    const stat = fs.statSync(out);
    console.log(`wrote ${out} (${Math.round(stat.size / 1024)}kb)`);
}

async function main() {
    fs.mkdirSync(outDir, { recursive: true });
    const browser = await chromium.launch({
        headless: true,
        executablePath: chromePath,
    });
    const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
    });

    for (const shot of shots) {
        const url = `${base}${shot.path}`;
        console.log('capturing', shot.name, url);
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
            await page.waitForTimeout(shot.wait || 2000);

            if (shot.scrollY) {
                await page.evaluate((y) => window.scrollTo(0, y), shot.scrollY);
                await page.waitForTimeout(1000);
            }

            const buffer = shot.clip
                ? await page.screenshot({ type: 'png', clip: shot.clip })
                : await page.screenshot({ type: 'png' });
            await saveWebp(buffer, shot.n);
        } catch (err) {
            console.error('failed', shot.name, err.message);
        }
    }

    await browser.close();
    console.log('done');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
