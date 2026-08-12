'use client';
import { useState, useEffect } from 'react';
import { BREAKPOINTS, getViewportBand } from '@/lib/breakpoints';

/**
 * Detect performance-constrained environments.
 * - isMobile: < md (768)
 * - isTablet: md-lg (768-1023)
 * - isLowPowerMode: mobile or tablet
 */
export function usePerformance() {
    const [hasMounted, setHasMounted] = useState(false);
    const [state, setState] = useState({
        isMobile: false,
        isTablet: false,
        isLowPowerMode: true,
    });

    useEffect(() => {
        setHasMounted(true);
        const checkPerformance = () => {
            const width = window.innerWidth;
            const band = getViewportBand(width);
            const isMobile = band === 'mobile';
            const isTablet = band === 'tablet';

            setState({
                isMobile,
                isTablet,
                isLowPowerMode: isMobile || isTablet,
            });
        };

        checkPerformance();
        window.addEventListener('resize', checkPerformance);
        return () => window.removeEventListener('resize', checkPerformance);
    }, []);

    if (!hasMounted) {
        return {
            isMobile: false,
            isTablet: false,
            isLowPowerMode: true,
        };
    }

    return state;
}

// Re-export for callers that need the token
export { BREAKPOINTS };
