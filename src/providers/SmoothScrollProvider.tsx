'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

function LenisMarvinBridge() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const shell = () => document.getElementById("marvin-page-shell");

        const sync = () => {
            const open = document.documentElement.dataset.marvinOpen === "true";
            const el = shell();

            if (open) {
                // lenis.stop() preventDefaults wheel/touch globally; opt the
                // framed shell out so it can native-scroll while Marvin is open.
                el?.setAttribute("data-lenis-prevent", "");
                lenis.stop();
            } else {
                el?.removeAttribute("data-lenis-prevent");
                lenis.start();
            }
        };

        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-marvin-open"],
        });
        return () => {
            observer.disconnect();
            shell()?.removeAttribute("data-lenis-prevent");
        };
    }, [lenis]);

    return null;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.5,
            smoothWheel: true,
            // smoothTouch is causing TS error in this version's types
            // @ts-ignore
            smoothTouch: false
        }}>
            <LenisMarvinBridge />
            {children}
        </ReactLenis>
    );
}
