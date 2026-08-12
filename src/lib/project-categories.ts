import type { Project } from '@/types';

export const PROJECT_ROLE_CATEGORIES = [
    'UI Designer',
    'Design Engineer',
    'Product Designer',
    'Product Owner',
    'Designer',
] as const;

export type ProjectRoleCategory = (typeof PROJECT_ROLE_CATEGORIES)[number];

export function getProjectCategories(project: Pick<Project, 'categories' | 'category'>): string[] {
    if (project.categories?.length) return project.categories;
    if (project.category) return [project.category];
    return [];
}

export function projectMatchesCategory(
    project: Pick<Project, 'categories' | 'category'>,
    filterId: string,
): boolean {
    if (filterId === 'All') return true;
    return getProjectCategories(project).includes(filterId);
}

/** Short label for cards — shows the primary role, with a +N suffix when tagged multiple ways. */
export function formatProjectCategoryLabel(
    project: Pick<Project, 'categories' | 'category'>,
    maxVisible = 1,
): string {
    const cats = getProjectCategories(project);
    if (!cats.length) return '';
    if (cats.length <= maxVisible) return cats.join(' · ');
    const visible = cats.slice(0, maxVisible).join(' · ');
    return `${visible} +${cats.length - maxVisible}`;
}
