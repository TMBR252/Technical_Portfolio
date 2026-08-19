import { PortfolioData, TechGroup, CaseStudySection } from '@/types';

const SAMPLE_NOTE =
    'This is sample content for portfolio development. Replace it with your actual case studies when ready.';

const productTechGroups: TechGroup[] = [
    {
        label: 'Design',
        items: ['Figma', 'FigJam', 'Miro', 'Prototyping', 'User research'],
    },
    {
        label: 'Build',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
        label: 'Delivery',
        items: ['Vercel', 'Notion', 'Linear', 'GitHub'],
    },
];

function sampleCaseStudy(args: {
    problem: string;
    problemDetail: string;
    fix: string;
    happened: string;
    changed: string;
    constraints: string;
    learned: string;
    image: string;
    imageAlt: string;
}): CaseStudySection[] {
    return [
        {
            id: 'problem',
            label: 'Problem',
            body: args.problem,
            blocks: [
                {
                    title: 'The journey was never designed as one piece',
                    body: args.problemDetail,
                    image: args.image,
                    imageAlt: args.imageAlt,
                    imageCaption: 'Placeholder frame. Swap this SVG for a real artifact from the work.',
                },
            ],
        },
        {
            id: 'decision',
            label: 'The fix',
            body: args.fix,
        },
        {
            id: 'shipped',
            label: 'What happened',
            body: args.happened,
        },
        {
            id: 'outcome',
            label: 'What changed',
            body: args.changed,
        },
        {
            id: 'constraints',
            label: 'Constraints',
            body: args.constraints,
        },
        {
            id: 'reflection',
            label: 'What I learned',
            body: `${args.learned}\n\n${SAMPLE_NOTE}`,
        },
    ];
}

