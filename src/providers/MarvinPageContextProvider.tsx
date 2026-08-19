'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { MarvinPageContext } from '@/lib/marvin-page-context';

interface MarvinPageContextValue {
    pageContext: MarvinPageContext | null;
    setPageContext: (context: MarvinPageContext) => void;
    clearPageContext: () => void;
}

const MarvinPageContextReact = createContext<MarvinPageContextValue | null>(null);

export function MarvinPageContextProvider({ children }: { children: ReactNode }) {
    const [pageContext, setPageContextState] = useState<MarvinPageContext | null>(null);

    const setPageContext = useCallback((context: MarvinPageContext) => {
        setPageContextState(context);
    }, []);

    const clearPageContext = useCallback(() => {
        setPageContextState(null);
    }, []);

    const value = useMemo(
        () => ({ pageContext, setPageContext, clearPageContext }),
        [pageContext, setPageContext, clearPageContext],
    );

    return (
        <MarvinPageContextReact.Provider value={value}>
            {children}
        </MarvinPageContextReact.Provider>
    );
}

export function useMarvinPageContext() {
    const ctx = useContext(MarvinPageContextReact);
    if (!ctx) {
        throw new Error('useMarvinPageContext must be used within MarvinPageContextProvider');
    }
    return ctx;
}

/** Safe for ChatBot - returns null when provider is missing. */
export function useMarvinPageContextOptional() {
    return useContext(MarvinPageContextReact);
}
