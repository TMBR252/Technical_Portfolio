"use client";

import { SquareRevealHero } from "@/components/ui/square-reveal-hero";

export function SquareTransitionWrapper({ children }: { children: React.ReactNode }) {
    return <SquareRevealHero>{children}</SquareRevealHero>;
}