export const portfolioData: PortfolioData = {
    personal: {
        name: 'Bejaman',
        // Set your own: 'he/him', 'she/her', 'they/them'. Marvin uses this
        // verbatim instead of guessing from a name.
        pronouns: 'they/them',
        title: 'Product Designer',
        subtitle: 'Product designer in Chicago. I get excited about making complicated things simple.',
        bio: "I'm Bejaman, a product designer in Chicago who gets excited about making complicated things simple. Currently at Meridian Health. Previously at Searchless AI. Available for thoughtful projects.",
        avatar: '/about/avatar.svg',
        location: 'Chicago, IL',
        email: 'you@example.com',
        phone: '',
        resumeUrl: '/resume',
        website: '#',
        linktreeUrl: '#',
        languages: [{ name: 'English', level: 'Native' }],
        socialLinks: [
            {
                platform: 'GitHub',
                url: '#',
                icon: 'github',
                username: 'your-github',
            },
            {
                platform: 'LinkedIn',
                url: '#',
                icon: 'linkedin',
                username: 'your-linkedin',
            },
            {
                platform: 'Instagram',
                url: '#',
                icon: 'instagram',
                username: 'your-handle',
            },
        ],
    },
    projects: [
        {
            id: 'meridian-health',
            slug: 'meridian-health',
            title: 'Meridian Health',
            description: 'When therapists spend less time clicking, they have more time for patients.',
            image: '/project/meridian-health.svg',
            longDescription:
                'Therapists were documenting several sessions a day through a maze of screens, duplicate fields, and a back button that did not always save. The work was to make session notes feel like telling the story of what happened, not like filling a database.',
            techStack: ['Figma', 'FigJam', 'User research', 'Prototyping', 'React'],
            techGroups: productTechGroups,
            tools: ['Figma', 'FigJam', 'Miro'],
            status: 'completed',
            startDate: '2026-01-01',
            endDate: '2026-03-19',
            role: 'Product Designer',
            roleDescription: 'Research, flow mapping, IA, and UI for clinical documentation.',
            customTimeline: '8 weeks',
            team: '2 engineers, 1 PM, me',
            categories: ['UI Designer', 'Product Designer'],
            industries: ['Healthcare', 'Workflow Design'],
            platform: 'Web',
            contribution: 'Mapped the full documentation journey and redesigned progress, save feedback, and information architecture.',
            outcome: {
                shipped: 'Shipped a 7-step documentation flow with persistent progress and live last-saved feedback.',
                metrics: [
                    'Documentation time moved from 15-20 minutes toward 7-10 minutes in the sample writeup.',
                    'Support tickets about lost work dropped in the first month of the sample story.',
                ],
                quotes: [
                    'This is exactly what I needed. I can finally see where I am.',
                    'I have not lost a note since the update.',
                ],
            },
            demoUrl: '#',
            galleryImages: [
                '/project/meridian-health.svg',
                '/project/meridian-health-flow.svg',
                '/project/placeholder-wide.svg',
            ],
            highlights: [
                '12 screens consolidated to 7',
                'Progress always visible',
                'Auto-save with last-saved time',
            ],
            caseStudy: sampleCaseStudy({
                problem:
                    'Therapists at Meridian Health documented 3 to 5 client sessions a day. Each note meant clicking through about 12 screens, re-entering the same facts, and hoping nothing crashed. People lost work, got lost in the flow, and spent 15 to 20 minutes per note while clients waited.',
                problemDetail:
                    'The interface gave no sense of progress. The last screen was never obviously the last screen. Back sometimes saved and sometimes did not. There was no auto-save, so one misclick could erase a careful note. Screens had been built separately over time and never stitched into one journey.',
                fix: 'Three changes fit the constraints: a persistent progress indicator, auto-save with a live last-saved time, and grouping fields the way therapists think about a session (context, observations, interventions, next steps) instead of the way the database happened to be structured. No backend overhaul.',
                happened:
                    'Wireframes were tested with an internal clinical expert and customer success, who talk to therapists daily. Grouping treatment goals with session interventions looked tidy on paper and was wrong in practice. Goals get reviewed before a session. Interventions get written after. The save toast was too brief, so it became a persistent last-saved clock. A small beta noticed the progress bar within minutes.',
                changed:
                    'In the sample story, documentation time dropped, lost-work tickets fell, and most therapists called the new system easier. Nobody asked to go back. That was the success metric that mattered.',
                constraints:
                    'No direct access to therapists because of privacy rules. A third-party component library that could not be restyled. An 8-week deadline. The work had to be the highest-impact changes with the least structural upheaval.',
                learned:
                    'Focused changes beat a fantasy rebuild. Mental models beat tidy logic. Making an invisible save state visible built more trust than another visual polish pass.',
                image: '/project/meridian-health-flow.svg',
                imageAlt: 'Placeholder diagram for the Meridian Health documentation flow',
            }),
        },
        {
            id: 'stylebook',
            slug: 'stylebook',
            title: 'StyleBook',
            description: "From I hate this system to Can we show other salons?",
            image: '/project/stylebook.svg',
            longDescription:
                'A salon operations product that staff described as something they hated. The work was to turn daily booking, client notes, and checkout into a flow people would actually show a neighboring salon.',
            techStack: ['Figma', 'User research', 'SaaS', 'Prototyping'],
            tools: ['Figma', 'Miro'],
            status: 'completed',
            startDate: '2026-01-01',
            endDate: '2026-03-02',
            role: 'Product Designer',
            roleDescription: 'End-to-end product design for salon staff workflows.',
            customTimeline: '8 weeks',
            team: '2 engineers, 1 PM, me',
            categories: ['Product Designer', 'UI Designer'],
            industries: ['SaaS', 'Transformation'],
            platform: 'Web',
            contribution: 'Rebuilt the staff mental model for booking, notes, and checkout so the product felt showable.',
            outcome: {
                shipped: 'Shipped a calmer staff console with progress, safer edits, and fewer duplicate fields.',
            },
            demoUrl: '#',
            galleryImages: ['/project/stylebook.svg', '/project/placeholder-wide.svg'],
            highlights: ['Staff-first IA', 'Safer edits', 'Showable to other salons'],
            caseStudy: sampleCaseStudy({
                problem:
                    'Stylists and front-desk staff were bouncing through a pile of screens to book a chair, write a client note, and close out a visit. The same client facts were typed in more than once. People were not sure when a booking was actually saved.',
                problemDetail:
                    'The product had grown screen by screen. Nothing told you how much of the visit was left. A back action could drop an unsaved note. Staff language and database language were not the same thing.',
                fix: 'Map the real visit, not the schema. Keep progress visible. Save with a last-saved time people can trust. Group booking, service, notes, and checkout the way a salon actually runs a chair.',
                happened:
                    'Early grouping put retail add-ons next to service notes because they looked related. Stylists think about those at different times. Labels were rewritten from staff language. A short beta in one salon was enough to catch the remaining dead ends.',
                changed:
                    'The sample story ends with staff asking to show the system to other salons. That sentence is the point of the case study, not a dashboard screenshot.',
                constraints:
                    'A fixed component library, a short timeline, and limited time on the floor during busy hours. Changes had to ship without a platform rewrite.',
                learned:
                    'If people hate a system, they will tell you in one sentence. Design until that sentence changes. Invisible save states and duplicate fields were doing more damage than the visual theme.',
                image: '/project/stylebook.svg',
                imageAlt: 'Placeholder frame for the StyleBook staff console',
            }),
        },
        {
            id: 'homestead',
            slug: 'homestead',
            title: 'Homestead',
            description: 'Helping first-time homebuyers actually understand what they are looking at.',
            image: '/project/homestead.svg',
            longDescription:
                'A 0 to 1 proptech product for first-time buyers who can open a listing and still not know what the numbers, contingencies, or next step actually mean.',
            techStack: ['Figma', 'Prototyping', 'User research', 'Next.js'],
            tools: ['Figma', 'FigJam'],
            status: 'completed',
            startDate: '2025-01-02',
            endDate: '2025-06-01',
            role: 'Product Designer',
            roleDescription: '0 to 1 product design for first-time buyer comprehension.',
            customTimeline: '0 to 1',
            team: 'Small product team',
            categories: ['Product Designer'],
            industries: ['Proptech', '0 to 1'],
            platform: 'Web',
            contribution: 'Designed listing comprehension, plain-language explanations, and a calmer next-step path.',
            outcome: {
                shipped: 'Shipped a listing view that explains the deal in buyer language before it asks for a tour.',
            },
            demoUrl: '#',
            galleryImages: ['/project/homestead.svg', '/project/placeholder-wide.svg'],
            highlights: ['Plain language', 'First-time buyer path', '0 to 1'],
            caseStudy: sampleCaseStudy({
                problem:
                    'First-time buyers were staring at listings full of jargon, stacked fees, and calls to action that assumed they already knew the process. People could open a page and still not know what they were looking at.',
                problemDetail:
                    'The product explained the house. It did not explain the decision. Comparables, contingencies, and next steps lived on different screens. Progress through a first offer was invisible.',
                fix: 'Lead with what this listing means, then the facts. Keep a persistent sense of where you are in touring, offering, and closing. Save notes in language a buyer would actually write down.',
                happened:
                    'An early version grouped financing with inspection because both felt like paperwork. Buyers meet those at different emotional moments. Copy was rewritten until a first-time buyer could explain the page back.',
                changed:
                    'The sample story is about comprehension, not conversion tricks. If someone can tell you what they are looking at, they can decide whether to keep going.',
                constraints:
                    'Regulated language, a young marketplace, and a timeline that could not wait for a custom design system. Existing patterns had to carry the new IA.',
                learned:
                    'Jargon is a product bug. Showing progress through a scary process is not decoration. It is how people stay oriented.',
                image: '/project/homestead.svg',
                imageAlt: 'Placeholder frame for the Homestead listing comprehension view',
            }),
        },
        {
            id: 'north-light',
            slug: 'north-light',
            title: 'North Light',
            description: 'Getting seven stakeholders to agree on what they are actually building.',
            image: '/project/north-light.svg',
            longDescription:
                'An enterprise strategy engagement where seven stakeholders each had a different picture of the product. The design work was alignment: a shared object, a shared vocabulary, and a build sequence people could defend.',
            techStack: ['Figma', 'FigJam', 'Miro', 'Workshop facilitation'],
            tools: ['Figma', 'Miro', 'FigJam'],
            status: 'completed',
            startDate: '2026-01-01',
            endDate: '2026-03-19',
            role: 'Product Designer',
            roleDescription: 'Facilitation, service mapping, and a shared product definition.',
            customTimeline: '8 weeks',
            team: 'Cross-functional stakeholders',
            categories: ['Product Designer'],
            industries: ['Strategy', 'Enterprise'],
            platform: 'Web',
            contribution: 'Ran the alignment work that turned seven competing briefs into one build sequence.',
            outcome: {
                shipped: 'Shipped a shared product definition, a sequenced roadmap, and UI that matched the agreement.',
            },
            demoUrl: '#',
            requiresPasscode: true,
            galleryImages: ['/project/north-light.svg', '/project/placeholder-wide.svg'],
            highlights: ['Seven stakeholders', 'Shared definition', 'Enterprise strategy'],
            caseStudy: sampleCaseStudy({
                problem:
                    'Seven stakeholders were funding and reviewing the same product and describing different jobs. Meetings restarted from vocabulary. Engineering was waiting on a definition that did not exist yet.',
                problemDetail:
                    'Each group had slides. Nobody had a single object that said what was in, what was out, and what the first shippable slice was. Progress through the decision was as invisible as a 12-screen form.',
                fix: 'Make the disagreement visible. Map the jobs, force a shared object, and sequence a first slice that every function could defend. Then design the UI to that object, not to the loudest slide.',
                happened:
                    'Workshops caught a false consensus: people nodded at words like platform and still meant different surfaces. The artifact that unlocked the room was a one-page definition with in-scope, out-of-scope, and a first release.',
                changed:
                    'The sample story is not a metric dashboard. It is seven people able to point at the same thing and say that is what we are building.',
                constraints:
                    'Enterprise review cycles, no access to every end user, and a deadline that could not wait for a ground-up rebuild of the existing system.',
                learned:
                    'Alignment is a design problem. If the object is fuzzy, the interface will be fuzzy. A short shared definition beats a long deck.',
                image: '/project/north-light.svg',
                imageAlt: 'Placeholder frame for the North Light alignment artifact',
            }),
        },
    ],
    experiences: [
        {
            id: 'exp-meridian',
            company: 'Meridian Health',
            position: 'Product Designer',
            description:
                'Designing clinical and operational product surfaces so therapists spend less time in the interface and more time with patients.',
            responsibilities: [
                'Mapped documentation and scheduling journeys with clinical partners.',
                'Shipped progress, save, and IA changes inside an existing component library.',
                'Facilitated research through directors and support tickets when direct shadowing was not possible.',
            ],
            skills: ['Product Design', 'Workflow Design', 'Healthcare', 'Figma'],
            startDate: '2025-06-01',
            isOngoing: true,
            location: 'Chicago, IL',
            type: 'full-time',
            logoBg: 'bg-black',
        },
        {
            id: 'exp-searchless',
            company: 'Searchless AI',
            position: 'Product Designer',
            description:
                'Product design for an AI search company, turning messy retrieval ideas into interfaces people could actually complete.',
            responsibilities: [
                'Designed search, review, and handoff flows for internal and customer teams.',
                'Ran critique and prototype tests that killed clever patterns that failed real tasks.',
            ],
            skills: ['Product Design', 'AI products', 'Prototyping'],
            startDate: '2023-08-01',
            endDate: '2025-05-01',
            isOngoing: false,
            location: 'Chicago, IL',
            type: 'full-time',
            logoBg: 'bg-white',
        },
        {
            id: 'exp-freelance',
            company: 'Independent',
            position: 'Product Designer',
            description: 'Select freelance work for thoughtful product teams that need clarity more than decoration.',
            responsibilities: [
                '0 to 1 product definition, IA, and UI for small teams.',
                'Workshop facilitation when stakeholders did not share a picture of the product.',
            ],
            skills: ['Product Design', 'Facilitation', 'IA'],
            startDate: '2022-01-01',
            endDate: '2023-07-01',
            isOngoing: false,
            type: 'freelance',
            logoBg: 'bg-white',
        },
    ],
    education: [
        {
            id: 'edu-saic',
            institution: 'School of the Art Institute of Chicago',
            degree: 'BFA',
            major: 'Visual Communication',
            startDate: '2018-09-01',
            endDate: '2022-05-01',
            isOngoing: false,
            achievements: ['Sample credential. Replace with your own.'],
        },
        {
            id: 'edu-boot',
            institution: 'Design Intensive',
            degree: 'Certificate',
            major: 'Product Design',
            startDate: '2022-06-01',
            endDate: '2022-08-01',
            isOngoing: false,
        },
    ],
    achievements: [
        {
            id: 'cert-sample-1',
            title: 'Sample workshop credential',
            issuer: 'Example Institute',
            date: '2025-01-01',
            category: 'certification',
            image: '/certificate/sample.svg',
        },
        {
            id: 'cert-sample-2',
            title: 'Sample product design course',
            issuer: 'Example Academy',
            date: '2024-06-01',
            category: 'certification',
            image: '/certificate/sample.svg',
        },
    ],
    techStack: [
        { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma', category: 'tool' },
        { name: 'React', icon: 'https://cdn.simpleicons.org/react', category: 'framework' },
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs', category: 'framework' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', category: 'language' },
        { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss', category: 'library' },
        { name: 'Framer', icon: 'https://cdn.simpleicons.org/framer', category: 'tool' },
        { name: 'Notion', icon: 'https://cdn.simpleicons.org/notion', category: 'tool' },
    ],
    hardSkills: [
        { name: 'Product Design', level: 'expert', category: 'software', description: 'End-to-end product design from research through UI.' },
        { name: 'Interaction Design', level: 'advanced', category: 'software', description: 'Flows, states, and micro-interactions that keep people oriented.' },
        { name: 'User Research', level: 'advanced', category: 'other', description: 'Interviews, ticket mining, and prototype tests with the people who do the work.' },
        { name: 'Prototyping', level: 'advanced', category: 'software', description: 'Figma and front-end prototypes that can be argued with.' },
        { name: 'Information Architecture', level: 'advanced', category: 'software', description: 'Grouping work the way users think, not the way the database is shaped.' },
        { name: 'Motion Design', level: 'intermediate', category: 'other', description: 'Motion that explains state instead of decorating it.' },
    ],
    softSkills: [
        { name: 'Facilitation', description: 'Getting a room to agree on the object they are building.' },
        { name: 'Critique', description: 'Saying what is not working without making the work smaller.' },
        { name: 'Writing', description: 'Interface copy that a first-time user can repeat back.' },
        { name: 'Stakeholder management', description: 'Seven opinions, one definition.' },
    ],
    tools: [
        { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma', category: 'design' },
        { name: 'FigJam', icon: 'https://cdn.simpleicons.org/figma', category: 'design' },
        { name: 'Miro', icon: 'https://cdn.simpleicons.org/miro', category: 'productivity' },
        { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', category: 'devops' },
        { name: 'Cursor', icon: 'https://cdn.simpleicons.org/cursor', category: 'ide' },
        { name: 'Notion', icon: 'https://cdn.simpleicons.org/notion', category: 'productivity' },
    ],
    faqs: [
        {
            question: 'What do you specialize in?',
            answer: 'I am a product designer in Chicago. I work on complicated workflows until they feel simple enough to show someone else.',
        },
        {
            question: 'What kinds of projects are you looking for?',
            answer: 'Thoughtful product work: healthcare, SaaS, 0 to 1, and enterprise alignment where the interface is doing real labor.',
        },
        {
            question: 'Are you available for opportunities?',
            answer: 'Yes. Reach out at you@example.com. Replace this with your real contact path.',
        },
    ],
    blogs: [
        {
            id: 'blog-1',
            slug: 'progress-is-a-feature',
            title: 'Progress is a feature',
            excerpt: 'If people cannot tell where they are, they will not trust the rest of the interface.',
            content: 'Sample post. Replace with your writing.',
            image: '/placeholders/blog.svg',
            date: '2026-03-20',
            category: 'product-design',
            tags: ['UX', 'Workflows'],
            author: { name: 'Bejaman', avatar: '/about/avatar.svg' },
            readTime: '4',
        },
        {
            id: 'blog-2',
            slug: 'mental-models-beat-logic',
            title: 'Mental models beat tidy logic',
            excerpt: 'Grouping related fields is not the same as grouping related moments.',
            content: 'Sample post. Replace with your writing.',
            image: '/placeholders/blog.svg',
            date: '2026-03-05',
            category: 'product-design',
            tags: ['IA', 'Research'],
            author: { name: 'Bejaman', avatar: '/about/avatar.svg' },
            readTime: '5',
        },
        {
            id: 'blog-3',
            slug: 'alignment-is-design',
            title: 'Alignment is design',
            excerpt: 'Seven stakeholders and one object. The deck is not the product.',
            content: 'Sample post. Replace with your writing.',
            image: '/placeholders/blog.svg',
            date: '2026-02-18',
            category: 'about-me',
            tags: ['Strategy', 'Enterprise'],
            author: { name: 'Bejaman', avatar: '/about/avatar.svg' },
            readTime: '4',
        },
    ],
    gallery: [],
};
