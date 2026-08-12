import { portfolioData } from '@/data/portfolio';

export type CoverageKind = 'tool' | 'stack';

export type CoverageItem = {
    name: string;
    icon: string;
    kind: CoverageKind;
    description: string;
    count: number;
    /** Black-by-default artwork; force white on dark surfaces. */
    invertDark?: boolean;
};

const SI = 'https://cdn.simpleicons.org';

const ALIASES: Record<string, string> = {
    Tailwind: 'Tailwind CSS',
    'Mapbox GL': 'Mapbox',
    'Mapbox GL JS': 'Mapbox',
    'Revit API': 'Revit',
    '.NET 8': '.NET',
    'ASP.NET Core': '.NET',
    'Claude': 'Claude Code',
    'Anthropic Claude': 'Claude Code',
};

const SKIP = new Set([
    'Systems Mapping',
    'Service Design',
    'Prototyping',
    'NEC Constraint Modeling',
    'Point-of-Sale Hardware',
    'Blockchain',
    'Census ACS',
    'Server-Sent Events',
    'Vector tiles',
    'HTML',
    'CSS',
    'Shell',
    'SQL',
    'PL/pgSQL',
    'OpenClaw',
    'Lob',
    'Telegram',
    'JavaScript',
    'Framer Motion',
    'React Router',
    'NumPy',
    'SciPy',
    'Shapely',
    'pyproj',
    'polylabel',
    'Turf.js',
    'deck.gl',
    'Cesium',
    'Radix UI',
    'TanStack Query',
    'Zustand',
    'Recharts',
    'Express',
    'Zod',
    'Uvicorn',
    'node-cron',
    'asyncpg',
    'PostGIS',
    'pgvector',
    'DuckDB',
    'Supabase Storage',
    'OpenAI',
    'Google Gemini',
    'Mistral',
    'Hugging Face',
    'Model Context Protocol',
    'sentence-transformers',
    'FAISS',
    'Firecrawl',
    'Tavily',
    'ReportLab',
    'python-docx',
    'openpyxl',
    'python-pptx',
    'react-markdown',
    'Vitest',
    'pytest',
    'Testing Library',
    'Puppeteer',
    'supertest',
    'Stripe',
    'Cloudflare',
    'Google OAuth',
]);

/** Artwork that ships black by default and disappears on dark tiles. */
const DARK_ARTWORK = new Set([
    'Cursor',
    'Claude Code',
    'Claude Design',
    'Ollama',
    'Vercel',
    'Notion',
    'Railway',
    'Revit',
    'Mapbox',
    'ArcGIS',
    'Miro',
    'Next.js',
]);

const TOOL_NAMES = new Set([
    'Figma',
    'Cursor',
    'Claude Design',
    'Claude Code',
    'Miro',
    'Notion',
    'Framer',
    'Blender',
    'Photoshop',
    'Illustrator',
    'After Effects',
    'Premiere Pro',
    'Revit',
    'Ollama',
    'Playwright',
]);

const ICONS: Record<string, string> = {
    Figma: '/icons/figma.svg',
    Cursor: '/icons/cursor.svg',
    'Claude Design': '/icons/claude-design.svg',
    'Claude Code': '/icons/claude-code.svg',
    Miro: '/icons/miro.svg',
    Notion: '/icons/notion.svg',
    Framer: '/icons/framer.svg',
    Blender: '/icons/blender.svg',
    Photoshop: '/icons/photoshop.svg',
    Illustrator: '/icons/illustrator.svg',
    'After Effects': '/icons/after-effects.svg',
    'Premiere Pro': '/icons/premiere-pro.svg',
    Revit: '/icons/revit.svg',
    Ollama: '/icons/ollama.svg',
    Playwright: '/icons/playwright.svg',
    React: '/icons/react.svg',
    TypeScript: '/icons/typescript.svg',
    'Next.js': '/icons/next-js.svg',
    Vite: '/icons/vite.svg',
    'Tailwind CSS': '/icons/tailwind-css.svg',
    'Node.js': '/icons/node-js.svg',
    Python: '/icons/python.svg',
    PostgreSQL: '/icons/postgresql.svg',
    Supabase: '/icons/supabase.svg',
    Mapbox: '/icons/mapbox.svg',
    FastAPI: '/icons/fastapi.svg',
    'Drizzle ORM': '/icons/drizzle-orm.svg',
    SQLite: '/icons/sqlite.svg',
    'C#': '/icons/c.svg',
    '.NET': '/icons/net.svg',
    ArcGIS: '/icons/arcgis.svg',
    Docker: '/icons/docker.svg',
    Vercel: '/icons/vercel.svg',
    Railway: '/icons/railway.svg',
    RunPod: '/icons/runpod.png',
};

