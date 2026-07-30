import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display, Alex_Brush } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider, I18nProvider, SmoothScrollProvider } from '@/providers';

import '@/styles/globals.css';

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

export const metadata: Metadata = {
    title: {
        default: 'Tyler Bryan | Product Engineer',
        template: '%s | Portfolio',
    },
    description: 'Product Engineer taking complex, expert-driven automation products from 0 to 1. Agentic architectures, human-in-the-loop systems, and evaluation frameworks.',
    keywords: ['product engineer', 'portfolio', 'AI products', 'agentic systems', 'automation', 'human-in-the-loop', 'nextjs'],
    authors: [{ name: 'Tyler Bryan' }],
    creator: 'Tyler Bryan',
    metadataBase: new URL('https://your-domain.com'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://your-domain.com',
        title: 'Tyler Bryan | Product Engineer',
        description: 'Product Engineer taking complex, expert-driven automation products from 0 to 1.',
        siteName: 'Portfolio',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tyler Bryan | Product Engineer',
        description: 'Product Engineer taking complex, expert-driven automation products from 0 to 1.',
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
import { ArcPreloaderWrapper } from '@/components/layout/ArcPreloaderWrapper';
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
            <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${signature.variable} font-sans relative`}>
                <ThemeProvider>
                    <I18nProvider locale={locale} messages={messages}>
                        {/* Page shell becomes the framed card when Marvin is open */}
                        <div id="marvin-page-shell" className="marvin-page-shell">
                            <SmoothScrollProvider>
                                <ThemeAwareClickSpark>
                                    <ArcPreloaderWrapper>
                                        <ConditionalNavigation>
                                            {children}
                                        </ConditionalNavigation>
                                    </ArcPreloaderWrapper>
                                </ThemeAwareClickSpark>
                            </SmoothScrollProvider>
                        </div>
                        {/* Chat stays outside the shell so it can be a sibling frame */}
                        <ChatBot headless />
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
