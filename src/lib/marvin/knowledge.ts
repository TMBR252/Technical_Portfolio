/**
 * Portfolio facts, formatted for the prompt.
 *
 * This file formats facts and never expresses opinions. If a sentence would
 * read differently for a different person's portfolio, it is voice and belongs
 * in `persona.ts`.
 *
 * The knowledge itself lives in `@/data/portfolio`; this only serializes it.
 */
import { portfolioData } from '@/data/portfolio';
import { getProjectCategories } from '@/lib/project-categories';

const MAX_PROJECTS = 12;
const MAX_EXPERIENCES = 8;
const MAX_SKILLS = 40;

function formatExperiencePeriod(e: {
    startDate?: string;
    endDate?: string;
    isOngoing?: boolean;
    period?: string;
    duration?: string;
}): string {
    if (e.period || e.duration) return e.period ?? e.duration ?? '';
    if (!e.startDate) return '';
    const start = e.startDate.slice(0, 7);
    if (e.isOngoing) return `${start} - present`;
    if (e.endDate) return `${start} - ${e.endDate.slice(0, 7)}`;
    return start;
}

/** The subject of the portfolio, as the persona needs to refer to them. */
export function getSubject() {
    const { personal } = portfolioData as any;
    const fullName: string = personal.name;
    const firstName = String(fullName).trim().split(/\s+/)[0] || fullName;
    // Configured per site in data/portfolio.ts. Defaults to they/them rather
    // than guessing from a name.
    const pronouns: string = personal.pronouns ?? 'they/them';
    return { fullName, firstName, pronouns };
}

export function buildKnowledge(): string {
    const { personal, projects, experiences, education, hardSkills, techStack, softSkills, tools } =
        portfolioData as any;

    const projectList = (projects ?? [])
        .slice(0, MAX_PROJECTS)
        .map(
            (p: any) =>
                `- ${p.title} (${getProjectCategories(p).join(' / ') || 'Uncategorized'}): ${p.description}. Tech: ${(p.techStack ?? []).join(', ')}. ${p.demoUrl && p.demoUrl !== '#' ? `Demo: ${p.demoUrl}` : ''}`
        )
        .join('\n');

    const expList = (experiences ?? [])
        .slice(0, MAX_EXPERIENCES)
        .map((e: any) => {
            const period = formatExperiencePeriod(e);
            const summary =
                e.description ||
                (Array.isArray(e.responsibilities) ? e.responsibilities.slice(0, 2).join('; ') : '');
            return `- ${e.role ?? e.position} at ${e.company}${period ? ` (${period})` : ''}: ${summary}`;
        })
        .join('\n');

    const eduList = (education ?? [])
        .map(
            (e: any) =>
                `- ${e.degree} at ${e.institution} (${e.period ?? e.duration ?? e.startDate ?? ''})`
        )
        .join('\n');

    const skillNames = [
        ...(hardSkills ?? []).map((s: any) => s.name),
        ...(techStack ?? []).map((s: any) => s.name ?? s),
    ].filter(Boolean);
    const skillList = [...new Set(skillNames)].slice(0, MAX_SKILLS).join(', ');

    const softSkillList = (softSkills ?? []).map((s: any) => s.name ?? s).join(', ');
    const toolList = (tools ?? []).map((t: any) => t.name ?? t).join(', ');

    return `## Portfolio Data
### Personal
- Name: ${personal.name}
- Title: ${personal.title}
- Subtitle: ${personal.subtitle}
- Bio: ${personal.bio}
- Location: ${personal.location}
- Email: ${personal.email}
- Languages: ${(personal.languages ?? []).map((l: any) => `${l.name} (${l.level})`).join(', ')}
- GitHub: ${(personal.socialLinks ?? []).find((s: any) => s.platform === 'GitHub')?.url ?? ''}
- LinkedIn: ${(personal.socialLinks ?? []).find((s: any) => s.platform === 'LinkedIn')?.url ?? ''}
- Linktree: ${personal.linktreeUrl ?? ''}

### Projects
${projectList || 'No projects listed.'}

### Work Experience
${expList || 'No experience listed.'}

### Education
${eduList || 'No education listed.'}

### Skills
${skillList || 'None listed.'}

### Soft Skills
${softSkillList || 'None listed.'}

### Tools
${toolList || 'None listed.'}`;
}