const DESCRIPTIONS: Record<string, string> = {
    Figma: 'Interface, systems, and prototypes across the sample case studies.',
    Cursor: 'Where the build is directed with AI across the web products.',
    'Claude Design': 'Visual exploration and layout direction on the sample sites.',
    'Claude Code': 'Implementation partner on Meridian Health, StyleBook, and Homestead.',
    Miro: 'Mapping and synthesis on Meridian Health workflows.',
    Notion: 'Research and writing across the sample case studies.',
    Framer: 'Marketing and content sites, designed and assembled here.',
    Blender: 'Form studies for hardware and motion concepts.',
    Photoshop: 'Image and brand production across the design projects.',
    Illustrator: 'Identity and 2D systems on StyleBook and North Light.',
    'After Effects': 'Motion studies for sample product films.',
    'Premiere Pro': 'Edit and promo cuts for sample product films.',
    Revit: 'Host environment for spatial add-in concepts.',
    Ollama: 'Local models in the sample agent workspace.',
    Playwright: 'Browser automation in sample product flows.',
    React: 'Interface layer in Meridian Health, StyleBook, and this site.',
    TypeScript: 'Typed product surfaces in the web case studies.',
    'Next.js': 'This portfolio kit and sample product consoles.',
    Vite: 'Sample marketing sites and product workspaces.',
    'Tailwind CSS': 'Visual system on the web products.',
    'Node.js': 'Runtime behind the sample web products.',
    Python: 'Ingest and agents on Homestead and North Light.',
    PostgreSQL: 'System of record on Meridian Health and Homestead.',
    Supabase: 'Auth and data on the sample public sites.',
    Mapbox: 'Mapped context on Homestead.',
    FastAPI: 'Service layer on Homestead and North Light.',
    'Drizzle ORM': 'Data layer on Homestead and Meridian Health.',
    SQLite: 'Local persistence on sample tools.',
    'C#': 'Add-in language for spatial tooling concepts.',
    '.NET': 'Add-in and resource API for spatial tooling concepts.',
    ArcGIS: 'Parcel and site proof in Homestead.',
    Docker: 'Delivery on the sample platforms.',
    Vercel: 'Hosting for the sample public sites.',
    Railway: 'Sample platform deployment.',
    RunPod: 'GPU jobs on sample platforms.',
};

function canonicalName(raw: string): string {
    return ALIASES[raw] ?? raw;
}

function iconFor(name: string): string {
    if (ICONS[name]) return ICONS[name];
    return `${SI}/${name.toLowerCase().replace(/[\s.]/g, '')}`;
}

function kindFor(name: string, fromToolsField: boolean): CoverageKind {
    if (fromToolsField || TOOL_NAMES.has(name)) return 'tool';
    return 'stack';
}

export function projectCoverage(): { tools: CoverageItem[]; stack: CoverageItem[] } {
    const seen = new Map<string, CoverageItem>();

    for (const project of portfolioData.projects) {
        const toolSet = new Set(project.tools.map(canonicalName));
        const names = [...new Set([...project.techStack, ...project.tools].map(canonicalName))];

        for (const name of names) {
            if (SKIP.has(name)) continue;

            const existing = seen.get(name);
            if (existing) {
                existing.count += 1;
                if (toolSet.has(name)) existing.kind = 'tool';
                continue;
            }

            seen.set(name, {
                name,
                icon: iconFor(name),
                kind: kindFor(name, toolSet.has(name)),
                description: DESCRIPTIONS[name] ?? `Shows up in the ${project.title} case study.`,
                count: 1,
                invertDark: DARK_ARTWORK.has(name) || undefined,
            });
        }
    }

    const items = [...seen.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return {
        tools: items.filter((item) => item.kind === 'tool'),
        stack: items.filter((item) => item.kind === 'stack'),
    };
}
