'use client';

import { motion } from 'framer-motion';
import { HeroVisual } from "@/components/sections/HeroVisual";
import { usePreloadState } from "@/components/ui/square-reveal-hero";

// Landing-only home: mid-page sections suppressed; hero + footer only.
// SocialCorner removed - it was the floating icon stack on the side.

export default function HomePage() {
    const { phase } = usePreloadState();
    const isReadyToAnimate = phase === "reveal" || phase === "done";

    return (
        <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={isReadyToAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.8 },
            }}
            className="marvin-home-frame relative will-change-transform will-change-opacity lg:h-[100dvh] lg:overflow-hidden"
        >
            <HeroVisual isExiting={isReadyToAnimate} />
        </motion.main>
    );
}
