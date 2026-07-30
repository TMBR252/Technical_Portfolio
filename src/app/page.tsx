'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreen } from '@/components/layout';
import { HeroVisual } from "@/components/sections/HeroVisual";
import { usePreloadState } from "@/components/ui/arc-preloader-hero";

// Landing-only home: mid-page sections suppressed; hero + footer only.
// SocialCorner removed — it was the floating icon stack on the side.

export default function HomePage() {
    const { phase } = usePreloadState();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoadingExit, setIsInitialLoadingExit] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);

    useEffect(() => {
        const hasLoaded = sessionStorage.getItem('portfolioLoaded');
        if (hasLoaded) {
            setSkipAnimation(true);
            setIsLoading(false);
        }
    }, []);

    // Once hero should animate, stay true — do NOT drop when LoadingScreen unmounts
    // while the arc preloader is still in intro/text (that was killing social floats).
    const isReadyToAnimate =
        skipAnimation ||
        isInitialLoadingExit ||
        phase === "reveal" ||
        phase === "done";

    const handleLoadingComplete = () => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'instant' });
        sessionStorage.setItem('portfolioLoaded', 'true');
    };

    const handleExitStart = () => {
        setIsInitialLoadingExit(true);
    };

    return (
        <>
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} onExitStart={handleExitStart} duration={2500} />}
            <motion.main
                initial={skipAnimation ? false : { opacity: 0, y: 40 }}
                animate={skipAnimation ? { opacity: 1, y: 0 } : (isReadyToAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 })}
                transition={{
                    duration: skipAnimation ? 0 : 1.4,
                    ease: skipAnimation ? "linear" : [0.16, 1, 0.3, 1],
                    opacity: { duration: skipAnimation ? 0 : 0.8 }
                }}
                className="marvin-home-frame relative will-change-transform will-change-opacity lg:h-[100dvh] lg:overflow-hidden"
            >
                <HeroVisual isExiting={isReadyToAnimate} />
            </motion.main>
        </>
    );
}
