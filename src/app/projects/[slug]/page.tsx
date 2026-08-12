import { cookies } from 'next/headers';
import { notFound, permanentRedirect } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';
import { ProjectPageContent } from '@/components/projects/ProjectPageContent';
import { ProjectPasscodeGate } from '@/components/projects/ProjectPasscodeGate';
import { getProjectImages } from '@/app/actions/getProjectImages';
import {
    PROJECT_PASSCODE_COOKIE,
    isPasscodeGatedSlug,
    isValidUnlockToken,
} from '@/lib/project-passcode';

/** Cookie-gated case studies need a request; avoid static/dynamic collision with Turbopack. */
export const dynamic = 'force-dynamic';

const SLUG_REDIRECTS: Record<string, string> = {
    'conduit-routing-automation': 'euler',
    uclid: 'euler',
    'agent-red-team-suite': 'pool-bot',
    'property-intelligence-system': 'pool-bot',
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const redirected = SLUG_REDIRECTS[slug];
    if (redirected) {
        permanentRedirect(`/projects/${redirected}`);
    }

    return <ProjectPageBody slug={slug} />;
}

async function ProjectPageBody({ slug }: { slug: string }) {
    const project = portfolioData.projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const gated = Boolean(project.requiresPasscode) || isPasscodeGatedSlug(slug);
    if (gated) {
        const cookieStore = await cookies();
        const unlocked = isValidUnlockToken(cookieStore.get(PROJECT_PASSCODE_COOKIE)?.value);
        if (!unlocked) {
            return <ProjectPasscodeGate slug={slug} title={project.title} />;
        }
    }

    const galleryImages = await getProjectImages(slug, project.title);

    const updatedProject = {
        ...project,
        image: galleryImages.length > 0 ? galleryImages[0] : project.image,
        galleryImages: project.galleryImages?.length
            ? project.galleryImages
            : project.caseStudy
              ? []
              : galleryImages.length > 1
                ? galleryImages.slice(1)
                : galleryImages.length === 0
                  ? project.galleryImages
                  : [],
    };

    return <ProjectPageContent project={updatedProject} />;
}
