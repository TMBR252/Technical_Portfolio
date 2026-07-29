import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/lib/breakpoints';

export function useIsMobile(breakpoint: number = BREAKPOINTS.MD) {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [breakpoint]);

    return isMobile;
}
