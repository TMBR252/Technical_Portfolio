/**
 * Migrate hardcoded #D1FF4D brand hexes to Tailwind `brand` + CSS vars.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const files = [
    'src/components/layout/Navbar.tsx',
    'src/components/ui/CardNav.tsx',
    'src/components/ui/argent-loop-infinite-slider.tsx',
    'src/components/ui/impact-section.tsx',
    'src/components/ui/team-showcase.tsx',
    'src/components/sections/IdentitySequence.tsx',
    'src/components/sections/ProjectStats.tsx',
    'src/components/sections/EducationSection.tsx',
    'src/components/sections/HeroVisual.tsx',
    'src/components/projects/ProjectPageContent.tsx',
    'src/app/projects/page.tsx',
    'src/app/experience/page.tsx',
    'messages/en.json',
];

function migrate(content) {
    let s = content;

    // rgba(209,255,77,a) → rgb(var(--brand-rgb)/a)
    s = s.replace(
        /rgba\(\s*209\s*,\s*255\s*,\s*77\s*,\s*([0-9.]+)\s*\)/g,
        'rgb(var(--brand-rgb)/$1)'
    );

    // Mark hex so we can transform class forms safely
    s = s.replace(/#D1FF4D/gi, '§BRAND§');

    const subs = [
        [/hover:bg-\[§BRAND§\]\/(\d+)/g, 'hover:bg-brand/$1'],
        [/active:bg-\[§BRAND§\]\/(\d+)/g, 'active:bg-brand/$1'],
        [/bg-\[§BRAND§\]\/(\d+)/g, 'bg-brand/$1'],
        [/bg-\[§BRAND§\]/g, 'bg-brand'],
        [/hover:text-\[§BRAND§\]/g, 'hover:text-brand'],
        [/active:text-\[§BRAND§\]/g, 'active:text-brand'],
        [/group-hover:text-\[§BRAND§\]/g, 'group-hover:text-brand'],
        [/text-\[§BRAND§\]/g, 'text-brand'],
        [/from-\[§BRAND§\]\/(\d+)/g, 'from-brand/$1'],
        [/from-\[§BRAND§\]/g, 'from-brand'],
        [/via-\[§BRAND§\]\/(\d+)/g, 'via-brand/$1'],
        [/via-\[§BRAND§\]/g, 'via-brand'],
        [/to-\[§BRAND§\]\/(\d+)/g, 'to-brand/$1'],
        [/to-\[§BRAND§\]/g, 'to-brand'],
        [/hover:border-\[§BRAND§\]\/(\d+)/g, 'hover:border-brand/$1'],
        [/group-hover:border-\[§BRAND§\]\/(\d+)/g, 'group-hover:border-brand/$1'],
        [/hover:border-\[§BRAND§\]/g, 'hover:border-brand'],
        [/group-hover:border-\[§BRAND§\]/g, 'group-hover:border-brand'],
        [/border-\[§BRAND§\]\/(\d+)/g, 'border-brand/$1'],
        [/border-\[§BRAND§\]/g, 'border-brand'],
        [/focus-visible:ring-\[§BRAND§\]\/(\d+)/g, 'focus-visible:ring-brand/$1'],
        [/hover:shadow-\[§BRAND§\]\/(\d+)/g, 'hover:shadow-brand/$1'],
        [/shadow-\[§BRAND§\]\/(\d+)/g, 'shadow-brand/$1'],
    ];

    for (const [re, rep] of subs) {
        s = s.replace(re, rep);
    }

    // Any leftover hex marker (inline styles, gradients) → CSS var
    s = s.replace(/§BRAND§/g, 'var(--brand)');

    // Companion deep green used in brand gradients
    s = s.replace(/to-\[#7BA82E\]/gi, 'to-brand-deep');
    s = s.replace(/#7BA82E/gi, 'var(--brand-deep)');
    s = s.replace(/#c1e44a/gi, 'var(--brand)');

    // impact-section hard black on brand → brand-foreground
    s = s.replace(/text-\[#111111\]/g, 'text-brand-foreground');

    return s;
}

for (const rel of files) {
    const p = path.join(root, rel);
    const before = fs.readFileSync(p, 'utf8');
    const after = migrate(before);
    if (after !== before) {
        fs.writeFileSync(p, after);
        console.log('updated', rel);
    } else {
        console.log('unchanged', rel);
    }
}

// Sanity: no stripped opacities
const bad = [];
for (const rel of files) {
    const s = fs.readFileSync(path.join(root, rel), 'utf8');
    if (/brand\/(?![0-9])/.test(s) || /brand-rgb\)\/\]/.test(s) || /brand-rgb\)\/\)/.test(s)) {
        bad.push(rel);
    }
}
if (bad.length) {
    console.error('STRIPPED_OPACITY in:', bad.join(', '));
    process.exit(1);
}
console.log('ok');
