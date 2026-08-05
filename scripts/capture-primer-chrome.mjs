/**
 * Capture Primer pages via Chrome headless with virtual-time budget so the SPA paints.
 */
import { spawn } from 'child_process';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'project');
const tmpDir = path.join(outDir, '_tmp');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = 'https://primer-landing-page.vercel.app';

function runChrome(url, pngPath, height = 900) {
    return new Promise((resolve, reject) => {
        const args = [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--no-sandbox',
            '--run-all-compositor-stages-before-draw',
            '--virtual-time-budget=20000',
            `--window-size=1440,${height}`,
            `--screenshot=${pngPath}`,
            url,
        ];
        const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let err = '';
        child.stderr.on('data', (d) => {
            err += d.toString();
        });
        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0 && fs.existsSync(pngPath) && fs.statSync(pngPath).size > 50000) {
                resolve();
            } else {
                reject(
                    new Error(
                        `chrome exit ${code} size=${fs.existsSync(pngPath) ? fs.statSync(pngPath).size : 0} ${err.slice(0, 200)}`
                    )
                );
            }
        });
    });
}

async function toWebp(png, n) {
    const out = path.join(outDir, `primer${n}.webp`);
    await sharp(png).webp({ quality: 82 }).toFile(out);
    console.log('wrote', out, Math.round(fs.statSync(out).size / 1024) + 'kb');
}

async function main() {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.mkdirSync(outDir, { recursive: true });

    const pages = [
        { n: 1, url: `${base}/`, h: 900 },
        { n: 4, url: `${base}/use-case`, h: 900 },
        { n: 5, url: `${base}/pricing`, h: 900 },
        { n: 6, url: `${base}/access`, h: 900 },
        { n: 8, url: `${base}/contact`, h: 900 },
    ];

    for (const shot of pages) {
        const png = path.join(tmpDir, `shot${shot.n}.png`);
        console.log('capturing', shot.url);
        try {
            await runChrome(shot.url, png, shot.h);
            await toWebp(png, shot.n);
        } catch (e) {
            console.error('fail', shot.n, e.message);
        }
    }

    const tallPng = path.join(tmpDir, 'tall.png');
    console.log('capturing tall homepage');
    try {
        await runChrome(`${base}/`, tallPng, 3600);
        const meta = await sharp(tallPng).metadata();
        const w = meta.width;
        const h = meta.height;
        console.log('tall', w, h, fs.statSync(tallPng).size);

        await sharp(tallPng)
            .extract({ left: 0, top: Math.floor(h * 0.26), width: w, height: Math.min(Math.floor(h * 0.28), h - Math.floor(h * 0.26)) })
            .webp({ quality: 82 })
            .toFile(path.join(outDir, 'primer2.webp'));
        console.log('wrote primer2.webp');

        await sharp(tallPng)
            .extract({ left: 0, top: Math.floor(h * 0.5), width: w, height: Math.min(Math.floor(h * 0.3), h - Math.floor(h * 0.5)) })
            .webp({ quality: 82 })
            .toFile(path.join(outDir, 'primer3.webp'));
        console.log('wrote primer3.webp');

        const heroPng = path.join(tmpDir, 'shot1.png');
        if (fs.existsSync(heroPng) && fs.statSync(heroPng).size > 50000) {
            const hm = await sharp(heroPng).metadata();
            await sharp(heroPng)
                .extract({
                    left: Math.floor(hm.width * 0.1),
                    top: Math.floor(hm.height * 0.2),
                    width: Math.floor(hm.width * 0.8),
                    height: Math.floor(hm.height * 0.58),
                })
                .webp({ quality: 82 })
                .toFile(path.join(outDir, 'primer7.webp'));
            console.log('wrote primer7.webp');
        }
    } catch (e) {
        console.error('tall fail', e.message);
    }

    console.log('done');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
