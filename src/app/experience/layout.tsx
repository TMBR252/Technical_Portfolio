import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Journey',
    description: 'Skills, education, and the roles that connect architecture to products.',
};

export default function ExperienceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
