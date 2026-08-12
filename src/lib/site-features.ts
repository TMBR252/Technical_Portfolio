/**
 * Temporary site-surface flags.
 * Flip `fullAboutNav` to `true` to restore Blog, Life, and Skills
 * in the About mega-menu, mobile nav, footer, and about hubs.
 */
export const SITE_FEATURES = {
    fullAboutNav: false,
} as const;

export const showAboutSkills = () => SITE_FEATURES.fullAboutNav;
export const showAboutBlog = () => SITE_FEATURES.fullAboutNav;
export const showAboutLife = () => SITE_FEATURES.fullAboutNav;
