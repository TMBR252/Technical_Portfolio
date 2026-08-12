import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display, Alex_Brush } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider, I18nProvider, SmoothScrollProvider } from '@/providers';
import { MarvinPageContextProvider } from '@/providers/MarvinPageContextProvider';
import { portfolioData } from '@/data/portfolio';

/** Design tokens (brand, type, radius) → src/styles/tokens.css - see README */
import '@/styles/globals.css';

/** Face loaders - CSS vars referenced by Tailwind fontFamily in tailwind.config.ts */
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const signature = Alex_Brush({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-signature',
    display: 'swap',
});

const siteName = portfolioData.personal.name;
const siteTitle = portfolioData.personal.title;
const siteDescription = portfolioData.personal.subtitle;

export const metadata: Metadata = {
    title: {
        default: `${siteName} | ${siteTitle}`,
        template: '%s | Portfolio',
    },
    description: siteDescription,
    keywords: ['product designer', 'portfolio', 'product design', 'UX', 'nextjs'],
    authors: [{ name: siteName }],
    creator: siteName,
    metadataBase: new URL('https://your-domain.com'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://your-domain.com',
        title: `${siteName} | ${siteTitle}`,
        description: siteDescription,
        siteName: 'Portfolio',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${siteName} | ${siteTitle}`,
        description: siteDescription,
        creator: '@yourusername',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [{ url: '/favicon.svg' }],
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    ],
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
};

import { ThemeAwareClickSpark } from '@/components/ui/ThemeAwareClickSpark';
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation';
import { SquareTransitionWrapper } from '@/components/layout/SquareTransitionWrapper';
import { ChatBot } from '@/components/layout/ChatBot';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${signature.variable} font-sans relative`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <I18nProvider locale={locale} messages={messages}>
                        <MarvinPageContextProvider>
                        {/* Page shell becomes the framed card when Marvin is open */}
                        <div id="marvin-page-shell" className="marvin-page-shell">
                            <SmoothScrollProvider>
                                <ThemeAwareClickSpark>
                                    <SquareTransitionWrapper>
                                        <ConditionalNavigation>
                                            {children}
                                        </ConditionalNavigation>
                                    </SquareTransitionWrapper>
                                </ThemeAwareClickSpark>
                            </SmoothScrollProvider>
                        </div>
                        {/* Chat stays outside the shell so it can be a sibling frame */}
                        <ChatBot headless />
                        </MarvinPageContextProvider>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
