import type { Project } from '@/types';
import { getProjectCategories } from '@/lib/project-categories';

export interface MarvinPageContext {
    type: 'project';
    slug: string;
    title: string;
    summary: string;
}

function stripMarkdown(text: string): string {
    return text.replace(/\*\*/g, '');
}

/** Serialize project case-study content for Marvin's system prompt. */
export function buildProjectMarvinSummary(project: Project): string {
    const lines: string[] = [
        `The visitor is on the "${project.title}" project case study page (/projects/${project.slug}).`,
        `Description: ${project.description}`,
    ];

    if (project.longDescription) {
        lines.push(`Overview: ${project.longDescription}`);
    }

    lines.push(
        `Role: ${project.role ?? 'N/A'}. Team: ${project.team ?? 'N/A'}. Timeline: ${project.customTimeline ?? project.startDate}. Status: ${project.status}. Categories: ${getProjectCategories(project).join(', ') || 'N/A'}.`,
    );
    if (project.industries?.length) {
        lines.push(`Industries: ${project.industries.join(', ')}.`);
    }
    if (project.platform) {
        lines.push(`Platform: ${project.platform}.`);
    }
    if (project.contribution) {
        lines.push(`Contribution: ${project.contribution}`);
    }
    if (project.outcome?.shipped) {
        lines.push(`Outcome: ${project.outcome.shipped}`);
        if (project.outcome.metrics?.length) {
            lines.push(`Verified metrics: ${project.outcome.metrics.join('; ')}.`);
        }
    }
    lines.push(`Tech stack: ${project.techStack.join(', ')}.`);

    if (project.tools?.length) {
        lines.push(`Tools: ${project.tools.join(', ')}.`);
    }

    if (project.demoUrl && project.demoUrl !== '#') {
        lines.push(`Live site: ${project.demoUrl}.`);
    }

    if (project.roleDescription) {
        lines.push(`Role detail: ${project.roleDescription}`);
    }

    if (project.highlights?.length) {
        lines.push(`Highlights: ${project.highlights.join('; ')}.`);
    }

    if (project.caseStudy?.length) {
        lines.push('Case study content visible on this page:');
        for (const section of project.caseStudy) {
            lines.push(`## ${section.label}`);
            if (section.body) lines.push(stripMarkdown(section.body));
            for (const block of section.blocks ?? []) {
                const body = block.body ? `: ${stripMarkdown(block.body)}` : '';
                lines.push(`- ${block.title}${body}`);
                if (block.placeholder) {
                    lines.push(
                        `  Planned evidence (${block.placeholder.artifact}): ${block.placeholder.description}`,
                    );
                }
            }
        }
    } else {
        if (project.features?.length) {
            lines.push('Features:');
            for (const group of project.features) {
                lines.push(`- ${group.title}: ${group.items.join('; ')}`);
            }
        }
        if (project.challengesAndSolutions?.length) {
            lines.push('Challenges and solutions:');
            for (const item of project.challengesAndSolutions) {
                lines.push(`- Problem: ${item.problem} Solution: ${item.solution}`);
            }
        }
    }

    return lines.join('\n');
}

export function buildMarvinPageContext(project: Project): MarvinPageContext {
    return {
        type: 'project',
        slug: project.slug,
        title: project.title,
        summary: buildProjectMarvinSummary(project),
    };
}
