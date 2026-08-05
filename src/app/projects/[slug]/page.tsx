
import { notFound } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';
import { ProjectPageContent } from '@/components/projects/ProjectPageContent';

export async function generateStaticParams() {
    return portfolioData.projects.map((project) => ({
        slug: project.slug,
    }));
}

import { getProjectImages } from '@/app/actions/getProjectImages'; // Import server action

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = portfolioData.projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    // Projects with a curated, captioned figure set opt out of filesystem discovery —
    // discovery picks up every public/project/<name><n> file, including ones that
    // belong to a different product.
    if (project.figures?.length) {
        return <ProjectPageContent project={project} />;
    }

    // Fetch dynamic images from public/project folder
    const galleryImages = await getProjectImages(slug, project.title);

    // First image = hero; remaining images = gallery (avoid duplicating the hero shot)
    const updatedProject = {
        ...project,
        image: galleryImages.length > 0 ? galleryImages[0] : project.image,
        galleryImages:
            galleryImages.length > 1
                ? galleryImages.slice(1)
                : galleryImages.length === 0
                  ? project.galleryImages
                  : [],
    };

    return <ProjectPageContent project={updatedProject} />;
}
